import { PROFILE } from "@/lib/profile"

export function WritingFooter({ slug }: { slug: string }) {
  return (
    <div className="cs-footer-wrap">
      <footer className="cs-footer c-xs">
        <span>$ exit 0 · end of file</span>
        <span className="cs-footer-middle">{slug}.md · /writing</span>
        <span className="cs-footer-right">© {PROFILE.name} · 2026</span>
      </footer>
    </div>
  )
}
