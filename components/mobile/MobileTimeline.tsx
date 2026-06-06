import { TIMELINE } from "@/lib/content";

export function MobileTimeline() {
  return (
    <section className="w-full max-w-[34rem] mx-auto px-[1.375rem] flex flex-col justify-center">
      <div className="flex items-baseline justify-between mb-5">
        <h2 className="t-h2" style={{ margin: 0 }}>
          The long way around.
        </h2>
        <span className="l-eyebrow mute">
          {String(TIMELINE.length).padStart(2, "0")} STOPS
        </span>
      </div>

      <div className="m-timeline-list">
        {TIMELINE.map((stop, i) => {
          const now = stop.isNow ? "true" : undefined;
          return (
            <div className="relative grid items-start [grid-template-columns:3.25rem_1.5rem_1fr]" key={i}>
              <div
                className="font-[var(--font-serif)] text-[var(--text-h5)] leading-[1.25] font-normal mt-0.5 pr-[0.625rem] text-ink-dim text-right whitespace-nowrap data-[now=true]:text-accent data-[now=true]:font-semibold"
                data-now={now}
              >
                {stop.when}
              </div>

              <div className="flex justify-center">
                <span
                  className="w-[0.6875rem] h-[0.6875rem] mt-[0.4375rem] rounded-full border-[1.5px] border-accent bg-accent shrink-0 relative z-[1] data-[now=true]:w-[0.8125rem] data-[now=true]:h-[0.8125rem] data-[now=true]:shadow-[0_0_0_0.25rem_color-mix(in_oklab,var(--accent)_26%,transparent),0_0_0.875rem_color-mix(in_oklab,var(--accent)_55%,transparent)]"
                  data-now={now}
                />
              </div>

              <div className="pl-3">
                <div
                  className="font-[var(--font-serif)] text-[var(--text-h5)] leading-[1.2] font-bold text-ink data-[now=true]:text-accent"
                  data-now={now}
                >
                  {stop.title}
                </div>
                <div className="font-[var(--font-serif)] mt-0.5 text-[clamp(0.62rem,2.9vw,0.8125rem)] leading-[1.4] text-ink-dim">
                  {stop.blurb}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
