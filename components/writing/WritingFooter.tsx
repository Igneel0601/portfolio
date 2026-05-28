export function WritingFooter({ slug }: { slug: string }) {
  return (
    <div className="cs-footer-wrap">
      <footer className="cs-footer c-xs">
        <span>$ exit 0 · end of file</span>
        <span className="cs-footer-middle">{slug}.md · /writing</span>
        <span className="cs-footer-right">© Vaibhav Verma · 2026</span>
      </footer>
    </div>
  )
}
