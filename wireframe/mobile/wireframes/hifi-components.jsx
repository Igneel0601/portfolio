// hifi-components.jsx — shared mobile components for igneel.dev hi-fi
// All components exported to window so Mobile Hi-Fi.html can use them.

/* ── DESIGN TOKENS (matches globals.css exactly) ─────────── */
const T = {
  paper:   '#0e1116',
  paper2:  '#161b22',
  paper3:  '#1c2330',
  ink:     '#e6edf3',
  inkSoft: '#8b949e',
  inkDim:  '#5b6573',
  hair:    'rgba(230,237,243,.10)',
  hair2:   'rgba(230,237,243,.18)',
  accent:  '#6ee7a7',
  accent2: '#5eead4',
  hl:      'rgba(110,231,167,.22)',
};
const SERIF = '"Fraunces", ui-serif, Georgia, serif';
const MONO  = '"IBM Plex Mono", ui-monospace, monospace';

/* ── TYPE SCALE (mob-t-* values at 390px) ────────────────── */
const TS = {
  display: { fontFamily: SERIF, fontSize: 36, lineHeight: .95,  fontWeight: 800, letterSpacing: '-.022em' },
  h1:      { fontFamily: SERIF, fontSize: 28, lineHeight: 1.0,  fontWeight: 800, letterSpacing: '-.015em' },
  h2:      { fontFamily: SERIF, fontSize: 22, lineHeight: 1.05, fontWeight: 700, letterSpacing: '-.01em'  },
  h3:      { fontFamily: SERIF, fontSize: 18, lineHeight: 1.15, fontWeight: 700 },
  h4:      { fontFamily: SERIF, fontSize: 17, lineHeight: 1.2,  fontWeight: 700 },
  h5:      { fontFamily: SERIF, fontSize: 15, lineHeight: 1.25, fontWeight: 600 },
  body:    { fontFamily: SERIF, fontSize: 15, lineHeight: 1.55, fontWeight: 400 },
  sm:      { fontFamily: SERIF, fontSize: 13, lineHeight: 1.45, fontWeight: 400 },
  eyebrow: { fontFamily: MONO,  fontSize: 11, letterSpacing: '.18em', fontWeight: 500, textTransform: 'uppercase' },
  meta:    { fontFamily: MONO,  fontSize: 10, letterSpacing: '.14em', fontWeight: 500, textTransform: 'uppercase' },
  cMd:     { fontFamily: MONO,  fontSize: 13, lineHeight: 1.6 },
  cSm:     { fontFamily: MONO,  fontSize: 12, lineHeight: 1.5 },
  cXs:     { fontFamily: MONO,  fontSize: 11, lineHeight: 1.4 },
};

/* ── PHONE SHELL ─────────────────────────────────────────── */
function PhoneFrame({ children }) {
  return (
    <div style={{
      width: 390, background: T.paper,
      borderRadius: 48,
      border: '1px solid rgba(255,255,255,.08)',
      boxShadow: '0 0 0 2px rgba(0,0,0,.85), 0 52px 120px rgba(0,0,0,.7)',
      overflow: 'hidden', position: 'relative', isolation: 'isolate',
    }}>
      <StatusBar />
      <div>{children}</div>
      <HomeIndicator />
    </div>
  );
}

function StatusBar() {
  return (
    <div style={{
      height: 50, background: T.paper,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '0 26px 10px', position: 'relative', zIndex: 10,
    }}>
      {/* Dynamic island */}
      <div style={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, background: '#000', borderRadius: 20 }} />
      <span style={{ ...TS.cSm, color: T.ink, fontWeight: 600 }}>9:41</span>
      {/* Icons */}
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <svg width="17" height="12" viewBox="0 0 17 12"><rect x="0" y="7" width="3" height="5" rx="1" fill={T.ink}/><rect x="4.5" y="4" width="3" height="8" rx="1" fill={T.ink}/><rect x="9" y="1.5" width="3" height="10.5" rx="1" fill={T.ink}/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={T.ink}/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" fill={T.ink}/><path d="M3 6c1.3-1.3 3-2 5-2s3.7.7 5 2" stroke={T.ink} strokeWidth="1.5" strokeLinecap="round"/><path d="M0 3c2.5-2.3 5.1-3 8-3s5.5.7 8 3" stroke={T.ink} strokeWidth="1.5" strokeLinecap="round"/></svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none"><rect x="0" y="1" width="21" height="10" rx="3" stroke={T.ink} strokeWidth="1.2"/><rect x="22" y="4" width="2" height="4" rx="1" fill={T.ink} opacity=".45"/><rect x="1.5" y="2.5" width="15" height="7" rx="2" fill={T.ink}/></svg>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div style={{ height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: T.paper }}>
      <div style={{ width: 130, height: 5, borderRadius: 999, background: 'rgba(255,255,255,.25)' }} />
    </div>
  );
}

