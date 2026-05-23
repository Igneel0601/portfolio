import { TocHighlight } from "./TocHighlight";

export type TocItem = { n: string; title: string; id: string };

export function Toc({
  items,
  variant = "sidebar",
}: {
  items: TocItem[];
  /** "sidebar" mounts the scroll highlighter; "inline" skips it so
   *  rendering two TOCs (mobile inline + desktop sidebar) doesn't double-
   *  observe scroll. Inline copy still gets highlighted because
   *  TocHighlight uses querySelectorAll across both copies. */
  variant?: "sidebar" | "inline";
}) {
  if (items.length === 0) return null;
  return (
    <aside
      className={`cs-toc cs-toc-${variant} c-md`}
      aria-label="table of contents"
    >
      <details className="cs-toc-details">
        <summary className="cs-toc-summary l-eyebrow"># contents</summary>
        <div className="cs-toc-lbl l-eyebrow"># contents</div>
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            data-toc-link={item.id}
            className="no-pop c-md"
          >
            <span className="cs-toc-n c-sm">{item.n}</span>
            <span>{item.title}</span>
          </a>
        ))}
      </details>
      {variant === "sidebar" && <TocHighlight ids={items.map((i) => i.id)} />}
    </aside>
  );
}
