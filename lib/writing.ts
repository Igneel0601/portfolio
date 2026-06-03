/** Build a /writing index URL for a tag + page. Page is omitted when 1 so the
 *  canonical page-one URL stays clean (/writing, /writing?tag=x). */
export function writingHref(tag: string | null, page: number): string {
  const sp = new URLSearchParams();
  if (tag) sp.set("tag", tag);
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `/writing?${qs}` : "/writing";
}
