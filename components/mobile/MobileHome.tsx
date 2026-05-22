import { PROJECTS, TIMELINE } from "@/lib/content";
import {
  BootBlock,
  CTASection,
  HeroSection,
  ProjectCard,
  SectionHeader,
  SiteFooter,
  TimelineSection,
} from "./parts";

export function MobileHome() {
  return (
    <div className="md:hidden" style={{ background: "var(--paper)" }}>
      <div style={{ height: "100dvh", position: "relative" }}>
        <div style={{ position: "sticky", top: 0 }}>
          <BootBlock />
          <HeroSection />
        </div>
      </div>
      <SectionHeader eyebrow="$ ls ~/projects" title="three things I shipped." />
      {PROJECTS.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
      <TimelineSection stops={TIMELINE} />
      <CTASection />
      <SiteFooter />
    </div>
  );
}
