import { MobileWorkLog } from "@/components/mobile/MobileWorkLog";
import { listWorkRows } from "@/lib/work-rows";
import { getRecentCommits } from "@/lib/github";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("work");

export default async function WorkPage() {
  const [rows, commits] = await Promise.all([
    listWorkRows(),
    getRecentCommits(),
  ]);
  return (
    <main className="flex-1 pb-12">
      <MobileWorkLog rows={rows} commits={commits} />
    </main>
  );
}
