import { TocHighlight } from "./TocHighlight";

export type TocItem = { n: string; title: string; id: string };

export function Toc({
  items,
  variant = "sidebar",
}: {
  items: TocItem[];
  /** "sidebar" — desktop right column, always expanded, mounts the scroll
   *  highlighter (uses a plain div so it can't get UA-collapsed).
   *  "inline" — mobile copy inside <article>, uses <details> so it
   *  collapses to a "# contents" bar.
   *  TocHighlight uses querySelectorAll so it updates both copies. */
  variant?: "sidebar" | "inline";
}) {
  if (items.length === 0) return null;

  const links = (
    <>
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
    </>
  );

  return (
    <aside
      className={`cs-toc cs-toc-${variant} c-md`}
      aria-label="table of contents"
    >
      {variant === "inline" ? (
        <details className="cs-toc-details">
          <summary className="cs-toc-summary l-eyebrow"># contents</summary>
          {links}
        </details>
      ) : (
        links
      )}
      {variant === "sidebar" && <TocHighlight ids={items.map((i) => i.id)} />}
    </aside>
  );
}
