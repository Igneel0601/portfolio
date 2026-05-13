export function TerminalBar() {
  return (
    <div className="flex items-center gap-2 px-5 py-3 border-b border-ink/80 bg-paper-2 sticky top-0 z-30 backdrop-blur"
         style={{ background: "var(--paper-2)", borderColor: "var(--ink)" }}>
      <span className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: "var(--ink)" }} />
      <span className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: "var(--ink)" }} />
      <span className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: "var(--ink)" }} />
      <span className="mono ml-2 text-xs">vaibhav@noida:~/portfolio$</span>
      <span className="mono mute ml-auto text-xs hidden sm:inline">
        scroll = run the story
      </span>
    </div>
  );
}
