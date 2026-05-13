import { TerminalBar } from "@/components/scenes/TerminalBar";
import { SceneBoot } from "@/components/scenes/SceneBoot";
import { ScenePinnedWork } from "@/components/scenes/ScenePinnedWork";
import { SceneAbout } from "@/components/scenes/SceneAbout";
import { SceneFuture } from "@/components/scenes/SceneFuture";
import { SceneCTA } from "@/components/scenes/SceneCTA";

export default function Home() {
  return (
    <main className="flex-1">
      <TerminalBar />
      <SceneBoot />
      <Divider />
      <ScenePinnedWork />
      <Divider />
      <SceneAbout />
      <Divider />
      <SceneFuture />
      <SceneCTA />
      <footer className="px-6 md:px-10 py-5 mono text-xs flex justify-between mute">
        <span>$ exit 0 · built with too much GSAP &amp; coffee</span>
        <span>© Vaibhav Verma · 2026</span>
      </footer>
    </main>
  );
}

function Divider() {
  return <div className="wavy mx-6 md:mx-10 my-2" aria-hidden />;
}
