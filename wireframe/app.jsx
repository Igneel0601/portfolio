// app.jsx — Portfolio wireframes canvas + tweaks panel (tailored for Vaibhav)

const W = 980, H = 1700;

const ARTBOARDS = [
  { id: "hybridplus", label: "★ F+ · CHOSEN — homepage (merged)",  Comp: window.WFHybridPlus },
  { id: "workindex",  label: "/work · all projects (subpage)",      Comp: window.WFWorkIndex },
];

const PAPERS_LIGHT  = { warm:["#f5f0e6","#ede6d6"], cool:["#eef1f4","#e2e7ec"], grey:["#f1f1ee","#e6e6e2"], cream:["#faf5e8","#f1ead7"] };
const PAPERS_DARK   = { warm:["#15110b","#1f1a12"], cool:["#0e1116","#161b22"], grey:["#101012","#1a1a1d"], cream:["#171410","#221d16"] };
const INKS_LIGHT    = { charcoal:"#1f1d1a", navy:"#101a2e", forest:"#13261d", plum:"#2a1830" };
const INKS_DARK     = { charcoal:"#e6edf3", navy:"#bfd0ff", forest:"#bfe5cd", plum:"#e7c8ec" };
const ACCENTS_LIGHT = { tomato:"#d24a2a", indigo:"#3a4ed6", forest:"#2d7a4a", marigold:"#c87a16", mint:"#179c7a" };
const ACCENTS_DARK  = { tomato:"#ff7a55", indigo:"#7fb3ff", forest:"#6ee7a7", marigold:"#f0b73a", mint:"#5eead4" };

