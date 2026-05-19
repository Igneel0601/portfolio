export function Breadcrumb({ slug, words }: { slug: string; words?: number }) {
  return (
    <div className="cs-term-bar">
      <span className="cs-mac-dot cs-mac-r" />
      <span className="cs-mac-dot cs-mac-y" />
      <span className="cs-mac-dot cs-mac-g" />
      <span className="cs-prompt">$ cat case-study/{slug}.md</span>
      {typeof words === "number" && (
        <span className="cs-term-right">
          {words.toLocaleString()} words · {Math.max(1, Math.round(words / 220))} min read
        </span>
      )}
    </div>
  );
}