/* ── NAV ─────────────────────────────────────────────────── */
function NavBar({ stuck = false }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '11px 22px',
      background: stuck ? 'rgba(14,17,22,.88)' : T.paper,
      backdropFilter: stuck ? 'blur(24px) saturate(140%)' : undefined,
      borderBottom: `1px solid ${stuck ? T.hair2 : T.hair}`,
    }}>
      <span style={{ ...TS.cMd, color: T.ink, fontWeight: 600 }}>igneel.dev</span>
      <div style={{ ...TS.cXs, color: T.ink, border: `1.4px solid ${T.hair2}`, padding: '2px 7px', borderRadius: 5, lineHeight: 1.4 }}>☰</div>
    </div>
  );
}

function NavOverlay() {
  const links = [['work', true], ['writing', false], ['experiments', false], ['/terminal', false], ['about', false]];
  return (
    <div style={{ background: T.paper, minHeight: 620, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '40px 20px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 18, right: 22, ...TS.cMd, color: T.inkDim, cursor: 'pointer' }}>×</div>
      <div style={{ ...TS.eyebrow, color: T.inkDim, marginBottom: 16 }}>$ navigate</div>
      {links.map(([l, active]) => (
        <div key={l} style={{ ...TS.h2, color: active ? T.accent : T.ink, padding: '5px 0' }}>{l}</div>
      ))}
      <div style={{ marginTop: 22, ...TS.cXs, color: T.inkDim }}>hi@igneel.dev</div>
    </div>
  );
}

/* ── HOME PAGE BLOCKS ────────────────────────────────────── */
function BootBlock() {
  return (
    <div style={{ padding: '10px 22px 9px', background: T.paper, borderBottom: `1px solid ${T.hair}`, fontFamily: MONO, fontSize: 11, lineHeight: 1.75 }}>
      <div><span style={{ color: T.accent }}>$</span><span style={{ color: T.ink }}> ./hello.sh</span></div>
      {['[boot] mounting portfolio…','[boot] loading vaibhav.profile…','[ ok ] ready in 0.42s'].map((l,i) => (
        <div key={i} style={{ paddingLeft: 10, color: T.inkDim }}>{l}</div>
      ))}
    </div>
  );
}

function HeroSection() {
  return (
    <div style={{ padding: '18px 22px 22px', background: T.paper }}>
      <h1 style={{ ...TS.display, color: T.ink, margin: '0 0 10px' }}>
        I'm{' '}
        <span style={{ background: `linear-gradient(transparent 62%, ${T.hl} 62%)`, padding: '0 .05em' }}>Vaibhav.</span>
        <br/>I build software<br/>
        that{' '}<em style={{ fontStyle: 'italic', color: T.accent }}>teaches itself</em>
        <br/>to write more<br/>software.
      </h1>
      <p style={{ ...TS.cXs, color: T.inkDim, lineHeight: 1.65, margin: '0 0 16px' }}>
        B.Tech CSE · GBU · Noida<br/>open to full-time + freelance.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <Btn variant="solid">↓ scroll the story</Btn>
        <Btn>$ download résumé.pdf</Btn>
        <Btn>hi@igneel.dev</Btn>
      </div>
    </div>
  );
}

function Btn({ children, variant = 'outline' }) {
  const solid = variant === 'solid';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '9px 14px', borderRadius: 7,
      border: `1.5px solid ${solid ? T.ink : T.hair2}`,
      background: solid ? T.ink : 'transparent',
      color: solid ? T.paper : T.inkSoft,
      ...TS.cXs, textTransform: 'uppercase', letterSpacing: '.07em',
      boxShadow: solid ? '2px 2px 0 rgba(230,237,243,.1)' : undefined,
    }}>{children}</div>
  );
}

