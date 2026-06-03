import { NOW } from "@/lib/content";
import { NowClock } from "@/components/NowClock";

// Shared /now body — status board (live IST clock + cards) + dated log.
// Copy lives in lib/content.ts:NOW; reuses the .ab-* page-head atoms.
export function NowPage(_props: { shell: "d" | "m" }) {
  return (
    <main className="flex-1">
      <section
        className="page-shell now"
        style={{ paddingTop: "clamp(1.25rem, 2.5vw, 1.75rem)" }}
      >
        <div className="l-eyebrow ab-eyebrow">{NOW.eyebrow}</div>
        <h1 className="t-display ab-title">
          now<span className="ab-dot">.</span>
        </h1>
        <p className="t-lead ab-lede">{NOW.lede}</p>

        <div className="ab-cmd c-sm">
          <span className="ab-prompt">$</span> date
          <span>
            <span className="ab-sep">·</span>last updated {NOW.updated}
          </span>
          <span>
            <span className="ab-sep">·</span>goes stale in ~{NOW.staleInDays} days
          </span>
        </div>

        <div className="now-board">
          <div className="now-cell">
            <div className="now-k">local time · noida</div>
            <div className="now-v">
              <NowClock />
              <span className="now-sub">IST · UTC+5:30</span>
            </div>
          </div>
          {NOW.board.map((c) => (
            <div className="now-cell" key={c.k}>
              <div className="now-k">{c.k}</div>
              <div className={"now-v" + ("accent" in c && c.accent ? " is-accent" : "")}>
                {c.v}
                <span className="now-sub">{c.sub}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="now-log">
          {NOW.log.map((b) => (
            <section className="now-logblock" key={b.cat}>
              <div className="l-meta now-logcat">{b.cat}</div>
              <div className="now-logitems">
                {b.entries.map((e, i) => (
                  <div className="now-logitem" key={i}>
                    <p className="now-logline">{e.line}</p>
                    {e.meta && <span className="now-logmeta">{e.meta}</span>}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="now-note">
          {NOW.note}
          <span className="now-inspo">
            {" "}
            — inspired by <span className="now-ac">nownownow.com</span>
          </span>
        </p>
      </section>
    </main>
  );
}
