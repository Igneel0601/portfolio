import Link from "next/link";
import { EXPERIMENTS } from "@/lib/experiments";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("experiments");

export default function ExperimentsPage() {
  return (
    <>
      {/* Desktop */}
      <main className="flex-1 page-shell hidden md:block pt-[clamp(1.25rem,2.5vw,1.75rem)]">
        <div className="l-eyebrow text-ink-dim">
          lab · {new Date().getFullYear()}
        </div>

        <h1 className="t-display mt-3">
          experiments
          <span className="text-accent">.</span>
        </h1>

        <p className="t-lead mt-4 text-ink-soft italic max-w-[42ch]">
          Personal notebook — fuckups and discoveries from the messy middle.
        </p>

        <ul className="grid gap-5 mt-10 list-none p-0 grid-cols-[repeat(auto-fill,minmax(min(20rem,100%),1fr))]">
          {EXPERIMENTS.map((e) => (
            <li key={e.slug}>
              <Link
                href={e.href ?? `/experiments/${e.slug}`}
                className="box p-5 flex flex-col gap-2 h-full no-pop bg-paper-2"
              >
                <div className="l-eyebrow text-accent">
                  {e.date}
                </div>
                <h2 className="t-h4 m-0">{e.title}</h2>
                <p className="t-body mute m-0">{e.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      {/* Mobile */}
      <main className="flex-1 page-shell md:hidden pt-[clamp(1rem,4vw,1.5rem)]">
        <div className="l-eyebrow text-ink-dim">
          lab · {new Date().getFullYear()}
        </div>

        <h1 className="t-h1 mt-2">
          experiments
          <span className="text-accent">.</span>
        </h1>

        <p className="t-body mute mt-3 italic">
          Personal notebook — fuckups and discoveries from the messy middle.
        </p>

        <ul className="grid gap-4 mt-6 list-none p-0">
          {EXPERIMENTS.map((e) => (
            <li key={e.slug}>
              <Link
                href={e.href ?? `/experiments/${e.slug}`}
                className="box p-4 flex flex-col gap-1.5 no-pop bg-paper-2"
              >
                <div className="l-eyebrow text-accent">
                  {e.date}
                </div>
                <h2 className="t-h5 m-0">{e.title}</h2>
                <p className="t-sm mute m-0">{e.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}
