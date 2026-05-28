/* app.jsx — orchestrator */

function App(){
  const [activeId, setActiveId] = React.useState("hero");

  React.useEffect(() => {
    const ids = ["hero", "work", "about"];
    const onScroll = () => {
      const y = window.scrollY + window.innerHeight * 0.3;
      let current = "hero";
      for (const id of ids){
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= y) current = id;
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive:true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { Nav, Hero, Work, About, Future, CTAFooter } = window;

  return (
    <>
      <Nav activeId={activeId} />
      <Hero />
      <div className="scene-rule"></div>
      <Work />
      <div className="scene-rule"></div>
      <About />
      <div className="scene-rule"></div>
      <Future />
      <CTAFooter />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
