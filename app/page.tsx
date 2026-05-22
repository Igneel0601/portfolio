import { SceneBoot } from "@/components/scenes/SceneBoot";
import { SceneExperiments } from "@/components/scenes/SceneExperiments";
import { SceneTimeline } from "@/components/scenes/SceneTimeline";
import { SceneCTA } from "@/components/scenes/SceneCTA";
import { MobileHome } from "@/components/mobile/MobileHome";

export default function Home() {
  return (
    <main className="flex-1">
      <div className="hidden md:block">
        <SceneBoot />
        <SceneExperiments />
        <SceneTimeline />
        <SceneCTA />
      </div>
      <MobileHome />
    </main>
  );
}