function AccentRule() {
  return <div style={{ height: 1, background: `linear-gradient(90deg, color-mix(in oklab, ${T.accent} 28%, transparent), transparent)`, margin: '0 22px' }} />;
}

function SectionHeader({ eyebrow, title }) {
  return (
    <div style={{ padding: '18px 22px 5px', background: T.paper }}>
      <div style={{ ...TS.eyebrow, color: `color-mix(in oklab, ${T.accent} 55%, transparent)`, marginBottom: 4 }}>{eyebrow}</div>
      <h2 style={{ ...TS.h1, color: T.ink, margin: 0 }}>{title}</h2>
    </div>
  );
}

function ImgPlaceholder({ label = 'screenshot', aspectRatio = '16/9', height }) {
  return (
    <div style={{
      width: '100%',
      ...(height ? { height } : { aspectRatio }),
      background: T.paper3,
      backgroundImage: 'repeating-linear-gradient(135deg,transparent 0 10px,rgba(110,231,167,.035) 10px 11px)',
      position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    }}>
      <div style={{ position:'absolute',inset:0,backgroundImage:`linear-gradient(45deg,transparent 49%,rgba(110,231,167,.04) 49% 51%,transparent 51%)` }}/>
      <div style={{ position:'absolute',inset:0,backgroundImage:`linear-gradient(-45deg,transparent 49%,rgba(110,231,167,.04) 49% 51%,transparent 51%)` }}/>
      <span style={{ ...TS.cXs, fontSize: 9, color: 'rgba(230,237,243,.18)', textTransform: 'uppercase', letterSpacing: '.08em', zIndex: 1 }}>{label}</span>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <div style={{ margin: '10px 22px', border: `1px solid color-mix(in oklab, ${T.accent} 20%, transparent)`, borderRadius: 10, overflow: 'hidden', background: T.paper2 }}>
      <ImgPlaceholder label={`${project.id} · screenshot`} />
      <div style={{ padding: '10px 14px 13px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
          <span style={{ ...TS.cXs, fontSize: 9, color: T.inkDim }}>{project.index}</span>
          <span style={{ ...TS.h4, color: T.ink }}>{project.name}</span>
          <span style={{ ...TS.meta, fontSize: 9, color: T.accent, marginLeft: 'auto' }}>{project.kind}</span>
        </div>
        <p style={{ ...TS.sm, color: T.inkSoft, margin: '0 0 9px', fontSize: 13 }}>{project.blurb}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 9 }}>
          {project.stack.map(s => (
            <span key={s} style={{ ...TS.cXs, fontSize: 9, padding: '2px 7px', border: `1px solid color-mix(in oklab, ${T.accent} 16%, transparent)`, borderRadius: 999, color: T.inkDim }}>{s}</span>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ ...TS.cXs, fontSize: 10, color: T.accent2, letterSpacing: '.04em' }}>cat CASE_STUDY.md →</span>
          <span style={{ ...TS.cXs, fontSize: 9, color: T.inkDim }}>{project.meta}</span>
        </div>
      </div>
    </div>
  );
}

function TimelineSection({ stops }) {
  return (
    <>
      <SectionHeader eyebrow="$ git log --all" title="the long way around." />
      <div style={{ padding: '8px 22px 12px', background: T.paper }}>
        {stops.map((s, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '38px 14px 1fr', alignItems: 'start', minHeight: 38, position: 'relative' }}>
            {i < stops.length - 1 && (
              <div style={{ position: 'absolute', left: 47, top: 12, bottom: -1, borderLeft: `1.5px dashed color-mix(in oklab, ${T.accent} 22%, transparent)` }} />
            )}
            <div style={{ ...TS.cXs, fontSize: 9, color: s.isNow ? T.accent : T.inkDim, textAlign: 'right', paddingRight: 7, marginTop: 2, fontWeight: s.isNow ? 600 : 400 }}>{s.when}</div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: 9, height: 9, borderRadius: '50%', marginTop: 2, flexShrink: 0,
                border: `1.5px solid ${s.isNow ? T.accent : `color-mix(in oklab, ${T.accent} 38%, transparent)`}`,
                background: s.isNow ? T.accent : T.paper,
                boxShadow: s.isNow ? `0 0 0 3px color-mix(in oklab, ${T.accent} 18%, transparent), 0 0 10px color-mix(in oklab, ${T.accent} 35%, transparent)` : undefined,
              }} />
            </div>
            <div style={{ paddingLeft: 8 }}>
              <div style={{ ...TS.sm, fontFamily: SERIF, fontWeight: 700, lineHeight: 1.25, color: s.isNow ? T.ink : `color-mix(in oklab, ${T.ink} 80%, transparent)` }}>{s.title}</div>
              <div style={{ fontFamily: MONO, fontSize: 9, color: T.inkDim, lineHeight: 1.4, marginTop: 1 }}>{s.blurb}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function CTASection() {
  return (
    <div style={{ margin: '12px 22px', border: `1px solid color-mix(in oklab, ${T.accent} 22%, transparent)`, borderRadius: 10, padding: 14, background: T.paper2 }}>
      <div style={{ ...TS.eyebrow, fontSize: 9, color: T.accent, marginBottom: 4 }}>END OF STORY · YOUR MOVE</div>
      <div style={{ ...TS.h3, color: T.ink, margin: '0 0 3px' }}>Hiring? Building? Curious?</div>
      <div style={{ ...TS.sm, color: T.inkSoft, fontSize: 13, margin: '0 0 12px' }}>Drop a line — I respond fast.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {[['hi@igneel.dev', T.accent, `color-mix(in oklab, ${T.accent} 45%, transparent)`], ['github · linkedin · x', T.inkDim, T.hair]].map(([text, color, border]) => (
          <div key={text} style={{ border: `1px solid ${border}`, padding: '9px 14px', borderRadius: 6, ...TS.cXs, color, textAlign: 'center' }}>{text}</div>
        ))}
      </div>
    </div>
  );
}

function SiteFooter() {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 22px 4px', borderTop: `1px solid ${T.hair}`, fontFamily: MONO, fontSize: 9, color: T.inkDim }}>
      <span>$ exit 0 · built with too much GSAP &amp; coffee</span>
      <span>© 2026</span>
    </div>
  );
}

/* ── WORK PAGE ───────────────────────────────────────────── */
function FilterChips({ chips, active }) {
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '8px 22px 10px' }}>
      {chips.map(c => (
        <div key={c} style={{ fontFamily: MONO, fontSize: 9, padding: '4px 10px', border: `1.4px solid ${c === active ? T.ink : T.hair2}`, borderRadius: 999, background: c === active ? T.ink : 'transparent', color: c === active ? T.paper : T.inkDim }}>{c}</div>
      ))}
    </div>
  );
}

