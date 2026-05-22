import { SceneExperimentsStatic } from "@/components/experiments/SceneExperimentsStatic";

export const metadata = {
  title: "Experiments — Vaibhav Verma",
  description: "Sandbox for testing new ways to show work.",
};

export default function ExperimentsPage() {
  return (
    <main className="flex-1">
      <SceneExperimentsStatic />
    </main>
  );
}
