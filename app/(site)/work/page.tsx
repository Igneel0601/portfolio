import { WorkLog } from "@/components/work/WorkLog";
import { MobileWorkLog } from "@/components/mobile/MobileWorkLog";
import { listWorkRows } from "@/lib/work-rows";
import { getRecentCommits, getLatestCommitDate } from "@/lib/github";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("work");

export default async function WorkPage() {
  const [rows, commits, lastCommit] = await Promise.all([
    listWorkRows(),
    getRecentCommits(),
    getLatestCommitDate(),
  ]);
  return (
    <>
      <main className="flex-1 pb-12 page-shell hidden md:block">
        <WorkLog rows={rows} commits={commits} lastCommit={lastCommit ?? undefined} />
      </main>
      <main className="flex-1 pb-12 md:hidden">
        <MobileWorkLog rows={rows} commits={commits} lastCommit={lastCommit ?? undefined} />
      </main>
    </>
  );
}
