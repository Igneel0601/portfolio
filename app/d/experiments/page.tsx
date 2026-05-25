import Link from "next/link";
import { EXPERIMENTS } from "@/lib/experiments";

export const metadata = {
  title: "Experiments — Vaibhav Verma",
  description: "Lab notebook. Fuckups and discoveries.",
};

export default function ExperimentsPage() {
  return (
    <main className="flex-1 page-shell" style={{ paddingTop: "clamp(1.25rem, 2.5vw, 1.75rem)" }}>
      <div className="l-eyebrow" style={{ color: "var(--ink-dim)" }}>
        lab · {new Date().getFullYear()}
      </div>

      <h1 className="t-display" style={{ marginTop: "0.75rem" }}>
        experiments
        <span style={{ color: "var(--accent)" }}>.</span>
      </h1>

      <p
        className="t-lead"
        style={{
          marginTop: "1rem",
          color: "var(--ink-soft)",
          fontStyle: "italic",
          maxWidth: "42ch",
        }}
      >
        Personal notebook — fuckups and discoveries from the messy middle.
      </p>

      <ul
        className="grid gap-5 mt-10 list-none p-0"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(20rem, 100%), 1fr))" }}
      >
        {EXPERIMENTS.map((e) => (
          <li key={e.slug}>
            <Link
              href={e.href ?? `/experiments/${e.slug}`}
              className="box p-5 flex flex-col gap-2 h-full no-pop"
              style={{ background: "var(--paper-2)" }}
            >
              <div className="l-eyebrow" style={{ color: "var(--accent)" }}>
                {e.date}
              </div>
              <h2 className="t-h4 m-0">{e.title}</h2>
              <p className="t-body mute m-0">{e.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
