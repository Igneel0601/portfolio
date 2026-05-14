// wireframes.jsx — six wireframe directions, tailored for Vaibhav Verma

/* ════════════════════════════════════════════════════════════════════
   F · HYBRID — Terminal × Scrollytelling   (the recommended one)
   ════════════════════════════════════════════════════════════════════ */
function WFHybrid(){
  return (
    <div className="wf" style={{background:"var(--paper)"}}>
      <div className="grid-bg"></div>

      <span className="stamp" style={{position:"absolute",top:14,right:14,zIndex:5}}>RECOMMENDED</span>

      {/* tiny terminal bar */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderBottom:"1.5px solid var(--ink)",background:"var(--paper-2)"}}>
        <span style={{width:10,height:10,border:"1.4px solid var(--ink)",borderRadius:"50%"}}></span>
        <span style={{width:10,height:10,border:"1.4px solid var(--ink)",borderRadius:"50%"}}></span>
        <span style={{width:10,height:10,border:"1.4px solid var(--ink)",borderRadius:"50%"}}></span>
        <div className="mono" style={{marginLeft:8,fontSize:12}}>vaibhav@noida:~/portfolio$</div>
        <div className="mono mute" style={{marginLeft:"auto",fontSize:12}}>scroll = run the story</div>
      </div>

      {/* SCENE 01 · boot screen */}
      <section style={{padding:"40px 36px 18px",position:"relative"}}>
        <div className="mono" style={{fontSize:13,lineHeight:1.7}}>
          <div><span style={{color:"var(--accent)"}}>$</span> ./hello.sh</div>
          <div className="mute" style={{paddingLeft:14}}>[boot] mounting portfolio…</div>
          <div className="mute" style={{paddingLeft:14}}>[boot] loading vaibhav.profile…</div>
          <div className="mute" style={{paddingLeft:14}}>[ok ] ready in 0.42s</div>
        </div>

        <h1 className="serif" style={{fontSize:72,lineHeight:.95,margin:"22px 0 8px",fontWeight:800,letterSpacing:"-.015em"}}>
          I’m <span className="hilite">Vaibhav.</span><br/>
          I build software<br/>
          that <span className="squig">teaches itself</span><br/>
          to write more software.
        </h1>
        <p className="mute" style={{fontSize:18,maxWidth:560,marginTop:14}}>
          B.Tech CSE · Gautam Buddha University · Noida · open to full-time + freelance · I ship AI-powered web apps and the tooling around them.
        </p>

        <div style={{display:"flex",gap:10,marginTop:22}}>
          <span className="btn solid">$ cat work →</span>
          <span className="btn">$ download résumé.pdf</span>
          <span className="btn">$ contact</span>
        </div>

        <div className="annot" style={{top:60,right:30,transform:"rotate(3deg)"}}>↘ type-on (GSAP TextPlugin)<br/>then headline reveals word-by-word</div>
      </section>

      <div className="wavy" style={{margin:"6px 36px"}}></div>

      {/* SCENE 02 · the pinned project canvas */}
      <section style={{padding:"24px 36px",position:"relative"}}>
        <div className="mono mute" style={{fontSize:11,letterSpacing:".18em"}}>SCENE 02 — SELECTED WORK · PINNED CANVAS</div>
        <div style={{display:"grid",gridTemplateColumns:"1.1fr .9fr",gap:18,marginTop:10,alignItems:"start"}}>
          {/* pinned side */}
          <div className="box-wob" style={{padding:14,background:"var(--paper-2)",boxShadow:"5px 5px 0 var(--ink)"}}>
            <div className="img-ph" style={{height:260}}>codeflow — live UI capture</div>
            <div className="mono" style={{fontSize:11,marginTop:10,letterSpacing:".14em",color:"var(--accent)"}}>NOW SHOWING · 01 / 03</div>
            <div className="serif" style={{fontSize:30,fontWeight:800,marginTop:4}}>CodeFlow</div>
            <div className="mute" style={{fontSize:15,marginTop:2}}>AI-powered website builder. Chat with agents in real-time E2B sandboxes and get a working Next.js app out the other side.</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
              {["next.js 16","react 19","tRPC","prisma","inngest","e2b","openai/gemini"].map(t=>(
                <span key={t} className="pill mono" style={{fontSize:11,padding:"3px 8px"}}>{t}</span>
              ))}
            </div>
            <div className="mono" style={{fontSize:11,marginTop:12,letterSpacing:".12em"}}>
              <span style={{color:"var(--accent)"}}>›</span> code-flow-hazel.vercel.app &nbsp; · &nbsp; <span className="mute">61 commits · solo</span>
            </div>
          </div>

          {/* upcoming side */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div className="mute mono" style={{fontSize:11,letterSpacing:".14em"}}>UP NEXT — KEEPS SCROLLING</div>

            <div className="box" style={{padding:10,opacity:.95,background:"var(--paper-2)"}}>
              <div style={{display:"grid",gridTemplateColumns:"100px 1fr",gap:10}}>
                <div className="img-ph" style={{height:64}}>taskforge ui</div>
                <div>
                  <div className="mono mute" style={{fontSize:10,letterSpacing:".12em"}}>02 · COLLABORATION</div>
                  <div className="serif" style={{fontSize:18,fontWeight:700}}>TaskForge</div>
                  <div className="mute" style={{fontSize:13,lineHeight:1.3}}>Real-time Kanban with AI task elaboration · Liveblocks + Mongo</div>
                </div>
              </div>
            </div>

            <div className="box" style={{padding:10,opacity:.75,background:"var(--paper-2)"}}>
              <div style={{display:"grid",gridTemplateColumns:"100px 1fr",gap:10}}>
                <div className="img-ph" style={{height:64}}>traveloop</div>
                <div>
                  <div className="mono mute" style={{fontSize:10,letterSpacing:".12em"}}>03 · HACKATHON</div>
                  <div className="serif" style={{fontSize:18,fontWeight:700}}>Traveloop</div>
                  <div className="mute" style={{fontSize:13,lineHeight:1.3}}>Odoo Hackathon · The Knights · group build, shipped on the clock</div>
                </div>
              </div>
            </div>

            <div className="box-dash" style={{padding:10,opacity:.55}}>
              <div className="mono mute" style={{fontSize:11,letterSpacing:".12em"}}>+ wall-engine · arch-install · more in /experiments</div>
            </div>

            <div className="annot" style={{position:"relative",left:6,top:6,transform:"rotate(2deg)"}}>↑ side cards scroll past, hero stays pinned<br/>(ScrollTrigger pin + horizontal swap)</div>
          </div>
        </div>
      </section>

      <div className="wavy" style={{margin:"6px 36px"}}></div>

      {/* SCENE 03 · about + skills as code */}
      <section style={{padding:"22px 36px",display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:18,position:"relative"}}>
        <div>
          <div className="mono mute" style={{fontSize:11,letterSpacing:".18em"}}>SCENE 03 — ABOUT</div>
          <h2 className="serif" style={{fontSize:30,margin:"6px 0 10px",fontWeight:800}}>The short version.</h2>
          <p style={{fontSize:16,lineHeight:1.5,maxWidth:520}}>
            CSE grad from Gautam Buddha University, based in Noida. I like the part of software where you stop reading docs and start figuring out why production is on fire. Currently looking for a first full-time role — also taking freelance.
          </p>
          <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:14}}>
            {["typescript","next.js","react","node","python","postgres","mongo","tailwind","prisma","inngest","aws"].map(t=>(
              <span key={t} className="pill mono" style={{fontSize:11}}>{t}</span>
            ))}
          </div>
        </div>

        <div className="box" style={{padding:14,background:"var(--paper-2)",fontFamily:"IBM Plex Mono",fontSize:13,lineHeight:1.6}}>
          <div className="mute" style={{fontSize:11,letterSpacing:".14em",marginBottom:6}}>~/about.ts</div>
          <div><span style={{color:"var(--accent)"}}>const</span> vaibhav = {"{"}</div>
          <div style={{paddingLeft:14}}>name: <span style={{color:"var(--accent-2)"}}>"Vaibhav Verma"</span>,</div>
          <div style={{paddingLeft:14}}>role: <span style={{color:"var(--accent-2)"}}>"software engineer"</span>,</div>
          <div style={{paddingLeft:14}}>based: <span style={{color:"var(--accent-2)"}}>"Noida, IN"</span>,</div>
          <div style={{paddingLeft:14}}>open_to: [<span style={{color:"var(--accent-2)"}}>"full-time"</span>, <span style={{color:"var(--accent-2)"}}>"freelance"</span>],</div>
          <div style={{paddingLeft:14}}>currently: <span style={{color:"var(--accent-2)"}}>"shipping ai tooling"</span>,</div>
          <div style={{paddingLeft:14}}>coffee: <span style={{color:"var(--accent-2)"}}>"more than is reasonable"</span></div>
          <div>{"}"};</div>
          <div className="mute" style={{marginTop:6}}>// hover any value to see how it got there</div>
        </div>

        <div className="annot b" style={{right:38,bottom:-8}}>← stack pills float in on scroll</div>
      </section>

      <div className="wavy" style={{margin:"6px 36px"}}></div>

      {/* SCENE 04 · future modules */}
      <section style={{padding:"22px 36px",position:"relative"}}>
        <div className="mono mute" style={{fontSize:11,letterSpacing:".18em"}}>SCENE 04 — COMING SOON</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginTop:10}}>
          {[
            ["experiments","tiny demos, shaders, half-finished ideas"],
            ["writing","notes from building in public"],
            ["/dev/letters","one email a month — what I built, what I broke"],
          ].map(([h,s],i)=>(
            <div key={i} className="box" style={{padding:14,position:"relative",background:"var(--paper-2)"}}>
              <span className="stamp" style={{position:"absolute",top:-12,right:10}}>future</span>
              <div className="serif" style={{fontSize:22,fontWeight:800}}>{h}</div>
              <div className="mute mono" style={{fontSize:12,marginTop:6}}>{s}</div>
              <div className="line short" style={{marginTop:14}}></div>
              <div className="line tiny" style={{marginTop:6}}></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section style={{margin:"14px 36px 0",padding:"16px 18px",border:"1.6px solid var(--ink)",borderRadius:10,background:"var(--paper-2)",display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:18,alignItems:"center"}}>
        <div>
          <div className="mono mute" style={{fontSize:11,letterSpacing:".18em",color:"var(--accent)"}}>END OF STORY · YOUR MOVE</div>
          <div className="serif" style={{fontSize:26,fontWeight:800,margin:"4px 0 2px"}}>Hiring? Building? Curious?</div>
          <div className="mute" style={{fontSize:14}}>Drop a line — I respond fast.</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <span className="btn solid">hi@igneel.dev</span>
          <span className="btn">github · linkedin · x</span>
        </div>
      </section>

      <footer style={{padding:"14px 36px 18px",fontFamily:"IBM Plex Mono",fontSize:12,display:"flex",justifyContent:"space-between"}}>
        <span className="mute">$ exit 0 · built with too much GSAP &amp; coffee</span>
        <span className="mute">© Vaibhav Verma · 2026</span>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   A · SCROLL NARRATIVE   (tailored)
   ════════════════════════════════════════════════════════════════════ */
function WFScroll(){
  return (
    <div className="wf">
      <div className="grid-bg"></div>

      <div className="nav-bar">
        <div className="mono" style={{fontWeight:600}}>~/vaibhav-verma</div>
        <div className="links mute">
          <span>work</span><span>experiments</span><span>writing</span><span>about</span><span>·</span><span className="ink" style={{fontWeight:600}}>say hi ↗</span>
        </div>
      </div>

      <section style={{padding:"56px 40px 30px",position:"relative"}}>
        <div className="mono mute" style={{fontSize:12,letterSpacing:".18em"}}>SCENE 01 — INTRO</div>
        <h1 className="serif" style={{fontSize:80,lineHeight:.95,margin:"14px 0 8px",fontWeight:800,letterSpacing:"-.015em"}}>
          Hi, I’m <span className="hilite">Vaibhav.</span><br/>
          I build small, careful<br/>
          <span className="squig">AI-shaped</span> tools.
        </h1>
        <p className="mute" style={{fontSize:18,maxWidth:520,margin:"14px 0 0"}}>
          B.Tech CSE · Gautam Buddha University · open to full-time roles and freelance.
        </p>
        <div style={{display:"flex",gap:10,marginTop:22}}>
          <span className="btn solid">see my work ↓</span>
          <span className="btn">résumé / pdf</span>
        </div>
        <div className="annot" style={{top:80,right:36,transform:"rotate(4deg)"}}>↘ word-by-word reveal<br/>(GSAP SplitText)</div>
      </section>

      <div className="wavy" style={{margin:"10px 40px"}}></div>

      <section style={{padding:"30px 40px",position:"relative"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
          <div>
            <div className="mono mute" style={{fontSize:12,letterSpacing:".18em"}}>SCENE 02 — SELECTED WORK</div>
            <h2 className="serif" style={{fontSize:36,margin:"6px 0 0",fontWeight:700}}>Three things I made.</h2>
          </div>
          <span className="pill">03 / 03</span>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1.1fr 1fr",gap:18,marginTop:22}}>
          <div className="box-wob" style={{padding:14,background:"var(--paper-2)"}}>
            <div className="img-ph" style={{height:220}}>codeflow — split-pane preview</div>
            <div className="mono" style={{fontSize:11,marginTop:10,letterSpacing:".1em"}}>01 · FLAGSHIP</div>
            <div className="serif" style={{fontSize:22,fontWeight:700,marginTop:2}}>CodeFlow — AI app builder</div>
            <div className="mute" style={{fontSize:13,marginTop:6}}>Chat → Next.js app in an E2B sandbox.</div>
            <div className="mono mute" style={{fontSize:11,marginTop:10,letterSpacing:".1em"}}>NEXT.JS · TRPC · INNGEST · OPENAI</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[
              ["02","COLLAB","TaskForge","Real-time Kanban + AI task elaboration"],
              ["03","HACKATHON","Traveloop","Odoo Hackathon · The Knights"],
              ["04","NEXT","…","what I’m building right now"],
            ].map(([n,k,t,d])=>(
              <div key={n} className="box" style={{padding:12,display:"grid",gridTemplateColumns:"90px 1fr 60px",gap:12,alignItems:"center",background:"var(--paper-2)"}}>
                <div className="img-ph" style={{height:64}}>thumb</div>
                <div>
                  <div className="mono mute" style={{fontSize:10,letterSpacing:".14em"}}>{n} · {k}</div>
                  <div className="serif" style={{fontSize:17,fontWeight:700}}>{t}</div>
                  <div className="mute" style={{fontSize:12,marginTop:2}}>{d}</div>
                </div>
                <div className="mono mute" style={{fontSize:11}}>read →</div>
              </div>
            ))}
          </div>
        </div>
        <div className="annot" style={{right:18,top:130,transform:"rotate(3deg)"}}>← pinned card,<br/>others scroll past</div>
      </section>

      <div className="wavy" style={{margin:"10px 40px"}}></div>

      <section style={{padding:"24px 40px",position:"relative",display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:24}}>
        <div>
          <div className="mono mute" style={{fontSize:12,letterSpacing:".18em"}}>SCENE 03 — ABOUT</div>
          <h2 className="serif" style={{fontSize:30,margin:"6px 0 8px",fontWeight:700}}>The short version.</h2>
          <p style={{fontSize:15,lineHeight:1.5}}>CSE grad from Noida. I like AI tooling, real-time collaboration, and building things end-to-end. Looking for somewhere I can keep shipping.</p>
          <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:14}}>
            {["typescript","next.js","react","node","python","prisma","mongo","tailwind"].map(t=>(
              <span key={t} className="pill mono">{t}</span>
            ))}
          </div>
        </div>
        <div className="box-dash" style={{padding:14}}>
          <div className="mono" style={{fontSize:11,letterSpacing:".14em"}}>TIMELINE</div>
          {[
            "2026 · B.Tech CSE — graduating",
            "May 2026 · Odoo Hackathon — Traveloop",
            "2026 · shipped CodeFlow (61 commits)",
            "2025 · wall-engine hits 3★ on Hyprland feed",
            "2025 · TaskForge — real-time kanban",
          ].map((t,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"14px 1fr",gap:10,alignItems:"center",margin:"12px 0"}}>
              <div style={{width:10,height:10,border:"1.4px solid var(--ink)",borderRadius:"50%",background:i===0?"var(--ink)":"transparent"}}></div>
              <div className="mono" style={{fontSize:13}}>{t}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="wavy" style={{margin:"10px 40px"}}></div>

      <section style={{padding:"22px 40px",position:"relative"}}>
        <div className="mono mute" style={{fontSize:12,letterSpacing:".18em"}}>SCENE 04 — COMING SOON</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14,marginTop:12}}>
          {[["experiments","tiny demos, shaders, weird ideas"],["writing","notes from building in public"],["newsletter","one email a month"]].map(([h,s],i)=>(
            <div key={i} className="box" style={{padding:14,position:"relative",background:"var(--paper-2)"}}>
              <span className="stamp" style={{position:"absolute",top:-10,right:10}}>future</span>
              <div className="serif" style={{fontSize:22,fontWeight:700}}>{h}</div>
              <div className="mute mono" style={{fontSize:12,marginTop:6}}>{s}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{padding:"22px 40px",borderTop:"1.5px dashed var(--ink)",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:14}}>
        <div className="hand" style={{fontSize:28}}>made with too much coffee ☕</div>
        <div className="mono mute" style={{fontSize:12}}>gh · ln · x · email</div>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   B · TERMINAL / ENGINEER'S NOTEBOOK   (tailored)
   ════════════════════════════════════════════════════════════════════ */
function WFTerminal(){
  return (
    <div className="wf" style={{background:"var(--paper)"}}>
      <div className="grid-bg"></div>

      <div style={{display:"flex",alignItems:"center",gap:10,padding:"12px 18px",borderBottom:"1.5px solid var(--ink)",background:"var(--paper-2)"}}>
        <span style={{width:12,height:12,border:"1.4px solid var(--ink)",borderRadius:"50%"}}></span>
        <span style={{width:12,height:12,border:"1.4px solid var(--ink)",borderRadius:"50%"}}></span>
        <span style={{width:12,height:12,border:"1.4px solid var(--ink)",borderRadius:"50%"}}></span>
        <div className="mono" style={{marginLeft:10,fontSize:12}}>vaibhav@noida:~/portfolio — bash — 80×40</div>
        <div className="mono mute" style={{marginLeft:"auto",fontSize:12}}>v 0.1.0 · last build 2m ago</div>
      </div>

      <section style={{padding:"30px 36px 16px",position:"relative"}}>
        <div className="mono" style={{fontSize:14,lineHeight:1.7}}>
          <div><span style={{color:"var(--accent)"}}>$</span> whoami</div>
          <div style={{paddingLeft:14}} className="mute">vaibhav verma — cs engineer, just shipped a degree.</div>
          <div style={{marginTop:8}}><span style={{color:"var(--accent)"}}>$</span> cat about.md | head -3</div>
        </div>

        <h1 className="serif" style={{fontSize:54,lineHeight:1,margin:"18px 0 4px",fontWeight:800}}>
          I like systems that<br/>are <span className="hilite">small enough</span> to hold<br/>in your head.
        </h1>
        <div className="mute mono" style={{fontSize:13,marginTop:14}}>// scroll, or type a command — both work.</div>

        <div className="box" style={{marginTop:18,padding:"10px 14px",display:"flex",alignItems:"center",gap:10,background:"var(--paper-2)"}}>
          <span className="mono" style={{color:"var(--accent)"}}>›</span>
          <span className="mono mute" style={{fontSize:14}}>try: work · about · experiments · writing · contact</span>
          <span style={{marginLeft:"auto",width:8,height:18,background:"var(--ink)"}}></span>
        </div>

        <div className="annot" style={{top:30,right:24,transform:"rotate(3deg)"}}>↘ commands act like links<br/>(GSAP type-on)</div>
      </section>

      <section style={{padding:"10px 36px",position:"relative"}}>
        <div className="mono" style={{fontSize:12,letterSpacing:".14em"}}>./projects — BUILD LOG</div>
        <div className="box" style={{marginTop:10,padding:"14px 18px",background:"var(--paper-2)"}}>
          {[
            ["[ok ]","flagship","codeflow","next.js, trpc, inngest, e2b","61 commits"],
            ["[ok ]","oss","wall-engine","shell · hyprland wallpaper switcher","3★ 1 fork"],
            ["[ok ]","collab","taskforge","liveblocks, mongo, next","real-time"],
            ["[ok ]","dotfiles","arch-install","shell · my linux setup, scripted","weekend rabbit-hole"],
            ["[ok ]","hackathon","traveloop","odoo · the knights","group build"],
            ["[wip]","next","…","writing the README first","early days"],
          ].map((r,i)=>(
            <div key={i} className="mono" style={{display:"grid",gridTemplateColumns:"58px 100px 1fr 1.2fr 120px",gap:14,fontSize:13,padding:"6px 0",borderBottom:i<5?"1px dashed rgba(127,127,127,.35)":"none"}}>
              <span style={{color:r[0]==="[ok ]"?"#3a7d3a":r[0]==="[wip]"?"#b06b00":"var(--accent)"}}>{r[0]}</span>
              <span className="mute">{r[1]}</span>
              <span style={{fontWeight:600}}>{r[2]}</span>
              <span className="mute">{r[3]}</span>
              <span className="mute" style={{textAlign:"right"}}>{r[4]}</span>
            </div>
          ))}
        </div>
        <div className="annot b" style={{right:24,bottom:-14}}>each row expands inline ↑</div>
      </section>

      <section style={{padding:"28px 36px 14px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <div className="box" style={{padding:14,background:"var(--paper-2)"}}>
          <div className="mono mute" style={{fontSize:11,letterSpacing:".14em"}}>./now.txt</div>
          <h3 className="serif" style={{fontSize:22,margin:"6px 0 8px",fontWeight:700}}>What I’m doing now</h3>
          <div className="line"></div>
          <div className="line short" style={{marginTop:8}}></div>
          <div className="line" style={{marginTop:8}}></div>
          <div className="mono" style={{fontSize:12,marginTop:12}}>↳ updates monthly, /now-style</div>
        </div>
        <div className="box" style={{padding:14,background:"var(--paper-2)"}}>
          <div className="mono mute" style={{fontSize:11,letterSpacing:".14em"}}>./stack.json</div>
          <div className="mono" style={{fontSize:13,lineHeight:1.8,marginTop:8}}>
            {"{"}<br/>
            &nbsp;&nbsp;"daily": ["typescript","next.js","python"],<br/>
            &nbsp;&nbsp;"poking_at": ["rust","duckdb"],<br/>
            &nbsp;&nbsp;"editor": "vscode (with vim mode)",<br/>
            &nbsp;&nbsp;"caffeine": "filter coffee, repeat"<br/>
            {"}"}
          </div>
        </div>
      </section>

      <section style={{margin:"14px 36px",border:"1.6px solid var(--ink)",padding:14,background:"var(--paper-2)",position:"relative"}}>
        <span className="stamp" style={{position:"absolute",top:-12,left:14}}>future</span>
        <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:18,alignItems:"center"}}>
          <div>
            <div className="serif" style={{fontSize:22,fontWeight:800}}>Subscribe to /dev/letters</div>
            <div className="mute mono" style={{fontSize:12,marginTop:4}}>one email a month · what I built, what I read, what broke</div>
          </div>
          <div style={{display:"flex",gap:8}}>
            <div className="box" style={{flex:1,padding:"10px 12px",fontFamily:"IBM Plex Mono",fontSize:13,color:"var(--ink-soft)",background:"var(--paper)"}}>you@domain.com</div>
            <span className="btn solid">subscribe</span>
          </div>
        </div>
      </section>

      <footer className="mono" style={{padding:"16px 36px",borderTop:"1.5px solid var(--ink)",display:"flex",justifyContent:"space-between",fontSize:12}}>
        <span>$ exit 0</span>
        <span className="mute">github · linkedin · x · email</span>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   C · EDITORIAL   (alternate)
   ════════════════════════════════════════════════════════════════════ */
function WFEditorial(){
  return (
    <div className="wf">
      <div className="grid-bg"></div>

      <header style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"end",padding:"22px 36px 14px",borderBottom:"2px solid var(--ink)"}}>
        <div className="mono" style={{fontSize:11,letterSpacing:".2em"}}>VOL.01 · ISSUE 2026</div>
        <div className="serif" style={{fontSize:46,fontWeight:800,letterSpacing:"-.02em",lineHeight:1}}>VAIBHAV VERMA</div>
        <div className="mono" style={{fontSize:11,letterSpacing:".2em",textAlign:"right"}}>A QUARTERLY OF SHIPPED THINGS</div>
      </header>

      <div className="mono mute" style={{display:"flex",justifyContent:"space-between",padding:"6px 36px",borderBottom:"1.5px solid var(--ink)",fontSize:11,letterSpacing:".18em"}}>
        <span>WORK · ABOUT · EXPERIMENTS · WRITING · CONTACT</span>
        <span>NOIDA · EST. 2026</span>
      </div>

      <section style={{padding:"28px 36px 14px",display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:30,position:"relative"}}>
        <div>
          <div className="mono" style={{fontSize:11,letterSpacing:".2em",color:"var(--accent)"}}>FEATURE — THE GRADUATE ISSUE</div>
          <h1 className="serif" style={{fontSize:64,lineHeight:.95,margin:"10px 0 12px",fontWeight:800,letterSpacing:"-.01em"}}>
            On AI tooling,<br/>
            <span style={{fontStyle:"italic"}}>collaboration in real time,</span><br/>
            and finishing school.
          </h1>
          <div className="mono mute" style={{fontSize:13}}>by Vaibhav Verma · 12 min read · published this month</div>
          <div style={{marginTop:18,columnCount:2,columnGap:22}}>
            <div className="line"></div>
            <div className="line" style={{marginTop:8}}></div>
            <div className="line short" style={{marginTop:8}}></div>
            <div className="line" style={{marginTop:8}}></div>
            <div className="line" style={{marginTop:8}}></div>
            <div className="line tiny" style={{marginTop:8}}></div>
          </div>
        </div>
        <div>
          <div className="img-ph" style={{height:320}}>portrait, full-bleed</div>
          <div className="mute mono" style={{fontSize:11,marginTop:6,letterSpacing:".1em"}}>FIG. 01 — Verma, pictured at desk, Noida, 2026.</div>
        </div>
        <div className="annot" style={{left:36,top:-10,transform:"rotate(-2deg)"}}>large serif, slow scroll fade-in ↓</div>
      </section>

      <section style={{padding:"18px 36px 6px",borderTop:"1.5px solid var(--ink)"}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between"}}>
          <div className="serif" style={{fontSize:30,fontWeight:800}}>Selected Work — 2024–2026</div>
          <div className="mono mute" style={{fontSize:11,letterSpacing:".18em"}}>03 PIECES · INDEX →</div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:26,marginTop:18}}>
          {[
            ["I.","CodeFlow","An AI-powered website builder, in 61 commits.","engineering / ai"],
            ["II.","TaskForge","Watching teams move in real time.","collab / liveblocks"],
            ["III.","Traveloop","A hackathon weekend, and what it taught me.","group / odoo"],
            ["IV.","Coming Soon","Whatever I’m building next, written about here.","wip"],
          ].map(([n,t,d,k],i)=>(
            <article key={i} style={{borderTop:"1.5px solid var(--ink)",paddingTop:14}}>
              <div className="mono" style={{fontSize:11,letterSpacing:".2em",color:"var(--accent)"}}>{k.toUpperCase()}</div>
              <div className="serif" style={{fontSize:14,fontWeight:600,marginTop:4}}>{n}</div>
              <div className="serif" style={{fontSize:28,fontWeight:700,lineHeight:1.05,margin:"4px 0 6px"}}>{t}</div>
              <div className="mute" style={{fontSize:15,fontFamily:"Fraunces",fontStyle:"italic"}}>{d}</div>
              <div className="img-ph" style={{height:120,marginTop:10}}>spread image</div>
              <div className="mono" style={{fontSize:11,marginTop:8,letterSpacing:".14em"}}>READ THE PIECE →</div>
            </article>
          ))}
        </div>
      </section>

      <section style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",borderTop:"1.5px solid var(--ink)",borderBottom:"1.5px solid var(--ink)",marginTop:18}}>
        {[
          ["DOSSIER","B.Tech CSE · GBU · class of 2026","based in Noida, IN"],
          ["INDEX","experiments · writing · /dev/letters","(coming soon)"],
          ["CORRESPOND","hi@igneel.dev","gh · ln · x"],
        ].map(([h,a,b],i)=>(
          <div key={i} style={{padding:18,borderLeft:i?"1.5px solid var(--ink)":"none"}}>
            <div className="mono" style={{fontSize:11,letterSpacing:".22em",color:"var(--accent)"}}>{h}</div>
            <div className="serif" style={{fontSize:20,fontWeight:700,marginTop:6}}>{a}</div>
            <div className="mute mono" style={{fontSize:12,marginTop:4}}>{b}</div>
          </div>
        ))}
      </section>

      <footer style={{padding:"16px 36px",display:"flex",justifyContent:"space-between",fontFamily:"IBM Plex Mono",fontSize:11,letterSpacing:".18em"}}>
        <span>© 2026 VAIBHAV VERMA · ALL WORDS HANDMADE</span>
        <span>PAGE 1 / 1</span>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   D · JOURNEY TIMELINE   (alternate)
   ════════════════════════════════════════════════════════════════════ */
function WFJourney(){
  const stops = [
    ["00","NOW","just shipped a degree.","GBU · B.Tech CSE · looking for what’s next.","intro card"],
    ["01","2026","Odoo Hackathon — Traveloop","Group build with The Knights. Weekend deadline, shipped.","team photo"],
    ["02","2026","CodeFlow goes live","AI app builder · E2B sandboxes · 61 commits, mostly mine.","codeflow capture"],
    ["03","2025","wall-engine hits the Hyprland feed","Dynamic wallpaper switcher. First OSS project to land stars (3★ / 1 fork).","hyprland desktop"],
    ["04","2025","TaskForge ships","Real-time collab + AI task elaboration in a Kanban. Liveblocks + Mongo.","kanban shot"],
    ["05","2024","switched to Arch full-time","arch-install scripts · ricing the setup · broke X11 a lot.","terminal screenshot"],
    ["06","2024","Web Developer Bootcamp","HTML → JS → React. Built the muscle memory I still use every day.","bootcamp cert"],
    ["07","2023","exploring options","Half-finished side projects, late-night YouTube tutorials, figuring out what stuck.","sketchbook"],
    ["08","2022","started at GBU","First lecture, first all-nighter, first ‘wait, I love this’ moment.","campus shot"],
  ];
  return (
    <div className="wf">
      <div className="grid-bg"></div>

      <div className="nav-bar">
        <div className="mono" style={{fontWeight:600}}>Vaibhav Verma · the long way around</div>
        <div className="links mute"><span>start over</span><span>jump to now</span><span>résumé</span></div>
      </div>

      <section style={{padding:"30px 36px 10px",position:"relative"}}>
        <div className="mono mute" style={{fontSize:12,letterSpacing:".18em"}}>SCROLL TO BEGIN</div>
        <h1 className="serif" style={{fontSize:62,lineHeight:.98,margin:"10px 0 6px",fontWeight:800}}>
          Four years,<br/>nine <span className="squig">stops</span>.
        </h1>
        <p className="mute" style={{fontSize:17,maxWidth:520}}>A portfolio told as a journey. Each milestone unfolds as you scroll — projects, hackathons, the bugs that taught me the most.</p>
        <div className="annot" style={{right:24,top:46,transform:"rotate(3deg)"}}>↘ vertical track,<br/>GSAP ScrollTrigger</div>
      </section>

      <section style={{padding:"6px 36px 18px",position:"relative"}}>
        <div style={{position:"absolute",left:160,top:0,bottom:0,width:0,borderLeft:"2.5px dashed var(--ink)"}}></div>

        {stops.map((s,i)=>{
          const right = i%2===1;
          return (
            <div key={s[0]} style={{display:"grid",gridTemplateColumns:"130px 60px 1fr",gap:0,padding:"20px 0",position:"relative"}}>
              <div className="mono" style={{textAlign:"right",paddingRight:30}}>
                <div style={{fontSize:11,letterSpacing:".18em",color:"var(--accent)"}}>STOP {s[0]}</div>
                <div className="serif" style={{fontSize:20,fontWeight:700,marginTop:2}}>{s[1]}</div>
              </div>
              <div style={{position:"relative",display:"flex",justifyContent:"center"}}>
                <div style={{width:18,height:18,borderRadius:"50%",border:"2px solid var(--ink)",background:i===0?"var(--accent)":"var(--paper)",marginTop:6,zIndex:1}}></div>
              </div>
              <div style={{paddingLeft:24}}>
                <div className="box" style={{padding:12,display:"grid",gridTemplateColumns: right? "1fr 130px" : "130px 1fr",gap:12,alignItems:"center",background:"var(--paper-2)"}}>
                  { !right && <div className="img-ph" style={{height:80}}>{s[4]}</div>}
                  <div>
                    <div className="serif" style={{fontSize:20,fontWeight:700}}>{s[2]}</div>
                    <div className="mute" style={{fontSize:14,marginTop:2}}>{s[3]}</div>
                    <div className="mono mute" style={{fontSize:11,marginTop:8,letterSpacing:".14em"}}>OPEN STOP →</div>
                  </div>
                  { right && <div className="img-ph" style={{height:80}}>{s[4]}</div>}
                </div>
              </div>
            </div>
          );
        })}
        <div className="annot b" style={{left:180,top:30}}>● = current, scroll pins the dot</div>
      </section>

      <section style={{margin:"4px 36px 0",padding:"20px",border:"1.6px dashed var(--ink)",borderRadius:10,display:"grid",gridTemplateColumns:"1.2fr 1fr",gap:18,alignItems:"center"}}>
        <div>
          <div className="mono" style={{fontSize:11,letterSpacing:".18em",color:"var(--accent)"}}>END OF THE ROAD (FOR NOW)</div>
          <div className="serif" style={{fontSize:30,fontWeight:800,margin:"4px 0 4px"}}>What’s next?</div>
          <div className="mute" style={{fontSize:15}}>Looking for a first full-time role — or freelance projects I can sink into. If that sounds like your team, say hi.</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <span className="btn solid">write me a letter ✉</span>
          <span className="btn">download résumé</span>
          <span className="btn">subscribe to /dev/letters (soon)</span>
        </div>
      </section>

      <footer style={{padding:"14px 36px",display:"flex",justifyContent:"space-between",fontFamily:"IBM Plex Mono",fontSize:12,marginTop:14}}>
        <span className="mute">made the long way · 2026</span>
        <span className="mute">gh · ln · x</span>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   E · HORIZONTAL CHAPTERS   (alternate)
   ════════════════════════════════════════════════════════════════════ */
function WFHorizontal(){
  return (
    <div className="wf">
      <div className="grid-bg"></div>

      <div className="nav-bar">
        <div className="mono" style={{fontWeight:600}}>igneel.dev</div>
        <div className="links mute"><span>·01 hello</span><span>02 work</span><span>03 me</span><span>04 next</span><span style={{color:"var(--accent)"}}>↔ swipe / scroll</span></div>
      </div>

      <div style={{margin:"14px 36px 6px",display:"flex",gap:6,alignItems:"center"}}>
        {[0,1,2,3,4,5].map(i=>(
          <div key={i} style={{height:6,flex:i===1?2:1,background:i<=1?"var(--ink)":"transparent",border:"1.4px solid var(--ink)",borderRadius:3}}></div>
        ))}
        <div className="mono mute" style={{fontSize:11,marginLeft:8}}>02 / 06</div>
      </div>

      <section style={{padding:"10px 0 14px",position:"relative"}}>
        <div className="mono mute" style={{padding:"0 36px",fontSize:11,letterSpacing:".18em"}}>HORIZONTAL CHAPTERS — STAGE LOCKS, CARDS SLIDE</div>
        <div style={{display:"flex",gap:18,padding:"14px 36px",overflow:"hidden",position:"relative"}}>
          <div className="box" style={{minWidth:300,padding:14,opacity:.45,transform:"translateX(-10px)",background:"var(--paper-2)"}}>
            <div className="mono" style={{fontSize:11,letterSpacing:".18em"}}>· 01 HELLO</div>
            <div className="serif" style={{fontSize:26,fontWeight:800,marginTop:6}}>I’m Vaibhav.</div>
            <div className="line short" style={{marginTop:10}}></div>
            <div className="line tiny" style={{marginTop:8}}></div>
          </div>

          <div className="box-wob" style={{minWidth:420,padding:16,background:"var(--paper-2)",boxShadow:"6px 6px 0 var(--ink)"}}>
            <div className="mono" style={{fontSize:11,letterSpacing:".18em",color:"var(--accent)"}}>· 02 WORK · NOW PLAYING</div>
            <div className="serif" style={{fontSize:30,fontWeight:800,margin:"6px 0 6px",lineHeight:1}}>Three things,<br/>told one at a time.</div>
            <div className="mute" style={{fontSize:14}}>Each project is a card. Open one to dive deep, or keep scrolling sideways.</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:14}}>
              {[["I","codeflow"],["II","taskforge"],["III","traveloop"],["IV","next…"]].map(([n,t])=>(
                <div key={n} className="box" style={{padding:10,background:"var(--paper)"}}>
                  <div className="img-ph" style={{height:60}}>thumb</div>
                  <div className="mono" style={{fontSize:11,marginTop:6,letterSpacing:".12em"}}>{n}</div>
                  <div className="serif" style={{fontSize:15,fontWeight:700}}>{t}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="box" style={{minWidth:340,padding:14,background:"var(--paper-2)"}}>
            <div className="mono" style={{fontSize:11,letterSpacing:".18em"}}>· 03 ME →</div>
            <div className="serif" style={{fontSize:24,fontWeight:800,marginTop:6}}>A short bio,<br/>some hobbies.</div>
            <div className="img-ph" style={{height:80,marginTop:10}}>portrait</div>
            <div className="line short" style={{marginTop:10}}></div>
            <div className="line tiny" style={{marginTop:6}}></div>
          </div>

          <div className="box" style={{minWidth:240,padding:14,opacity:.5,background:"var(--paper-2)"}}>
            <div className="mono" style={{fontSize:11,letterSpacing:".18em"}}>· 04 NEXT →</div>
            <div className="serif" style={{fontSize:20,fontWeight:800,marginTop:6}}>Say hi.</div>
            <div className="line short" style={{marginTop:10}}></div>
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"space-between",padding:"6px 36px"}}>
          <span className="btn">← prev chapter</span>
          <div className="mono mute" style={{fontSize:12,alignSelf:"center"}}>↔ vertical scroll = horizontal motion (GSAP)</div>
          <span className="btn solid">next chapter →</span>
        </div>
        <div className="annot" style={{right:30,top:-6,transform:"rotate(3deg)"}}>↓ scroll-jacked stage</div>
      </section>

      <section style={{padding:"16px 36px",borderTop:"1.5px dashed var(--ink)",display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:22}}>
        <div>
          <div className="mono mute" style={{fontSize:11,letterSpacing:".18em"}}>OR — JUMP STRAIGHT TO</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
            {["all work","experiments","writing","/dev/letters","résumé pdf","contact"].map(t=>(
              <div key={t} className="box" style={{padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",background:"var(--paper-2)"}}>
                <span className="serif" style={{fontSize:18,fontWeight:700}}>{t}</span>
                <span className="mono mute" style={{fontSize:12}}>→</span>
              </div>
            ))}
          </div>
        </div>
        <div className="box-dash" style={{padding:14}}>
          <div className="mono mute" style={{fontSize:11,letterSpacing:".18em"}}>FOOTPRINT</div>
          <div className="serif" style={{fontSize:18,fontWeight:700,marginTop:6}}>Currently</div>
          <div className="line" style={{marginTop:8}}></div>
          <div className="line short" style={{marginTop:6}}></div>
          <div className="mono" style={{fontSize:12,marginTop:10}}>open to: full-time + freelance · summer ’26</div>
        </div>
      </section>

      <footer style={{padding:"14px 36px",display:"flex",justifyContent:"space-between",fontFamily:"IBM Plex Mono",fontSize:12,borderTop:"1.5px solid var(--ink)",marginTop:10}}>
        <span className="mute">© Vaibhav Verma 2026 — built with gsap + coffee</span>
        <span className="mute">gh · ln · x · rss</span>
      </footer>
    </div>
  );
}

Object.assign(window, { WFHybrid, WFScroll, WFTerminal, WFEditorial, WFJourney, WFHorizontal });

/* ════════════════════════════════════════════════════════════════════
   F+ · CHOSEN — Hybrid Terminal × Scrollytelling, merged with the best
   bits of B (build log), C (editorial cards), D (timeline)
   ════════════════════════════════════════════════════════════════════ */
function WFHybridPlus(){
  return (
    <div className="wf" style={{background:"var(--paper)"}}>
      <div className="grid-bg"></div>
      <span className="stamp" style={{position:"absolute",top:14,right:14,zIndex:5}}>★ CHOSEN · F+</span>

      {/* terminal tab bar */}
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderBottom:"1.5px solid var(--ink)",background:"var(--paper-2)"}}>
        <span style={{width:10,height:10,border:"1.4px solid var(--ink)",borderRadius:"50%"}}></span>
        <span style={{width:10,height:10,border:"1.4px solid var(--ink)",borderRadius:"50%"}}></span>
        <span style={{width:10,height:10,border:"1.4px solid var(--ink)",borderRadius:"50%"}}></span>
        <div className="mono" style={{marginLeft:8,fontSize:12}}>vaibhav@noida:~/igneel.dev$</div>
        <div className="mono mute" style={{marginLeft:"auto",fontSize:12}}>scroll = run the story</div>
      </div>

      {/* HYBRID NAV — annotated with scroll vs route behavior */}
      <nav style={{display:"flex",alignItems:"center",gap:18,padding:"14px 28px",borderBottom:"1.5px dashed var(--ink)",position:"relative",fontFamily:"IBM Plex Mono",fontSize:13}}>
        <span style={{fontWeight:700}}>igneel.dev</span>
        <div style={{display:"flex",gap:18,marginLeft:24}}>
          {[
            ["work",      "scroll", "#work"],
            ["writing",   "route",  "/writing"],
            ["experiments","route", "/experiments"],
            ["about",     "scroll", "#about"],
            ["/now",      "route",  "/now"],
            ["/uses",     "route",  "/uses"],
          ].map(([label,kind,href])=>(
            <span key={label} style={{position:"relative",display:"inline-flex",flexDirection:"column",alignItems:"center"}}>
              <span>{label}</span>
              <span className="mono mute" style={{fontSize:9,letterSpacing:".1em",marginTop:2,color: kind==="route"?"var(--accent-2)":"var(--accent)"}}>
                {kind === "route" ? "→ "+href : "↓ "+href}
              </span>
            </span>
          ))}
        </div>
        <span style={{marginLeft:"auto",fontWeight:600}}>hi@igneel.dev</span>
        <span className="mono mute" style={{fontSize:9,letterSpacing:".1em",marginLeft:6,color:"var(--accent)"}}>mailto:</span>

        <div className="annot" style={{top:-2,right:340,transform:"rotate(-2deg)"}}>↑ <span style={{color:"var(--accent)"}}>orange</span> = scroll-to-section<br/>↑ <span style={{color:"var(--accent-2)"}}>blue</span> = navigate to new page</div>
      </nav>

      {/* SCENE 01 — terminal boot + hero (F's signature opening) */}
      <section id="hero" style={{padding:"36px 36px 22px",position:"relative"}}>
        <div className="mono" style={{fontSize:13,lineHeight:1.7}}>
          <div><span style={{color:"var(--accent)"}}>$</span> ./hello.sh</div>
          <div className="mute" style={{paddingLeft:14}}>[boot] mounting portfolio…</div>
          <div className="mute" style={{paddingLeft:14}}>[boot] loading vaibhav.profile…</div>
          <div className="mute" style={{paddingLeft:14}}>[ok ] ready in 0.42s</div>
        </div>

        <h1 className="serif" style={{fontSize:74,lineHeight:.95,margin:"22px 0 8px",fontWeight:800,letterSpacing:"-.015em"}}>
          I’m <span className="hilite">Vaibhav.</span><br/>
          I build software<br/>
          that <span className="squig">teaches itself</span><br/>
          to write more software.
        </h1>
        <p className="mute" style={{fontSize:18,maxWidth:560,marginTop:14}}>
          B.Tech CSE · Gautam Buddha University · Noida · open to full-time + freelance.
        </p>

        <div style={{display:"flex",gap:10,marginTop:22}}>
          <span className="btn solid">↓ scroll the story</span>
          <span className="btn">$ download résumé.pdf</span>
          <span className="btn">hi@igneel.dev</span>
        </div>
        <div className="annot" style={{top:60,right:30,transform:"rotate(3deg)"}}>↘ type-on then headline reveals<br/>word-by-word (GSAP)</div>
      </section>

      <div className="wavy" style={{margin:"6px 36px"}}></div>

      {/* SCENE 02 — Pinned project canvas (matches motion-spec §02) */}
      <section id="work" data-scene="work" style={{padding:"24px 36px",position:"relative"}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between"}}>
          <div>
            <div className="mono mute" style={{fontSize:11,letterSpacing:".18em"}} data-section-label>SCENE 02 — SELECTED WORK</div>
            <h2 className="serif" style={{fontSize:36,fontWeight:800,margin:"4px 0 0"}} data-section-title>Three things I shipped.</h2>
          </div>
          <span className="mono mute" style={{fontSize:11,letterSpacing:".18em"}}>PINNED · 3× SCROLL</span>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1.1fr 0.9fr",gap:18,marginTop:14,alignItems:"start"}}>
          {/* LEFT — pinned hero card (3 slides stacked, only active shown in wireframe) */}
          <div className="box-wob" style={{padding:14,background:"var(--paper-2)",boxShadow:"5px 5px 0 var(--ink)",position:"relative"}}>
            <div className="img-ph" style={{aspectRatio:"16 / 10"}} data-slide="0" data-slide-state="active">codeflow — split-pane preview (16:10)</div>
            <div className="mono" style={{fontSize:11,marginTop:10,letterSpacing:".14em",color:"var(--accent)"}}>NOW SHOWING · <span data-counter>01</span>/03</div>
            <div className="serif" style={{fontSize:30,fontWeight:800,marginTop:4}}>CodeFlow</div>
            <div className="mute" style={{fontSize:15,marginTop:2}}>AI-powered website builder. Chat with agents in real-time E2B sandboxes and get a working Next.js app out the other side.</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:10}}>
              {["next.js","trpc","prisma","inngest","e2b","openai"].map(t=>(
                <span key={t} className="pill mono" style={{fontSize:11,padding:"3px 8px"}}>{t}</span>
              ))}
            </div>
            <div className="mono" style={{fontSize:11,marginTop:12,letterSpacing:".12em",color:"var(--accent-2)"}}>READ THE CASE STUDY → /work/codeflow</div>

            {/* dim hint that two more slides live in this same cell */}
            <div className="mono mute" style={{position:"absolute",top:14,right:18,fontSize:10,letterSpacing:".14em",opacity:.5}}>[data-slide=1, 2 stacked here]</div>
          </div>

          {/* RIGHT — up-next rail */}
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            <div className="mute mono" style={{fontSize:11,letterSpacing:".14em"}}>UP NEXT — KEEPS SCROLLING</div>

            <div className="box" style={{padding:10,background:"var(--paper-2)"}} data-side="1">
              <div style={{display:"grid",gridTemplateColumns:"110px 1fr",gap:10}}>
                <div className="img-ph" style={{aspectRatio:"16 / 10"}}>taskforge ui</div>
                <div>
                  <div className="mono mute" style={{fontSize:10,letterSpacing:".12em"}}>02 · COLLABORATION</div>
                  <div className="serif" style={{fontSize:18,fontWeight:700}}>TaskForge</div>
                  <div className="mute" style={{fontSize:13,lineHeight:1.3}}>Real-time Kanban + AI task elaboration · Liveblocks + Mongo</div>
                </div>
              </div>
            </div>

            <div className="box" style={{padding:10,background:"var(--paper-2)",opacity:.75}} data-side="2">
              <div style={{display:"grid",gridTemplateColumns:"110px 1fr",gap:10}}>
                <div className="img-ph" style={{aspectRatio:"16 / 10"}}>traveloop</div>
                <div>
                  <div className="mono mute" style={{fontSize:10,letterSpacing:".12em"}}>03 · HACKATHON</div>
                  <div className="serif" style={{fontSize:18,fontWeight:700}}>Traveloop</div>
                  <div className="mute" style={{fontSize:13,lineHeight:1.3}}>Odoo Hackathon · The Knights · trip planner with collaborative edits</div>
                </div>
              </div>
            </div>

            {/* progress dots */}
            <div style={{display:"flex",gap:6,marginTop:4}} data-progress>
              {[0,1,2].map(i => (
                <span key={i} style={{height:6,flex:1,background:i===0?"var(--accent)":"transparent",border:"1.4px solid var(--ink)",borderRadius:3}}></span>
              ))}
            </div>

            <div className="annot" style={{position:"relative",left:6,top:6,transform:"rotate(2deg)"}}>↑ scrub-swap (motion-spec §02 B2–B8)</div>
          </div>
        </div>

        {/* see-all-projects affordance */}
        <div style={{marginTop:18,display:"flex",alignItems:"center",gap:14,padding:"12px 16px",border:"1.6px dashed var(--ink)",borderRadius:8,background:"var(--paper-2)"}}>
          <span className="mono mute" style={{fontSize:12}}>// want the full list? wall-engine, arch-install, dotfiles, more —</span>
          <span style={{marginLeft:"auto"}} className="btn">see all projects → /work</span>
        </div>
        <div className="annot b" style={{right:36,top:-4}}>↑ pins for 3× viewport, then releases</div>
      </section>

      <div className="wavy" style={{margin:"6px 36px"}}></div>

      {/* SCENE 03 — Timeline + About, MERGED (D's track + F's about) */}
      <section id="about" style={{padding:"24px 36px",position:"relative"}}>
        <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between"}}>
          <div>
            <div className="mono mute" style={{fontSize:11,letterSpacing:".18em"}}>SCENE 03 — ABOUT, BY WAY OF</div>
            <h2 className="serif" style={{fontSize:36,fontWeight:800,margin:"4px 0 0"}}>The long way around.</h2>
          </div>
          <span className="mono mute" style={{fontSize:11,letterSpacing:".18em"}}>09 STOPS</span>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1.5fr 1fr",gap:24,marginTop:18}}>
          {/* timeline (lifted from D) */}
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",left:96,top:8,bottom:8,width:0,borderLeft:"2.5px dashed var(--ink)"}}></div>
            {[
              ["NOW","just shipped a degree.","GBU · B.Tech CSE · looking for what’s next."],
              ["2026","Odoo Hackathon — Traveloop","Group build, weekend deadline, shipped."],
              ["2026","CodeFlow goes live","AI app builder · E2B sandboxes · 61 commits."],
              ["2025","wall-engine on Hyprland","First OSS project to land stars (3★ / 1 fork)."],
              ["2025","TaskForge ships","Real-time kanban · Liveblocks + Mongo."],
              ["2024","switched to Arch full-time","arch-install scripts · ricing era · broke X11 a lot."],
              ["2024","Web Developer Bootcamp","HTML → JS → React. Built the muscle memory."],
              ["2023","exploring options","Half-finished side projects, late-night tutorials."],
              ["2022","started at GBU","First lecture, first ‘wait, I love this’ moment."],
            ].map(([y,t,d],i)=>(
              <div key={i} style={{display:"grid",gridTemplateColumns:"86px 24px 1fr",gap:0,padding:"10px 0",position:"relative",alignItems:"start"}}>
                <div className="mono serif" style={{textAlign:"right",paddingRight:18}}>
                  <div className="serif" style={{fontSize:16,fontWeight:700,marginTop:2}}>{y}</div>
                </div>
                <div style={{display:"flex",justifyContent:"center"}}>
                  <div style={{width:12,height:12,borderRadius:"50%",border:"2px solid var(--ink)",background:i===0?"var(--accent)":"var(--paper)",marginTop:6,zIndex:1}}></div>
                </div>
                <div style={{paddingLeft:14}}>
                  <div className="serif" style={{fontSize:17,fontWeight:700,lineHeight:1.15}}>{t}</div>
                  <div className="mute" style={{fontSize:13,marginTop:2}}>{d}</div>
                </div>
              </div>
            ))}
          </div>

          {/* sidebar: skills + stack */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div className="box" style={{padding:14,background:"var(--paper-2)"}}>
              <div className="mono mute" style={{fontSize:11,letterSpacing:".14em"}}>STACK · DAILY</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                {["typescript","next.js","react","node","python","prisma","mongo","tailwind","inngest"].map(t=>(
                  <span key={t} className="pill mono" style={{fontSize:11}}>{t}</span>
                ))}
              </div>
            </div>
            <div className="box" style={{padding:14,background:"var(--paper-2)"}}>
              <div className="mono mute" style={{fontSize:11,letterSpacing:".14em"}}>STACK · POKING AT</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
                {["rust","duckdb","hyprland","glsl"].map(t=>(
                  <span key={t} className="pill mono" style={{fontSize:11,opacity:.85}}>{t}</span>
                ))}
              </div>
            </div>
            <div className="box-dash" style={{padding:14}}>
              <div className="mono mute" style={{fontSize:11,letterSpacing:".14em"}}>WHEN I’M NOT CODING</div>
              <div style={{fontSize:14,marginTop:6,lineHeight:1.4}}>Ricing my Arch setup. Reading sci-fi. Hunting good filter coffee.</div>
            </div>
            <div className="annot" style={{position:"relative",left:6,top:6}}>↑ ‘poking at’ updates often</div>
          </div>
        </div>
      </section>

      <div className="wavy" style={{margin:"6px 36px"}}></div>

      {/* SCENE 04 — coming soon, each links to a future route */}
      <section style={{padding:"22px 36px",position:"relative"}}>
        <div className="mono mute" style={{fontSize:11,letterSpacing:".18em"}}>SCENE 04 — ALSO ON THIS SITE</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:14,marginTop:10}}>
          {[
            ["experiments","tiny demos, shaders, half-finished ideas","/experiments"],
            ["writing","notes from building in public","/writing"],
            ["/now","what I’m doing this month","/now"],
            ["/dev/letters","one email a month, no spam","/letters"],
          ].map(([h,s,route])=>(
            <div key={h} className="box" style={{padding:14,position:"relative",background:"var(--paper-2)"}}>
              <span className="stamp" style={{position:"absolute",top:-12,right:10}}>future</span>
              <div className="serif" style={{fontSize:20,fontWeight:800}}>{h}</div>
              <div className="mute mono" style={{fontSize:11,marginTop:6}}>{s}</div>
              <div className="mono" style={{fontSize:10,marginTop:10,letterSpacing:".14em",color:"var(--accent-2)"}}>→ {route}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section style={{margin:"14px 36px 0",padding:"16px 18px",border:"1.6px solid var(--ink)",borderRadius:10,background:"var(--paper-2)",display:"grid",gridTemplateColumns:"1.4fr 1fr",gap:18,alignItems:"center"}}>
        <div>
          <div className="mono mute" style={{fontSize:11,letterSpacing:".18em",color:"var(--accent)"}}>END OF STORY · YOUR MOVE</div>
          <div className="serif" style={{fontSize:26,fontWeight:800,margin:"4px 0 2px"}}>Hiring? Building? Curious?</div>
          <div className="mute" style={{fontSize:14}}>Drop a line — I respond fast.</div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <span className="btn solid">hi@igneel.dev</span>
          <span className="btn">github · linkedin · x</span>
        </div>
      </section>

      <footer style={{padding:"14px 36px 18px",fontFamily:"IBM Plex Mono",fontSize:12,display:"flex",justifyContent:"space-between"}}>
        <span className="mute">$ exit 0 · built with too much GSAP &amp; coffee</span>
        <span className="mute">© Vaibhav Verma · 2026</span>
      </footer>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   G · /work index subpage — uses B's build log as the full project list
   ════════════════════════════════════════════════════════════════════ */
function WFWorkIndex(){
  const rows = [
    ["[ok ]","flagship","codeflow","An AI-powered website builder.","TS · Next 16 · tRPC · Inngest","2026","61"],
    ["[ok ]","collab","taskforge","Real-time kanban + AI task elaboration.","TS · Next · Liveblocks · Mongo","2025","21"],
    ["[ok ]","hackathon","traveloop","Trip planner — Odoo Hackathon, The Knights.","React · Firebase","2026","group"],
    ["[ok ]","oss","wall-engine","Dynamic wallpaper switcher for Hyprland.","Shell · SDDM","2025","3★ 1 fork"],
    ["[ok ]","dotfiles","arch-install","My Arch setup, scripted top-to-bottom.","Shell · Linux","2024","—"],
    ["[wip]","next","…","writing the README first.","tbd","2026","early"],
  ];
  return (
    <div className="wf" style={{background:"var(--paper)"}}>
      <div className="grid-bg"></div>
      <span className="stamp" style={{position:"absolute",top:14,right:14,zIndex:5}}>SUBPAGE · /work</span>

      <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 18px",borderBottom:"1.5px solid var(--ink)",background:"var(--paper-2)"}}>
        <span style={{width:10,height:10,border:"1.4px solid var(--ink)",borderRadius:"50%"}}></span>
        <span style={{width:10,height:10,border:"1.4px solid var(--ink)",borderRadius:"50%"}}></span>
        <span style={{width:10,height:10,border:"1.4px solid var(--ink)",borderRadius:"50%"}}></span>
        <div className="mono" style={{marginLeft:8,fontSize:12}}>vaibhav@noida:~/igneel.dev/work$</div>
        <div className="mono mute" style={{marginLeft:"auto",fontSize:12}}>ls -la projects/</div>
      </div>

      <section style={{padding:"24px 36px"}}>
        <div className="mono mute" style={{fontSize:11,letterSpacing:".18em"}}>↩ <span style={{color:"var(--accent-2)"}}>/</span> back home</div>
        <h1 className="serif" style={{fontSize:54,lineHeight:1,margin:"10px 0 6px",fontWeight:800}}>All projects.</h1>
        <p className="mute" style={{fontSize:16,maxWidth:560}}>Everything I’ve shipped, in build-log form. Sort by recency, filter by tag, click a row to expand.</p>

        {/* filter bar */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:14,alignItems:"center"}}>
          <span className="mono mute" style={{fontSize:11,letterSpacing:".14em",marginRight:4}}>FILTER —</span>
          {["all","flagship","oss","hackathon","collab","dotfiles","wip"].map((t,i)=>(
            <span key={t} className="pill mono" style={{fontSize:11,background: i===0?"var(--ink)":"var(--paper-2)",color: i===0?"var(--paper)":"var(--ink)"}}>{t}</span>
          ))}
          <span className="mono mute" style={{fontSize:11,marginLeft:"auto",letterSpacing:".14em"}}>sort: ↓ recency</span>
        </div>
      </section>

      <section style={{padding:"0 36px 18px"}}>
        <div className="box" style={{padding:"14px 18px",background:"var(--paper-2)"}}>
          {/* table header */}
          <div className="mono mute" style={{display:"grid",gridTemplateColumns:"60px 100px 130px 1fr 1.1fr 70px 110px",gap:14,fontSize:10,letterSpacing:".14em",padding:"4px 0 8px",borderBottom:"1px dashed var(--ink)"}}>
            <span>STATUS</span><span>TAG</span><span>NAME</span><span>BLURB</span><span>STACK</span><span>YEAR</span><span style={{textAlign:"right"}}>NOTES</span>
          </div>
          {rows.map((r,i)=>(
            <div key={i} className="mono" style={{display:"grid",gridTemplateColumns:"60px 100px 130px 1fr 1.1fr 70px 110px",gap:14,fontSize:13,padding:"10px 0",borderBottom:i<rows.length-1?"1px dashed rgba(127,127,127,.35)":"none",alignItems:"center"}}>
              <span style={{color:r[0]==="[ok ]"?"#3a7d3a":r[0]==="[wip]"?"#b06b00":"var(--accent)"}}>{r[0]}</span>
              <span className="mute">{r[1]}</span>
              <span style={{fontWeight:700}}>{r[2]}</span>
              <span className="mute">{r[3]}</span>
              <span className="mute" style={{fontSize:11}}>{r[4]}</span>
              <span className="mute" style={{fontSize:11}}>{r[5]}</span>
              <span className="mute" style={{textAlign:"right",fontSize:11}}>{r[6]}</span>
            </div>
          ))}
        </div>
        <div className="annot" style={{right:36,top:8,transform:"rotate(2deg)"}}>↑ click a row → /work/[slug]</div>
      </section>

      <section style={{padding:"6px 36px 22px"}}>
        <div className="mono mute" style={{fontSize:12}}>$ git log --oneline | head -3</div>
        <div className="mono mute" style={{fontSize:12,marginTop:6,paddingLeft:14}}>a3f01b2 · docs(traveloop): wrote case study draft</div>
        <div className="mono mute" style={{fontSize:12,paddingLeft:14}}>7c01d8a · feat(codeflow): add gemini provider</div>
        <div className="mono mute" style={{fontSize:12,paddingLeft:14}}>1e7f9d4 · chore(arch-install): split out wm setup</div>
        <div className="mono mute" style={{fontSize:11,marginTop:12,letterSpacing:".14em"}}>→ FULL LOG ON GITHUB.COM/IGNEEL0601</div>
      </section>

      <footer style={{padding:"14px 36px",borderTop:"1.5px dashed var(--ink)",fontFamily:"IBM Plex Mono",fontSize:12,display:"flex",justifyContent:"space-between"}}>
        <span className="mute">$ cd ..</span>
        <span className="mute">© Vaibhav Verma · 2026</span>
      </footer>
    </div>
  );
}

Object.assign(window, { WFHybridPlus, WFWorkIndex });