function WorkPageRow({ row }) {
  const linked = !!row.slug;
  const sc = { active: T.accent, wip: T.accent2, archived: T.inkDim, dead: T.inkDim }[row.status] || T.inkDim;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gridTemplateAreas: '"name chev" "blurb blurb" "tag status"', rowGap: 3, columnGap: 8, padding: '13px 22px', borderBottom: `1px solid ${T.hair}`, alignItems: 'center' }}>
      <span style={{ gridArea: 'name', ...TS.cSm, fontWeight: 600, color: T.ink }}>{row.name}</span>
      <span style={{ gridArea: 'chev', ...TS.cMd, color: linked ? T.accent2 : 'transparent' }}>›</span>
      <p style={{ gridArea: 'blurb', fontFamily: SERIF, fontSize: 13, lineHeight: 1.45, color: T.inkSoft, margin: '2px 0 4px' }}>{row.blurb}</p>
      <span style={{ gridArea: 'tag', fontFamily: MONO, fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: T.inkDim }}>{row.tag}</span>
      <span style={{ gridArea: 'status', fontFamily: MONO, fontSize: 9, color: sc, border: `1px solid color-mix(in oklab, ${sc} 30%, transparent)`, padding: '1px 5px', borderRadius: 3, justifySelf: 'end' }}>[{row.status}]</span>
    </div>
  );
}

