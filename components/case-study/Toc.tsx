import { TocHighlight } from "./TocHighlight";

export type TocItem = { n: string; title: string; id: string };

export function Toc({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;
  return (
    <aside className="cs-toc" aria-label="table of contents">
      <div className="cs-toc-lbl"># contents</div>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          data-toc-link={item.id}
          className="no-pop"
        >
          <span className="cs-toc-n">{item.n}</span>
          <span>{item.title}</span>
        </a>
      ))}
      <TocHighlight ids={items.map((i) => i.id)} />
    </aside>
  );
}
