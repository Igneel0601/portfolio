import { TocHighlight } from "./TocHighlight";

export type TocItem = { n: string; title: string; id: string };

export function Toc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;
  return (
    <aside className="cs-toc c-md" aria-label="table of contents">
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
      <TocHighlight ids={items.map((i) => i.id)} />
    </aside>
  );
}
