import { WorkLog } from "@/components/work/WorkLog";
import { listWorkRows } from "@/lib/work-rows";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("work");

export default async function WorkPage() {
  const rows = await listWorkRows();
  return (
    <main className="flex-1 pb-12 page-shell">
      <WorkLog rows={rows} />
    </main>
  );
}
