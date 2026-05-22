import { SceneBoot } from "@/components/scenes/SceneBoot";
import { SceneExperiments } from "@/components/scenes/SceneExperiments";
import { SceneTimeline } from "@/components/scenes/SceneTimeline";
import { SceneCTA } from "@/components/scenes/SceneCTA";

export default function Home() {
  return (
    <main className="flex-1">
      <SceneBoot />
      <SceneExperiments />
      <SceneTimeline />
      <SceneCTA />
    </main>
  );
}