function App(){
  const [t, setTweak] = window.useTweaks(/*EDITMODE-BEGIN*/{
    "theme":     "dark",
    "paper":     "cool",
    "ink":       "charcoal",
    "accent":    "forest",
    "showAnnotations": true,
    "showGrid":  true
  }/*EDITMODE-END*/);

  React.useEffect(()=>{
    const dark = t.theme === "dark";
    document.body.dataset.theme = dark ? "dark" : "light";
    const r = document.documentElement.style;
    const papers  = dark ? PAPERS_DARK  : PAPERS_LIGHT;
    const inks    = dark ? INKS_DARK    : INKS_LIGHT;
    const accents = dark ? ACCENTS_DARK : ACCENTS_LIGHT;
    const [p1,p2] = papers[t.paper] || papers.cool;
    r.setProperty("--paper",  p1);
    r.setProperty("--paper-2", p2);
    r.setProperty("--ink",    inks[t.ink] || inks.charcoal);
    r.setProperty("--accent", accents[t.accent] || accents.forest);
    r.setProperty("--ink-soft", dark ? "#8b949e" : "#5a564e");
    r.setProperty("--highlight", dark ? "rgba(110,231,167,.22)" : "#fff39a");
    document.querySelectorAll(".wf .grid-bg").forEach(el => el.style.display = t.showGrid ? "block" : "none");
    document.querySelectorAll(".wf .annot, .wf .arrow").forEach(el => el.style.display = t.showAnnotations ? "" : "none");
  }, [t.theme, t.paper, t.ink, t.accent, t.showAnnotations, t.showGrid]);

  const { DesignCanvas, DCSection, DCArtboard, TweaksPanel, TweakSection, TweakRadio, TweakToggle } = window;

  return (
    <>
      <DesignCanvas>
        <DCSection
          id="wireframes"
          title="Vaibhav · Portfolio Wireframes"
          subtitle="F+ is the homepage you’re building — it merges F’s terminal opening, C’s editorial work cards, D’s timeline, and B’s build log. /work is its subpage for the full project index."
        >
          {ARTBOARDS.map(a => {
            const heights = { hybridplus: 2640, workindex: 1280 };
            return (
              <DCArtboard key={a.id} id={a.id} label={a.label} width={W} height={heights[a.id] || H}>
                <a.Comp />
              </DCArtboard>
            );
          })}
        </DCSection>

        <DCSection
          id="notes"
          title="Notes for the build"
          subtitle="Things to lock down before you start coding."
        >
          <DCArtboard id="checklist" label="Build plan" width={680} height={820}>
            <div style={{padding:32,background:"var(--paper)",height:"100%",fontFamily:'"Kalam",sans-serif',color:"var(--ink)"}}>
              <div className="mono" style={{fontSize:11,letterSpacing:".2em",color:"var(--accent)"}}>BUILD PLAN</div>
              <h2 className="serif" style={{fontSize:34,margin:"6px 0 14px",fontWeight:800}}>Stack &amp; sequence.</h2>
              {[
                ["Framework", "Next.js (App Router) — you already know it from CodeFlow + TaskForge."],
                ["Styling", "Tailwind + a tiny tokens file. Keep CSS custom props for theming."],
                ["Animation", "GSAP + ScrollTrigger + SplitText. Lenis for smooth scroll. Heavy storytelling = lock it in early."],
                ["Hosting", "Vercel — domain already bought. Edge runtime for the page itself."],
                ["Type", "Display serif (Fraunces or Instrument Serif) + IBM Plex Mono for terminal feel."],
                ["Content", "CodeFlow · TaskForge · Traveloop · then one ‘what’s next’ slot you fill as you go."],
                ["v1 cut", "Hero · selected work (3) · about · contact. Ship in a week."],
                ["v2 add", "Experiments, /writing, /dev/letters."],
                ["Always", "prefers-reduced-motion fallback. Story must still read with JS off."],
              ].map(([k,v],i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"22px 140px 1fr",gap:10,padding:"10px 0",borderTop:"1.5px dashed var(--ink)"}}>
                  <span className="tick"></span>
                  <span className="mono" style={{fontSize:13,letterSpacing:".08em"}}>{k.toUpperCase()}</span>
                  <span style={{fontSize:16}}>{v}</span>
                </div>
              ))}
            </div>
          </DCArtboard>

          <DCArtboard id="gsap" label="GSAP storyboard" width={680} height={820}>
            <div style={{padding:32,background:"var(--paper)",height:"100%",fontFamily:'"Kalam",sans-serif',color:"var(--ink)"}}>
              <div className="mono" style={{fontSize:11,letterSpacing:".2em",color:"var(--accent)"}}>GSAP STORYBOARD · WIREFRAME F</div>
              <h2 className="serif" style={{fontSize:30,margin:"6px 0 14px",fontWeight:800}}>Beat by beat.</h2>

              {[
                ["00:00", "boot lines type on (TextPlugin) → hero headline reveals word-by-word (SplitText + stagger)"],
                ["00:04", "CTA buttons slide up; cursor blink stops on scroll"],
                ["00:08", "Scene 02 PINS. CodeFlow card stays. Right-rail upcoming cards swap as scroll advances"],
                ["00:16", "Scene 03 — about.ts types itself out, key by key. Pills float in"],
                ["00:22", "Scene 04 — three ‘future’ cards rise from below. Subtle hover wiggle"],
                ["00:26", "Footer CTA — email button magnetizes the cursor"],
              ].map(([t,v],i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"70px 1fr",gap:14,padding:"10px 0",borderTop:i?"1.5px dashed var(--ink)":"none"}}>
                  <span className="mono" style={{fontSize:14,fontWeight:600,color:"var(--accent)"}}>{t}</span>
                  <span style={{fontSize:15,lineHeight:1.4}}>{v}</span>
                </div>
              ))}

              <div className="mono" style={{fontSize:12,letterSpacing:".14em",margin:"18px 0 8px"}}>FALLBACK</div>
              <div className="box-dash" style={{padding:12,fontSize:14,background:"var(--paper-2)"}}>
                With <span className="mono">prefers-reduced-motion: reduce</span> → kill pins &amp; type-on, keep simple fades. The story still reads top-to-bottom.
              </div>
            </div>
          </DCArtboard>

          <DCArtboard id="typescale" label="Type scale (single source of truth)" width={880} height={1500}>
            <div style={{padding:32,background:"var(--paper)",height:"100%",color:"var(--ink)",boxSizing:"border-box",overflow:"auto"}}>
              <div className="l-eyebrow" style={{color:"var(--accent)"}}>TYPE SYSTEM · v1</div>
              <h2 className="t-h2" style={{margin:"6px 0 4px"}}>One scale, no exceptions.</h2>
              <p className="t-sm mute" style={{margin:"0 0 18px",maxWidth:560}}>
                Every text element in the design must pick a class from this sheet. If a moment needs a size that isn’t here, the system is wrong — fix the scale, not the instance.
              </p>

              {/* DISPLAY + HEADINGS */}
              <div className="l-eyebrow mute" style={{marginTop:6}}>DISPLAY &amp; HEADINGS — Fraunces</div>
              <div style={{borderTop:"1.5px solid var(--ink)",marginTop:6}}></div>
              {[
                ["t-display","72 / .95 / 800 / -.02em","Hero only"],
                ["t-h1",     "56 / 1.00 / 800 / -.015em","Page titles (e.g. /work)"],
                ["t-h2",     "36 / 1.05 / 700 / -.01em","Scene headers"],
                ["t-h3",     "28 / 1.15 / 700","Featured card title"],
                ["t-h4",     "20 / 1.20 / 700","Future-card title, sidebar h"],
                ["t-h5",     "17 / 1.25 / 600","Rail card, timeline entry"],
              ].map(([cls,spec,use])=>(
                <div key={cls} style={{display:"grid",gridTemplateColumns:"1fr 160px 200px",gap:14,alignItems:"baseline",padding:"10px 0",borderBottom:"1px dashed var(--ink)"}}>
                  <span className={cls}>The long way around.</span>
                  <span className="c-xs mute">{cls} · {spec}</span>
                  <span className="t-sm mute">{use}</span>
                </div>
              ))}

              {/* BODY */}
              <div className="l-eyebrow mute" style={{marginTop:22}}>BODY — Kalam</div>
              <div style={{borderTop:"1.5px solid var(--ink)",marginTop:6}}></div>
              {[
                ["t-lead","18 / 1.45 / 400","Hero subhead, page lead"],
                ["t-body","15 / 1.50 / 400","Default paragraph"],
                ["t-sm",  "13 / 1.40 / 400","Card description, caption"],
                ["t-xs",  "12 / 1.40 / 400","Tiny hint text"],
              ].map(([cls,spec,use])=>(
                <div key={cls} style={{display:"grid",gridTemplateColumns:"1fr 160px 200px",gap:14,alignItems:"baseline",padding:"8px 0",borderBottom:"1px dashed var(--ink)"}}>
                  <span className={cls}>Real-time Kanban + AI task elaboration.</span>
                  <span className="c-xs mute">{cls} · {spec}</span>
                  <span className="t-sm mute">{use}</span>
                </div>
              ))}

              {/* MONO LABELS */}
              <div className="l-eyebrow mute" style={{marginTop:22}}>MONO LABELS — IBM Plex Mono · UPPERCASE</div>
              <div style={{borderTop:"1.5px solid var(--ink)",marginTop:6}}></div>
              {[
                ["l-eyebrow","11 / .18em / 500","Scene eyebrow, filter label"],
                ["l-meta",   "10 / .14em / 500","Sub-meta (02 · COLLABORATION)"],
                ["l-tag",    "11 / .10em / 500","Lowercase mono labels"],
              ].map(([cls,spec,use])=>(
                <div key={cls} style={{display:"grid",gridTemplateColumns:"1fr 160px 200px",gap:14,alignItems:"baseline",padding:"8px 0",borderBottom:"1px dashed var(--ink)"}}>
                  <span className={cls}>SCENE 02 — SELECTED WORK</span>
                  <span className="c-xs mute">{cls} · {spec}</span>
                  <span className="t-sm mute">{use}</span>
                </div>
              ))}

              {/* MONO CODE */}
              <div className="l-eyebrow mute" style={{marginTop:22}}>MONO CODE — preserves case</div>
              <div style={{borderTop:"1.5px solid var(--ink)",marginTop:6}}></div>
              {[
                ["c-md","13 / 1.60","Terminal lines, nav"],
                ["c-sm","12 / 1.50","Footer, hint copy"],
                ["c-xs","11 / 1.40","Tiny meta inside cards"],
              ].map(([cls,spec,use])=>(
                <div key={cls} style={{display:"grid",gridTemplateColumns:"1fr 160px 200px",gap:14,alignItems:"baseline",padding:"8px 0",borderBottom:"1px dashed var(--ink)"}}>
                  <span className={cls}>$ ./hello.sh — ready in 0.42s</span>
                  <span className="c-xs mute">{cls} · {spec}</span>
                  <span className="t-sm mute">{use}</span>
                </div>
              ))}

              <div className="box-dash" style={{padding:12,marginTop:18}}>
                <div className="l-eyebrow mute">RULES</div>
                <ul className="t-sm" style={{margin:"6px 0 0",paddingLeft:18,lineHeight:1.5}}>
                  <li>Pick a class. Never set <span className="c-xs">fontSize</span> inline.</li>
                  <li>Eyebrows are <span className="c-xs">l-eyebrow</span>. Always. .18em tracking, 11px.</li>
                  <li>Card descriptions are <span className="c-xs">t-sm mute</span> — never 14px ad hoc.</li>
                  <li>Color via <span className="c-xs">color:</span> only — don’t restyle size on accent text.</li>
                </ul>
              </div>
            </div>
          </DCArtboard>

          <DCArtboard id="systemnotes" label="Visual system" width={680} height={820}>
            <div style={{padding:32,background:"var(--paper)",height:"100%",fontFamily:'"Kalam",sans-serif',color:"var(--ink)"}}>
              <div className="mono" style={{fontSize:11,letterSpacing:".2em",color:"var(--accent)"}}>WORKING SYSTEM</div>
              <h2 className="serif" style={{fontSize:34,margin:"6px 0 16px",fontWeight:800}}>The kit.</h2>

              <div className="mono" style={{fontSize:12,letterSpacing:".14em",marginBottom:6}}>TYPE</div>
              <div className="serif" style={{fontSize:32,fontWeight:800}}>Fraunces — display</div>
              <div className="mono" style={{fontSize:16,marginTop:4}}>IBM Plex Mono — labels &amp; code</div>
              <div className="hand" style={{fontSize:24,marginTop:4}}>Caveat — margin notes (drop for v1)</div>

              <div className="mono" style={{fontSize:12,letterSpacing:".14em",margin:"22px 0 6px"}}>COLOR · live tweakable →</div>
              <div style={{display:"flex",gap:10}}>
                {[["paper","var(--paper)"],["paper-2","var(--paper-2)"],["ink","var(--ink)"],["accent","var(--accent)"]].map(([n,v])=>(
                  <div key={n} style={{flex:1}}>
                    <div style={{height:60,background:v,border:"1.5px solid var(--ink)",borderRadius:6}}></div>
                    <div className="mono" style={{fontSize:11,marginTop:6}}>{n}</div>
                  </div>
                ))}
              </div>

              <div className="mono" style={{fontSize:12,letterSpacing:".14em",margin:"22px 0 6px"}}>VOICE</div>
              <ul style={{margin:0,paddingLeft:18,fontSize:15,lineHeight:1.6}}>
                <li>First-person, present-tense, plain English</li>
                <li>Engineer humor — dry, no exclamation marks</li>
                <li>Small numbers over big claims (“61 commits” &gt; “revolutionary”)</li>
                <li>Tweet-length sentences. Paragraphs that breathe.</li>
              </ul>
            </div>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme">
          <TweakRadio label="Mode"   value={t.theme}  options={["light","dark"]}
                      onChange={v => setTweak("theme", v)} />
          <TweakRadio label="Paper"  value={t.paper}  options={["warm","cool","grey","cream"]}
                      onChange={v => setTweak("paper", v)} />
          <TweakRadio label="Accent" value={t.accent} options={["forest","mint","tomato","indigo","marigold"]}
                      onChange={v => setTweak("accent", v)} />
        </TweakSection>
        <TweakSection label="Display">
          <TweakToggle label="Sketch annotations" value={t.showAnnotations}
                       onChange={v => setTweak("showAnnotations", v)} />
          <TweakToggle label="Grid background"    value={t.showGrid}
                       onChange={v => setTweak("showGrid", v)} />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("canvas-root")).render(<App />);
