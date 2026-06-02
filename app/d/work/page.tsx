import { WorkLog } from "@/components/work/WorkLog";
import { listWorkRows } from "@/lib/work-rows";

export const metadata = {
  title: "All projects — Vaibhav Verma",
  description: "Full build log of every project I've shipped.",
  alternates: { canonical: "/work" },
};

export default async function WorkPage() {
  const rows = await listWorkRows();
  return (
    <main className="flex-1 pb-12 page-shell">
      <WorkLog rows={rows} />
    </main>
  );
}
