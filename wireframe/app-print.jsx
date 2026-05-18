// app-print.jsx — flat, paginated layout for PDF export

const ARTBOARDS_PRINT = [
  { id: "hybridplus", label: "★ F+ · Homepage (merged)", Comp: window.WFHybridPlus, w: 980, h: 2640 },
  { id: "workindex",  label: "/work · all projects",      Comp: window.WFWorkIndex,  w: 980, h: 1280 },
];

function PrintApp(){
  React.useEffect(() => {
    // apply dark cool default theme (matches user's last setting)
    document.body.dataset.theme = "dark";
    const r = document.documentElement.style;
    r.setProperty("--paper",     "#0e1116");
    r.setProperty("--paper-2",   "#161b22");
    r.setProperty("--ink",       "#e6edf3");
    r.setProperty("--accent",    "#6ee7a7");
    r.setProperty("--accent-2",  "#7fb3ff");
    r.setProperty("--ink-soft",  "#8b949e");
    r.setProperty("--highlight", "rgba(110,231,167,.22)");
  }, []);

  return (
    <div className="print-root">
      {ARTBOARDS_PRINT.map((a, i) => (
        <section key={a.id} className="print-page" style={{breakAfter: i < ARTBOARDS_PRINT.length - 1 ? "page" : "auto"}}>
          <header className="print-head">
            <span className="l-eyebrow mute">PORTFOLIO WIREFRAMES · {String(i+1).padStart(2,"0")} / {String(ARTBOARDS_PRINT.length).padStart(2,"0")}</span>
            <span className="l-eyebrow mute">{a.label}</span>
          </header>
          <div className="print-frame" style={{width: a.w, height: a.h}}>
            <a.Comp />
          </div>
        </section>
      ))}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("canvas-root")).render(<PrintApp />);
