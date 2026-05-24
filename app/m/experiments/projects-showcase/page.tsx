import { SceneExperimentsStatic } from "@/components/experiments/SceneExperimentsStatic";

export const metadata = {
  title: "Projects showcase — Experiments — Vaibhav Verma",
  description: "Scrollytelling project cards with clip-path wipes and a sticky stage.",
};

export default function ProjectsShowcaseExperiment() {
  return (
    <main className="flex-1">
      <SceneExperimentsStatic />
    </main>
  );
}
