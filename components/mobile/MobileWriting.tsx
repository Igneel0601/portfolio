import type { PostListItem } from "@/lib/posts";
import { DashedRule, PageHeader, WritingRow } from "./parts";

function fmtDate(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const month = d.toLocaleString("en-US", { month: "short" }).toLowerCase();
  const year = String(d.getFullYear()).slice(-2);
  return `${month} '${year}`;
}

export function MobileWriting({ posts }: { posts: PostListItem[] }) {
  return (
    <div className="md:hidden" style={{ background: "var(--paper)" }}>
      <PageHeader eyebrow="$ ls ~/writing" title="writing" />
      <DashedRule />
      {posts.map((p) => {
        const kind = p.categories[0]?.title ?? "post";
        return (
          <WritingRow
            key={p.slug}
            date={fmtDate(p.publishedAt ?? p.updatedAt)}
            title={p.title}
            meta={`${kind} · ${p.readMinutes} min`}
            href={`/writing/${p.slug}`}
          />
        );
      })}
    </div>
  );
}
