import Image from "next/image";
import type { Project } from "@/lib/content";

export function ProjectCardLarge({ project }: { project: Project }) {
  return (
    <article
      className="box-wob p-4"
      style={{ background: "var(--paper-2)", boxShadow: "5px 5px 0 var(--ink)" }}
    >
      <div className="relative w-full overflow-hidden box" style={{ aspectRatio: "16 / 9" }}>
        <Image
          src={project.image}
          alt={project.name}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div className="mono mt-3 text-[11px] tracking-[0.14em]" style={{ color: "var(--accent)" }}>
        NOW SHOWING · {project.index} / 03 · {project.kind}
      </div>
      <h3 className="serif text-3xl font-extrabold mt-1">{project.name}</h3>
      <p className="mute text-[15px] mt-1.5">{project.blurb}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {project.stack.map((t) => (
          <span key={t} className="pill text-[11px] px-2 py-0.5">{t}</span>
        ))}
      </div>
      <div className="mono text-[11px] mt-3 tracking-[0.12em]">
        {project.url && (
          <>
            <span style={{ color: "var(--accent)" }}>›</span>{" "}
            <a href={`https://${project.url}`} target="_blank" rel="noreferrer" className="underline">
              {project.url}
            </a>{" "}
            ·{" "}
          </>
        )}
        <span className="mute">{project.meta}</span>
      </div>
    </article>
  );
}

export function ProjectCardSide({ project, dim = false }: { project: Project; dim?: boolean }) {
  return (
    <article
      className="box p-3"
      style={{ background: "var(--paper-2)", opacity: dim ? 0.78 : 0.95 }}
    >
      <div className="grid gap-3" style={{ gridTemplateColumns: "100px 1fr" }}>
        <div className="relative w-full box overflow-hidden" style={{ aspectRatio: "16 / 10" }}>
          <Image
            src={project.image}
            alt={project.name}
            fill
            sizes="120px"
            className="object-cover"
          />
        </div>
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
