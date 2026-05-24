import Link from "next/link";
import { EXPERIMENTS } from "@/lib/experiments";

export const metadata = {
  title: "Experiments — Vaibhav Verma",
  description: "Lab notebook. Fuckups and discoveries.",
};

export default function ExperimentsPage() {
  return (
    <main className="flex-1 page-shell" style={{ paddingTop: "clamp(1rem, 4vw, 1.5rem)" }}>
      <div className="l-eyebrow" style={{ color: "var(--ink-dim)" }}>
        lab · {new Date().getFullYear()}
      </div>

      <h1 className="t-h1" style={{ marginTop: "0.5rem" }}>
        experiments
        <span style={{ color: "var(--accent)" }}>.</span>
      </h1>

      <p className="t-body mute" style={{ marginTop: "0.75rem", fontStyle: "italic" }}>
        Personal notebook — fuckups and discoveries from the messy middle.
      </p>

      <ul className="grid gap-4 mt-6 list-none p-0">
        {EXPERIMENTS.map((e) => (
          <li key={e.slug}>
            <Link
              href={e.href ?? `/experiments/${e.slug}`}
              className="box p-4 flex flex-col gap-1.5 no-pop"
              style={{ background: "var(--paper-2)" }}
            >
              <div className="l-eyebrow" style={{ color: "var(--accent)" }}>
                {e.date}
              </div>
              <h2 className="t-h5 m-0">{e.title}</h2>
              <p className="t-sm mute m-0">{e.blurb}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
