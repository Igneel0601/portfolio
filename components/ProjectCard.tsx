import type { Project } from "@/lib/content";
import { ProjectImage } from "./ProjectImage";

export function ProjectCardLarge({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <article className="box-wob p-4" style={{ background: "var(--paper-2)", boxShadow: "5px 5px 0 var(--ink)" }}>
      <ProjectImage src={project.image} alt={project.name} priority={priority} />
      <div className="mono mt-3 text-[11px] tracking-[0.14em]" style={{ color: "var(--accent)" }}>
        NOW SHOWING · {project.index}/03
      </div>
      <h3 className="serif text-3xl font-extrabold mt-1">{project.name}</h3>
      <p className="mute text-[15px] mt-1.5">{project.blurb}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {project.stack.map((t) => (
          <span key={t} className="pill text-[11px] px-2 py-0.5">{t}</span>
        ))}
      </div>
      <a
        href={`/work/${project.id}`}
        className="mono text-[11px] mt-3 inline-block tracking-[0.14em]"
        style={{ color: "var(--accent-2)" }}
      >
        READ THE CASE STUDY → /work/{project.id}
      </a>
    </article>
  );
}

export function ProjectCardSide({ project, sideIndex }: { project: Project; sideIndex: number }) {
  return (
    <article
      data-side={sideIndex}
      className="box p-3"
      style={{ background: "var(--paper-2)" }}
    >
      <div className="grid gap-3 items-center" style={{ gridTemplateColumns: "120px 1fr" }}>
        <ProjectImage src={project.image} alt={project.name} sizes="120px" />
        <div>
          <div className="mono mute text-[10px] tracking-[0.12em]">
            {project.index} · {project.kind}
          </div>
          <div className="serif text-lg font-bold">{project.name}</div>
          <div className="mute text-[13px] leading-snug">{project.blurb}</div>
        </div>
      </div>
    </article>
  );
}