/* ── WRITING PAGE ────────────────────────────────────────── */
function WritingRow({ post }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '11px 22px', borderBottom: `1px solid ${T.hair}` }}>
      <span style={{ fontFamily: MONO, fontSize: 9, color: T.inkDim, minWidth: 44, marginTop: 2 }}>{post.date}</span>
      <div>
        <div style={{ ...TS.h5, color: T.ink, lineHeight: 1.3 }}>{post.title}</div>
        <div style={{ fontFamily: MONO, fontSize: 9, color: T.inkDim, marginTop: 2 }}>{post.kind} · {post.readTime}</div>
      </div>
    </div>
  );
}

/* ── CASE STUDY ──────────────────────────────────────────── */
function ReadingProgress({ pct = 35 }) {
  return (
    <div style={{ height: 2, background: T.hair }}>
      <div style={{ height: '100%', width: `${pct}%`, background: T.accent, borderRadius: 999 }} />
    </div>
  );
}

function CSBreadcrumb({ slug }) {
  return <div style={{ padding: '7px 22px', fontFamily: MONO, fontSize: 9, color: T.inkDim, borderBottom: `1px dashed ${T.hair}` }}>$ cat ~/projects/{slug}/CASE_STUDY.md</div>;
}

function CSHero({ project }) {
  return (
    <div style={{ padding: '14px 22px 11px' }}>
      <div style={{ ...TS.eyebrow, fontSize: 9, color: T.accent, marginBottom: 3 }}>{project.index} · {project.kind}</div>
      <h1 style={{ ...TS.display, color: T.ink, margin: '0 0 6px' }}>{project.name}<span style={{ color: T.accent }}>.</span></h1>
      <div style={{ fontFamily: MONO, fontSize: 9, color: T.inkDim, lineHeight: 1.75 }}>
        {project.stack.slice(0,5).join(' · ')}<br/>{project.meta}
      </div>
    </div>
  );
}

function CSTextSection({ title, lines = 3 }) {
  return (
    <>
      <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: T.accent, padding: '11px 22px 3px' }}>{title}</div>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} style={{ height: i === lines-1 ? 5 : 6, background: `repeating-linear-gradient(90deg,color-mix(in oklab,${T.ink} 50%,transparent) 0 12px,transparent 12px 16px)`, borderRadius: 3, margin: '4px 22px', width: i === lines-1 ? '55%' : '100%' }} />
      ))}
    </>
  );
}

function StackPills({ stack }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '0 22px 14px' }}>
      {stack.map(s => (
        <span key={s} style={{ fontFamily: MONO, fontSize: 9, padding: '2px 7px', border: `1px solid ${T.hair2}`, borderRadius: 999, color: T.inkDim }}>{s}</span>
      ))}
    </div>
  );
}

function CSPager({ prev, next }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 22px', borderTop: `1.4px dashed ${T.hair}`, fontFamily: MONO, fontSize: 10, color: T.accent2 }}>
      <span>← {prev}</span>
      <span>{next} →</span>
    </div>
  );
}

/* ── EXPORT ALL ──────────────────────────────────────────── */
Object.assign(window, {
  T, TS, SERIF, MONO,
  PhoneFrame, StatusBar, HomeIndicator, NavBar, NavOverlay,
  BootBlock, HeroSection, Btn, AccentRule, SectionHeader, ImgPlaceholder,
  ProjectCard, TimelineSection, CTASection, SiteFooter,
  FilterChips, WorkPageRow,
  WritingRow,
  ReadingProgress, CSBreadcrumb, CSHero, CSTextSection, StackPills, CSPager,
});
