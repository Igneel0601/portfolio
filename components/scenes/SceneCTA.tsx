import { CONTACT } from "@/lib/content";
import { MagneticButton } from "@/components/MagneticButton";

export function SceneCTA() {
  return (
    <section id="contact" className="mx-6 md:mx-10 mt-6 mb-2 p-5 md:p-7 box grid gap-6 md:grid-cols-[1.4fr_1fr] items-center"
             style={{ background: "var(--paper-2)" }}>
      <div>
        <div className="mono text-[11px] tracking-[0.18em]" style={{ color: "var(--accent)" }}>
          END OF STORY · YOUR MOVE
        </div>
        <div className="serif text-2xl md:text-3xl font-extrabold mt-1.5 mb-1">
          Hiring? Building? Curious?
        </div>
        <div className="mute text-sm md:text-base">Drop a line — I respond fast.</div>
      </div>
      <div className="flex flex-col gap-2">
        <MagneticButton href={`mailto:${CONTACT.email}`} className="btn solid justify-center">
          {CONTACT.email}
        </MagneticButton>
        <div className="flex gap-2">
          <a href={CONTACT.github} target="_blank" rel="noreferrer" className="btn flex-1 justify-center">github</a>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="btn flex-1 justify-center">linkedin</a>
          <a href={CONTACT.x} target="_blank" rel="noreferrer" className="btn flex-1 justify-center">x</a>
        </div>
      </div>
    </section>
  );
}
