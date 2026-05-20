/* components.jsx — scenes for igneel.dev */

// ─── tiny hook: reveal on intersection ─────────────────────
function useReveal(opts){
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current) return;
    // if element is already in viewport on mount, just reveal immediately
    const r = ref.current.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0){
      const t = setTimeout(() => setSeen(true), 60);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting){
          setSeen(true);
          io.disconnect();
        }
      });
    }, { threshold: 0, rootMargin: "0px 0px -8% 0px", ...(opts||{}) });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, seen];
}

// ─── boot lines (Scene 01) ─────────────────────────────────
function BootLines(){
  const lines = [
    { p: "$", t: "./hello.sh" },
    { p: "",  t: "[boot] mounting portfolio…",     dim:true, indent:true },
    { p: "",  t: "[boot] loading vaibhav.profile…", dim:true, indent:true },
    { p: "",  t: "[ ok ] ready in 0.42s",           dim:true, indent:true },
  ];
  return (
    <div className="boot">
      {lines.map((l,i)=>(
        <div
          key={i}
          className={"reveal delay-"+i}
          style={{paddingLeft: l.indent?14:0, color: l.dim?"var(--ink-soft)":"inherit"}}
        >
          {l.p && <span style={{color:"var(--accent)"}}>{l.p} </span>}
          {l.t}
        </div>
      ))}
    </div>
  );
}

// ─── headline (Scene 01) — word-by-word reveal ─────────────
function HeroHeadline(){
  const [pre, setPre] = React.useState(true);
  React.useEffect(() => {
    const t = requestAnimationFrame(() => requestAnimationFrame(() => setPre(false)));
    return () => cancelAnimationFrame(t);
  }, []);
  const w = (idx, children) => (
    <span className={"word d-"+idx + (pre?" pre":"")}><span>{children}</span></span>
  );
  return (
    <h1 className="t-display headline">
      {w(0, <>I’m </>)}{w(1, <span className="hilite">Vaibhav.</span>)}<br/>
      {w(2, <>I build software </>)}<br/>
      {w(3, <>that </>)}{w(4, <em style={{fontStyle:"italic", color:"var(--accent)"}}>teaches&nbsp;itself</em>)}<br/>
      {w(5, <>to write more software.</>)}
    </h1>
  );
}

