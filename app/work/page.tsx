import { WorkLog } from "@/components/work/WorkLog";

export const metadata = {
  title: "All projects — Vaibhav Verma",
  description: "Full build log of every project I've shipped.",
};

export default function WorkPage() {
  return (
    <main className="flex-1 pb-12">
      <WorkLog />
    </main>
  );
}
