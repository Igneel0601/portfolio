import { SceneBoot } from "@/components/scenes/SceneBoot";
import { SceneExperiments } from "@/components/scenes/SceneExperiments";
import { SceneTimeline } from "@/components/scenes/SceneTimeline";
import { SceneCTA } from "@/components/scenes/SceneCTA";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { personJsonLd } from "@/lib/seo/jsonld";

export const metadata = pageMetadata("home");

export default function Home() {
  return (
    <main className="flex-1">
      <JsonLd data={personJsonLd()} />
      <SceneBoot />
      <SceneExperiments />
      <SceneTimeline />
      <SceneCTA />
    </main>
  );
}
