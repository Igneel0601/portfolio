import { MobileTimeline } from "./MobileTimeline";
import { BootBlock, CTASection, HeroSection } from "./parts";
import { MobileProjects } from "./MobileProjects";

export function MobileHome() {
  return (
    <>
      <div style={{ height: "120svh", position: "relative" }}>
        <div style={{ position: "sticky", top: 0 }}>
          <BootBlock />
          <HeroSection />
        </div>
      </div>
      <MobileProjects />
      <MobileTimeline />
      <CTASection />
    </>
  );
}
