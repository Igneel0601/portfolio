import { ProjectsShowcaseCinematic } from "@/components/experiments/ProjectsShowcaseCinematic";

export const metadata = {
  title: "Projects showcase — cinematic — Experiments — Vaibhav Verma",
  description:
    "Wireframe port: sticky stage, clip-path panel wipes, atmospheric right-zone background, seam-bar rise, and title-settle into a terminal top bar.",
};

export default function ProjectsShowcaseCinematicExperiment() {
  return (
    <main className="flex-1">
      <ProjectsShowcaseCinematic />
    </main>
  );
}
