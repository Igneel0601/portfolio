import { PROJECTS } from "@/lib/content";
import { MobileTimeline } from "./MobileTimeline";
import {
  BootBlock,
  CTASection,
  HeroSection,
  ProjectCard,
  SectionHeader,
} from "./parts";

export function MobileHome() {
  return (
    <>
      <div style={{ height: "120svh", position: "relative" }}>
        <div style={{ position: "sticky", top: 0 }}>
          <BootBlock />
          <HeroSection />
        </div>
      </div>
      <SectionHeader eyebrow="$ ls ~/projects" title="three things I shipped." />
      {PROJECTS.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
      <MobileTimeline />
      <CTASection />
    </>
  );
}
