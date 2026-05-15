import { SceneBoot } from "@/components/scenes/SceneBoot";
import { ScenePinnedWork } from "@/components/scenes/ScenePinnedWork";
import { SceneTimeline } from "@/components/scenes/SceneTimeline";
import { SceneCTA } from "@/components/scenes/SceneCTA";

export default function Home() {
  return (
    <main className="flex-1">
      <SceneBoot />
      <ScenePinnedWork />
      <SceneTimeline />
      <SceneCTA />
    </main>
  );
}