// ─── hybrid nav ─────────────────────────────────────────────
function Nav({ activeId }){
  const [stuck, setStuck] = React.useState(false);
  React.useEffect(() => {
    const tabbar = document.querySelector("[data-tabbar]");
    if (!tabbar) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e.isIntersecting), { threshold: 0 });
    io.observe(tabbar);
    return () => io.disconnect();
  }, []);
  const links = [
    ["work",       "scroll", "#work"],
    ["about",      "scroll", "#about"],
    ["writing",    "route",  "/writing"],
    ["experiments","route",  "/experiments"],
    ["/now",       "route",  "/now"],
    ["/uses",      "route",  "/uses"],
  ];
  const onClick = (e, kind, href) => {
    if (kind === "scroll"){
      e.preventDefault();
      const el = document.querySelector(href);
      if (el){
        const top = el.getBoundingClientRect().top + window.scrollY - 60;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };
  return (
    <nav className="nav" data-stuck={stuck}>
      <a className="brand" href="#hero" onClick={e => onClick(e, "scroll", "#hero")}>
        igneel<span className="dot">.</span>dev
      </a>
      <div className="links">
        {links.map(([l, k, h]) => (
          <a
            key={l}
            className="nav-link"
            href={h}
            data-active={activeId === h.replace("#","") ? "true" : undefined}
            onClick={e => onClick(e, k, h)}
          >{l}</a>
        ))}
      </div>
      <a className="mail" href="mailto:hi@igneel.dev">
        hi<span className="at">@</span>igneel.dev
      </a>
    </nav>
  );
}

// ─── Scene 01: Hero ─────────────────────────────────────────
function Hero(){
  return (
    <section id="hero" className="hero">
      <div className="container">
        <BootLines />
        <HeroHeadline />
        <p className="sub reveal delay-4">
          B.Tech CSE · Gautam Buddha University · Noida · open to full-time + freelance ·
          I ship AI-powered web apps and the tooling around them.
        </p>
        <div className="ctas">
          <a className="btn solid" href="#work" onClick={(e)=>{e.preventDefault();document.getElementById("work")?.scrollIntoView({behavior:"smooth", block:"start"});}}>
            <span>$ cat work →</span>
          </a>
          <a className="btn" href="#" onClick={e=>e.preventDefault()}>
            <span>$ download résumé.pdf</span>
          </a>
          <a className="btn" href="mailto:hi@igneel.dev">
            <span>$ contact</span>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── visual placeholders for project hero images ───────────
function CodeFlowVisual(){
  return (
    <div className="ide">
      <div className="chat">
        <div className="bubble you">build me a pricing page with three tiers</div>
        <div className="bubble ai">spinning up sandbox · vaibhav-sb-04…</div>
        <div className="bubble ai">app/page.tsx written · 4 components, 84 lines</div>
        <div className="bubble ai">preview ready ↗</div>
        <div className="bubble you" style={{opacity:.55}}>add a faq below the tiers</div>
      </div>
      <div className="preview">
        <div className="browser">
          <div className="urlbar">
            <span className="d"></span><span className="d"></span><span className="d"></span>
            <span style={{marginLeft:6}}>preview.codeflow.dev/4f9</span>
          </div>
          <div className="canvas">
            <h5>Plans that scale with you.</h5>
            <div className="ln s"></div>
            <div className="ln t"></div>
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginTop:10}}>
              {[0,1,2].map(i=>(
                <div key={i} style={{border:"1px solid var(--hair)", borderRadius:4, padding:6, height:60, background:"rgba(255,255,255,.02)"}}>
                  <div className="ln s" style={{marginBottom:6}}></div>
                  <div className="ln t"></div>
                  <div className="ln t" style={{marginTop:6, width:"50%"}}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskForgeVisual(){
  const cols = [
    { h: "to do", items: [{ d:"y", t:"empty room background asset"}, { d:"y", t:"login error copy"}] },
    { h: "in progress", items: [{ d:"b", t:"presence cursor smoothing", you:true }, { d:"b", t:"AI: elaborate task"}] },
    { h: "done", items: [{ d:"g", t:"liveblocks sync"}, { d:"g", t:"drag handle hitbox", you:true }, { d:"g", t:"board grid"}] },
  ];
  return (
    <div className="kanban">
      {cols.map((c, i) => (
        <div key={i} className="col">
          <div className="h">{c.h}</div>
          {c.items.map((it, j) => (
            <div key={j} className="t">
              <span className={"dot " + (it.d==="g"?"g":it.d==="y"?"y":"")}></span>
              {it.t}
              {it.you && <span className="av"></span>}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function TraveloopVisual(){
  return (
    <div className="travel">
      <div className="day">
        <h5>Day 02 · Munnar</h5>
        <div className="stop"><span className="pin"></span>tea estate trail</div>
        <div className="stop"><span className="pin" style={{background:"var(--accent-2)"}}></span>kundala lake</div>
        <div className="stop"><span className="pin" style={{background:"var(--accent)"}}></span>echo point — lunch</div>
        <div className="stop"><span className="pin" style={{background:"var(--bad)"}}></span>nyaymangalam viewpoint</div>
      </div>
      <div className="map">
        <div className="route"></div>
        <div className="marker" style={{top:"22%", left:"30%"}}></div>
        <div className="marker" style={{top:"40%", left:"48%", background:"var(--accent-2)"}}></div>
        <div className="marker" style={{top:"58%", left:"56%", background:"var(--accent)"}}></div>
        <div className="marker" style={{top:"76%", left:"68%", background:"var(--bad)"}}></div>
      </div>
    </div>
  );
}

// ─── Scene 02 — experimental scroll-stack of projects ──────
function Work(){
  const projects = [
    {
      id:"codeflow",
      idx:"01",
      tag:"FLAGSHIP",
      name:"CodeFlow",
      blurb:"AI-powered website builder. Chat with agents in real-time E2B sandboxes and get a working Next.js app out the other side.",
      stack:["next.js","trpc","prisma","inngest","e2b","openai"],
      note:"61 commits · solo · code-flow-hazel.vercel.app",
      Visual: CodeFlowVisual,
      phClass:"ph-codeflow",
    },
    {
      id:"taskforge",
      idx:"02",
      tag:"COLLABORATION",
      name:"TaskForge",
      blurb:"Real-time Kanban with AI task elaboration. Presence-aware boards that feel like Figma for tickets, with Liveblocks and Mongo on the back.",
      stack:["next.js","liveblocks","mongo","tailwind"],
      note:"team product · multi-user demo",
      Visual: TaskForgeVisual,
      phClass:"ph-taskforge",
    },
    {
      id:"traveloop",
      idx:"03",
      tag:"HACKATHON",
      name:"Traveloop",
      blurb:"Trip planner built at Odoo Hackathon with The Knights. Collaborative itineraries, shared maps, shipped in a single weekend.",
      stack:["react","node","postgres","tailwind"],
      note:"hackathon · group of 4",
      Visual: TraveloopVisual,
      phClass:"ph-traveloop",
    },
  ];

  const [active, setActive] = React.useState(0);
  const slotRefs = React.useRef([]);

  React.useEffect(() => {
    const onScroll = () => {
      const viewportCenter = window.scrollY + window.innerHeight * 0.42;
      let nearest = 0;
      let nearestDist = Infinity;
      slotRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const center = rect.top + window.scrollY + rect.height/2;
        const d = Math.abs(center - viewportCenter);
        if (d < nearestDist){ nearestDist = d; nearest = i; }
      });
      setActive(nearest);
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="work" className="work-wrap">
      <div className="work-head">
        <div>
          <div className="scene-eyebrow">SCENE 02 — Selected Work</div>
          <h2 className="t-h2">Three things I shipped.</h2>
        </div>
        <span className="l-eyebrow mute">PINNED CANVAS · SCROLL TO SWAP</span>
      </div>

      <div className="work-stage">
        {/* LEFT — vertical project stack with sticky pinning */}
        <div className="stack">
          {projects.map((p, i) => {
            const Visual = p.Visual;
            return (
              <div
                key={p.id}
                ref={el => slotRefs.current[i] = el}
                className="stack-slot"
                data-i={i}
              >
                <article className="project">
                  <div className="mac-bar">
                    <span className="mac-dot r"></span>
                    <span className="mac-dot y"></span>
                    <span className="mac-dot g"></span>
                    <span className="mac-title">{p.id}.vercel.app</span>
                  </div>
                  <div className={"project-img " + p.phClass}>
                    <Visual />
                  </div>
                  <div className="body">
                    <div className="now">
                      NOW SHOWING <span className="sep">·</span> {p.idx} <span className="sep">/</span> {String(projects.length).padStart(2,"0")} <span className="sep">·</span> {p.tag}
                    </div>
                    <h3>{p.name}</h3>
                    <p className="blurb">{p.blurb}</p>
                    <div className="stack-pills">
                      {p.stack.map(t => <span key={t} className="pill">{t}</span>)}
                    </div>
                    <a className="case" href={"#"+p.id} onClick={e=>e.preventDefault()}>
                      Read the case study <span className="arr">→</span>
                    </a>
                    <div className="t-xs dim" style={{marginTop:14, letterSpacing:".08em"}}>{p.note}</div>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        {/* RIGHT — up next rail */}
        <aside className="rail">
          <div className="rail-label">Up next — keeps scrolling</div>
          {projects.map((p, i) => {
            const Visual = p.Visual;
            const state = i < active ? "past" : i === active ? "current" : "future";
            return (
              <div
                key={p.id}
                className={"rail-card rail-" + state}
                onClick={() => {
                  const el = slotRefs.current[i];
                  if (el){
                    const top = el.getBoundingClientRect().top + window.scrollY - 80;
                    window.scrollTo({ top, behavior:"smooth" });
                  }
                }}
              >
                <div className={"thumb img-ph " + p.phClass}>
                  <div style={{position:"absolute", inset:0, transform:"scale(.45)", transformOrigin:"top left", width:"222%", height:"222%", pointerEvents:"none"}}>
                    <Visual />
                  </div>
                </div>
                <div>
                  <div className="meta">{p.idx} · {p.tag}</div>
                  <h4>{p.name}</h4>
                  <p>{p.blurb.split(".")[0]}.</p>
                </div>
              </div>
            );
          })}
          <div className="rail-more">
            <span className="arr">+</span> experiments · /writing · more soon
          </div>
        </aside>
      </div>

      <div className="work-progress">
        <span className="nums">{String(active+1).padStart(2,"0")} / {String(projects.length).padStart(2,"0")}</span>
        <div className="ticks">
          {projects.map((_, i) => (
            <div key={i} className="tick">
              <span style={{ width: i <= active ? "100%" : "0%" }}></span>
            </div>
          ))}
        </div>
        <span className="nums">{projects[active].name.toLowerCase()}</span>
      </div>

      <div className="see-all">
        <div className="inner">
          <span className="note">// want the full list? wall-engine, arch-install, dotfiles, more —</span>
          <a className="btn" href="#" onClick={e=>e.preventDefault()}>see all projects → /work</a>
        </div>
      </div>
    </section>
  );
}

// ─── Scene 03 — about + ~/about.ts code block ──────────────
function AboutCode(){
  return (
    <div className="codeblock">
      <div className="file">~/about.ts</div>
      <div><span className="kw">const</span> <span className="key">vaibhav</span> <span className="punct">=</span> <span className="punct">{"{"}</span></div>
      <div className="indent"><span className="key">name</span><span className="punct">:</span> <span className="str">"Vaibhav Verma"</span><span className="punct">,</span></div>
      <div className="indent"><span className="key">role</span><span className="punct">:</span> <span className="str">"software engineer"</span><span className="punct">,</span></div>
      <div className="indent"><span className="key">based</span><span className="punct">:</span> <span className="str">"Noida, IN"</span><span className="punct">,</span></div>
      <div className="indent"><span className="key">open_to</span><span className="punct">:</span> <span className="punct">[</span><span className="str">"full-time"</span><span className="punct">, </span><span className="str">"freelance"</span><span className="punct">]</span><span className="punct">,</span></div>
      <div className="indent"><span className="key">currently</span><span className="punct">:</span> <span className="str">"shipping ai tooling"</span><span className="punct">,</span></div>
      <div className="indent"><span className="key">coffee</span><span className="punct">:</span> <span className="str">"more than is reasonable"</span></div>
      <div><span className="punct">{"}"};</span></div>
      <div className="cmt" style={{marginTop:8}}>// hover any value to see how it got there</div>
    </div>
  );
}

function About(){
  const stack = ["typescript","next.js","react","node","python","postgres","mongo","tailwind","prisma","inngest","aws"];
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="scene-eyebrow">SCENE 03 — About</div>
        <h2 className="t-h2">The short version.</h2>
        <div className="about-grid" style={{marginTop:24}}>
          <div>
            <p>
              CSE grad from <span className="em">Gautam Buddha University</span>, based in Noida.
              I like the part of software where you stop reading docs and start figuring out
              why production is on fire. Currently looking for a first full-time role —
              also taking freelance.
            </p>
            <div className="stack-grid">
              {stack.map(s => <span key={s} className="pill">{s}</span>)}
            </div>
            <div style={{marginTop:24}} className="l-eyebrow mute">poking at</div>
            <div className="stack-grid" style={{marginTop:8}}>
              {["rust","duckdb","hyprland","glsl"].map(s => <span key={s} className="pill" style={{opacity:.7}}>{s}</span>)}
            </div>
          </div>
          <AboutCode />
        </div>
      </div>
    </section>
  );
}

// ─── Scene 04 — also on this site ──────────────────────────
function Future(){
  const cards = [
    ["experiments", "tiny demos, shaders, half-finished ideas", "/experiments"],
    ["writing",     "notes from building in public",            "/writing"],
    ["/now",        "what I’m doing this month",                "/now"],
    ["/dev/letters","one email a month — what I built, what I broke", "/letters"],
  ];
  return (
    <section className="future">
      <div className="container">
        <div className="scene-eyebrow">SCENE 04 — Also on this site</div>
        <div className="future-grid">
          {cards.map(([h, s, r]) => (
            <div key={h} className="card">
              <span className="stamp">future</span>
              <div>
                <h4>{h}</h4>
                <p>{s}</p>
              </div>
              <div className="route">→ {r}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Scene 05 — CTA + footer ───────────────────────────────
function CTAFooter(){
  return (
    <>
      <section className="cta">
        <div className="container">
          <div className="cta-card">
            <div>
              <div className="l-eyebrow" style={{color:"var(--accent)"}}>END OF STORY · YOUR MOVE</div>
              <h2>Hiring? Building? Curious?</h2>
              <div className="sub">Drop a line — I respond fast.</div>
            </div>
            <div className="cta-buttons">
              <a className="btn solid" href="mailto:hi@igneel.dev">
                <span>hi@igneel.dev</span> <span>→</span>
              </a>
              <a className="btn" href="#" onClick={e=>e.preventDefault()}>
                <span>github · linkedin · x</span> <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="gitlog">
        <div className="l-eyebrow mute" style={{marginBottom:8}}>$ git log --oneline | head -3</div>
        <div><span className="hash">a3f01b2</span> · docs(traveloop): wrote case study draft</div>
        <div><span className="hash">7c01d8a</span> · feat(codeflow): add gemini provider</div>
        <div><span className="hash">1e7f9d4</span> · chore(arch-install): split out wm setup</div>
        <a className="full" href="#">→ full log on github.com/igneel0601</a>
      </div>

      <footer>
        <span>$ exit 0 · built with too much GSAP &amp; coffee</span>
        <div className="socials">
          <a href="#">github</a>
          <a href="#">linkedin</a>
          <a href="#">x</a>
          <a href="mailto:hi@igneel.dev">email</a>
        </div>
        <span>© Vaibhav Verma · 2026</span>
      </footer>
    </>
  );
}

Object.assign(window, { Nav, Hero, Work, About, Future, CTAFooter });
