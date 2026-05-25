"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { PROJECTS } from "@/lib/content";

/**
 * Mobile-only stacked card list. Shipped instead of the scrollytelling
 * ExperimentsClient on phones — the desktop version uses pinned scroll,
 * clip-path wipes, ResizeObserver height-sync, and a 22vw shrinking title,
 * none of which works on touch. Same data, vertical layout, zero animation.
 */
export function SceneExperimentsStatic() {
  return (
    <section
      data-scene="experiments-mobile"
      id="work"
      className="relative w-full px-6 py-12"
      style={{ background: "var(--paper)" }}
    >
      <div className="max-w-xl mx-auto">
        <div className="l-eyebrow mb-2" style={{ color: "var(--ink-dim)" }}>
          $ ls ~/projects
        </div>
        <h2 className="t-h1" style={{ marginBottom: "1.5rem" }}>
          projects<span style={{ color: "var(--accent)" }}>.</span>
        </h2>

        <ul className="flex flex-col gap-6 list-none p-0 m-0">
          {PROJECTS.map((p) => (
            <li
              key={p.id}
              className="box p-4"
              style={{
                background: "var(--paper-2)",
                borderRadius: "0.625rem",
                border: "1px solid var(--hair)",
              }}
            >
              <div className="flex items-baseline gap-2 mb-1.5">
                <span
                  className="l-meta"
                  style={{ color: "var(--ink-dim)" }}
                >
                  {p.index}
                </span>
                <Link
                  href={`/work/${p.id}`}
                  className="t-h3 no-pop"
                  style={{ color: "var(--ink)" }}
                >
                  {p.name}
                </Link>
                <span
                  className="l-meta"
                  style={{ color: "var(--accent)", marginLeft: "auto" }}
                >
                  {p.kind}
                </span>
              </div>

              {p.image && (
                <div
                  className="relative w-full overflow-hidden"
                  style={{
                    aspectRatio: "16 / 10",
                    borderRadius: "0.5rem",
                    background: "var(--paper-3)",
                    marginBottom: "0.875rem",
                  }}
                >
                  <Image
                    src={p.image}
                    alt={`${p.name} preview`}
                    fill
                    sizes="(max-width: 768px) 100vw, 600px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              )}

              <p
                className="t-body"
                style={{ color: "var(--ink-soft)", marginBottom: "0.875rem" }}
              >
                {p.blurb}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-3">
                {p.stack.map((s) => (
                  <span
                    key={s}
                    className="l-tag"
                    style={{
                      padding: "0.125rem 0.5rem",
                      border: "1px solid var(--hair)",
                      borderRadius: "0.25rem",
                      color: "var(--ink-soft)",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between c-sm">
                <span style={{ color: "var(--ink-dim)" }}>
                  {p.meta}
                </span>
                {p.url && (
                  <a
                    href={`https://${p.url}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 no-pop"
                    style={{ color: "var(--accent)" }}
                  >
                    open <ExternalLink className="i-xs i-bold" />
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
