import { MobileTimeline } from "./MobileTimeline";
import { CTASection } from "./parts";
import { MobileProjects } from "./MobileProjects";
import { MobileBoot } from "./MobileBoot";

export function MobileHome() {
  return (
    <>
      <MobileBoot />
      <MobileProjects />
      <MobileTimeline />
      <CTASection />
    </>
  );
}
