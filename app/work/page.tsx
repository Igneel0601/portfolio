import { WorkLog } from "@/components/work/WorkLog";
import { MobileWorkLog } from "@/components/mobile/MobileWorkLog";
import { listWorkRows } from "@/lib/work-rows";
import { getDevice } from "@/lib/device";

export const metadata = {
  title: "All projects — Vaibhav Verma",
  description: "Full build log of every project I've shipped.",
};

export default async function WorkPage() {
  const [rows, device] = await Promise.all([listWorkRows(), getDevice()]);
  if (device === "mobile") {
    return (
      <main className="flex-1 pb-12">
        <MobileWorkLog rows={rows} />
      </main>
    );
  }
  return (
    <main className="flex-1 pb-12">
      <WorkLog rows={rows} />
    </main>
  );
}
