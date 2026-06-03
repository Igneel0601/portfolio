import { getPosts, getCategoryCounts } from "@/lib/posts";
import { MobileWriting } from "@/components/mobile/MobileWriting";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata = pageMetadata("writing");

const PER_PAGE = 10;

export default async function WritingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>;
}) {
  const sp = await searchParams;
  const tag = sp.tag ?? null;
  const requested = Number.parseInt(sp.page ?? "1", 10);
  const [{ posts, total, page, totalPages }, counts] = await Promise.all([
    getPosts({ page: Number.isFinite(requested) ? requested : 1, perPage: PER_PAGE, tag }),
    getCategoryCounts(),
  ]);
  return (
    <main className="flex-1">
      <MobileWriting
        posts={posts}
        counts={counts}
        total={total}
        tag={tag}
        page={page}
        totalPages={totalPages}
      />
    </main>
  );
}
