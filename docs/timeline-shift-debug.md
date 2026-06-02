# Desktop timeline — "right shift on mount" debug

> **RESOLVED.** Root cause: a ~3px **phantom horizontal overflow** — something
> spanned the full window width incl. the scrollbar gutter (a full-bleed
> `position:fixed` layer / pseudo; never showed as a normal overflowing child).
> `documentElement.scrollWidth` hit `innerWidth`, so a thin horizontal bar
> appeared and the GSAP-pinned timeline looked shifted. Fix: `html {
> overflow-x: clip }` in `app/desktop.css` — clips the X axis only, so no forced
> scrollbar and the Y-axis sticky pin is untouched. Only reproduced in browsers
> with classic (non-overlay) scrollbars. Investigation notes kept below.


**Symptom:** on `/d`, when the timeline (`#about`) scene mounts it's "a little
right shifted" — looks like a brief horizontal scrollbar / content nudged right.

**Status:** not reproducible in a headless/automated Chrome — the section's
x‑position is constant frame‑by‑frame from load through scroll. So it only shows
in a real browser (classic scrollbar timing, font reflow, Lenis, or the GSAP
pin). Need data from the affected browser.

## Already tried (didn't fix it)
- Global `html { overflow-y: scroll }` (reserve scrollbar gutter) — reverted,
  it forced an always-visible scrollbar everywhere and didn't fix the shift.
- Scoped `html:has([data-scene="about"]) { overflow-y: scroll }` in
  `app/desktop.css` — home-only gutter reserve. Harmless, but did **not** fix
  the shift (confirmed after `rm -rf .next`). So the cause is NOT the scrollbar
  gutter timing.

## Diagnostic snippet
Paste in the browser console on `/d`, then trigger the shift within 6s (scroll
the timeline into view; or for a load-time shift, enable console "Preserve log",
paste, then reload). It auto-stops after 6s and prints a table + a copyable JSON.

```js
(()=>{const f=e=>e?`${Math.round(e.getBoundingClientRect().left*10)/10}|${Math.round(e.getBoundingClientRect().width)}`:'-';
const pick=()=>({t:Math.round(performance.now()),inner:innerWidth,client:document.documentElement.clientWidth,scrollW:document.documentElement.scrollWidth,about:f(document.querySelector('#about')),shell:f(document.querySelector('.page-shell')),title:f(document.querySelector('[data-section-title]'))});
const rows=[];let last='';const end=performance.now()+6000;
const tick=()=>{const r=pick();const k=JSON.stringify({...r,t:0});if(k!==last){last=k;rows.push(r);}if(performance.now()<end)requestAnimationFrame(tick);else{console.table(rows);console.log('COPY THIS:',JSON.stringify(rows));}};tick();})()
```

## How to read the output
Each row = a moment the horizontal layout changed.
- **`client` changes** (e.g. 1920 → 1905): the vertical scrollbar toggled →
  it *is* a scrollbar-width issue.
- **`shell` left changes**: the centred content moved → different cause
  (Lenis init, GSAP pin offset, or font/`md:` reflow).
- **`scrollW` > `client`**: genuine horizontal overflow (something exceeds the
  viewport width).
- **`about`/`title` left changes** but `shell` doesn't: the shift is inside the
  section (grid columns / pin transform), not the page frame.

Paste the `COPY THIS:` JSON back and the moving value points straight at the
cause.

## Update — it's a 3px horizontal overflow, not a transient shift
Capture on a real browser (inner 1900 / client 1897 / scrollW 1900) showed a
**persistent 3px horizontal overflow** = exactly the scrollbar width. Something
is sized to the full window width (incl. the scrollbar). No literal `100vw` /
`w-screen` found in code, so identify the element directly:

```js
(()=>{const cw=document.documentElement.clientWidth;const out=[];
document.querySelectorAll('*').forEach(el=>{const r=el.getBoundingClientRect();
if(r.right>cw+0.5&&r.width>0&&r.height>0){const cs=getComputedStyle(el);
out.push({sel:el.tagName.toLowerCase()+(el.className?'.'+String(el.className).trim().split(/\s+/).slice(0,2).join('.'):''),right:Math.round(r.right),width:Math.round(r.width),pos:cs.position});}});
out.sort((a,b)=>b.right-a.right);console.log('clientWidth',cw);console.log('OVERFLOW',JSON.stringify(out.slice(0,10)));})()
```

Run on `/d`, paste back the `OVERFLOW` list. The element(s) with `right ≈ 1900`
(= window inner width) are the culprits → fix that element's width (use `100%`
not `100vw`, or constrain it). If the top offender is `position: fixed`, it's
the parallax bg / cursor; if it's an unknown injected node, it's a browser
extension.

## Update 2 — the decorative icon is a red herring (it's clipped)
The first overflow snippet surfaced an `opacity:0` `ExternalLink` icon at
`right:2003` (`ProjectsShowcaseCinematic.tsx` intro title), but `#psc-stage`
has `overflow:hidden` so it's clipped → it does NOT contribute to scrollWidth.
The real 3px overflow is an **unclipped** element reaching ~window-inner-width
(under the scrollbar) — likely a `position:fixed` full-width element. Use this
snippet which skips clipped elements:

```js
(()=>{const cw=document.documentElement.clientWidth,sw=document.documentElement.scrollWidth;const out=[];
document.querySelectorAll('*').forEach(el=>{const r=el.getBoundingClientRect();
if(r.right>cw+0.5&&r.width>0&&r.height>0){let clipped=false,a=el.parentElement;
while(a){const cs=getComputedStyle(a);if(/(hidden|clip|auto|scroll)/.test(cs.overflowX)){const ar=a.getBoundingClientRect();if(r.right>ar.right+0.5){clipped=true;break;}}a=a.parentElement;}
if(!clipped)out.push({sel:el.tagName.toLowerCase()+(el.className?'.'+String(el.className).trim().split(/\s+/).slice(0,2).join('.'):''),right:Math.round(r.right*10)/10,width:Math.round(r.width),pos:getComputedStyle(el).position});}});
out.sort((x,y)=>y.right-x.right);console.log('cw',cw,'sw',sw);console.log('REAL_OVERFLOW',JSON.stringify(out.slice(0,12)));})()
```

The top `REAL_OVERFLOW` entry (right ≈ window inner width) is the actual cause.

## Notes
- The timeline uses a GSAP pin (`SceneTimeline.tsx`) and `marginTop: -100dvh`
  to overlap the previous (experiments) scene for parallax.
- Dev-server caveat seen during this debug: Turbopack sometimes stops
  recompiling `app/tokens.css` (chunk hash frozen); `rm -rf .next` + restart
  clears it.
