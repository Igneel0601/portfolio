export function TerminalBar() {
  return (
    <div
      data-tabbar
      className="flex items-center gap-2 px-5 py-3 border-b"
      style={{ background: "var(--paper-2)", borderColor: "var(--ink)" }}
    >
      <span className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: "var(--ink)" }} />
      <span className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: "var(--ink)" }} />
      <span className="w-2.5 h-2.5 rounded-full border" style={{ borderColor: "var(--ink)" }} />
      <span className="c-sm ml-2">vaibhav@noida:~/igneel.dev$</span>
      <span className="c-sm mute ml-auto hidden sm:inline">
        scroll = run the story
      </span>
    </div>
  );
}
