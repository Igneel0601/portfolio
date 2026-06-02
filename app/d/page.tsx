import { SceneBoot } from "@/components/scenes/SceneBoot";
import { SceneExperiments } from "@/components/scenes/SceneExperiments";
import { SceneTimeline } from "@/components/scenes/SceneTimeline";
import { SceneCTA } from "@/components/scenes/SceneCTA";
import { PersonJsonLd } from "@/components/PersonJsonLd";

export const metadata = {
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
};

export default function Home() {
  return (
    <main className="flex-1">
      <PersonJsonLd />
      <SceneBoot />
      <SceneExperiments />
      <SceneTimeline />
      <SceneCTA />
    </main>
  );
}
