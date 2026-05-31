import { MobileTimeline } from "./MobileTimeline";
import { CTASection } from "./parts";
import { MobileProjects } from "./MobileProjects";
import { MobileBoot } from "./MobileBoot";

export function MobileHome() {
  return (
    <>
      <div style={{ height: "120svh", position: "relative" }}>
        <MobileBoot />
      </div>
      <MobileProjects />
      <MobileTimeline />
      <CTASection />
    </>
  );
}
