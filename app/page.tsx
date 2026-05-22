import { SceneBoot } from "@/components/scenes/SceneBoot";
import { SceneExperiments } from "@/components/scenes/SceneExperiments";
import { SceneTimeline } from "@/components/scenes/SceneTimeline";
import { SceneCTA } from "@/components/scenes/SceneCTA";
import { MobileHome } from "@/components/mobile/MobileHome";
import { getDevice } from "@/lib/device";

export default async function Home() {
  if ((await getDevice()) === "mobile") {
    return (
      <main className="flex-1">
        <MobileHome />
      </main>
    );
  }
  return (
    <main className="flex-1">
      <SceneBoot />
      <SceneExperiments />
      <SceneTimeline />
      <SceneCTA />
    </main>
  );
}
