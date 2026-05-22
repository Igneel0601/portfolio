import { WorkLog } from "@/components/work/WorkLog";
import { MobileWorkLog } from "@/components/mobile/MobileWorkLog";
import { listWorkRows } from "@/lib/work-rows";

export const metadata = {
  title: "All projects — Vaibhav Verma",
  description: "Full build log of every project I've shipped.",
};

export default async function WorkPage() {
  const rows = await listWorkRows();
  return (
    <main className="flex-1 pb-12">
      <div className="hidden md:block">
        <WorkLog rows={rows} />
      </div>
      <MobileWorkLog rows={rows} />
    </main>
  );
}
