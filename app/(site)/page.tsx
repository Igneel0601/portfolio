import { SceneBoot } from "@/components/scenes/SceneBoot";
import { SceneExperiments } from "@/components/scenes/SceneExperiments";
import { SceneTimeline } from "@/components/scenes/SceneTimeline";
import { SceneCTA } from "@/components/scenes/SceneCTA";
import { MobileHome } from "@/components/mobile/MobileHome";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { personJsonLd } from "@/lib/seo/jsonld";

export const metadata = pageMetadata("home");

export default function Home() {
  return (
    <>
      <JsonLd data={personJsonLd()} />
      {/* Desktop: scroll-snap scene deck. Mobile: editorial scroll page.
          Toggle at <main> level so each variant's subtree is byte-identical to
          the old shells (scenes stay direct children of their snap container). */}
      <main className="flex-1 hidden md:block">
        <SceneBoot />
        <SceneExperiments />
        <SceneTimeline />
        <SceneCTA />
      </main>
      <main className="flex-1 md:hidden">
        <MobileHome />
      </main>
    </>
  );
}
