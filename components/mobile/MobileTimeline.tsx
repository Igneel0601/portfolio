import { TIMELINE } from "@/lib/content";

export function MobileTimeline() {
  return (
    <section className="m-timeline">
      <div className="m-timeline-head">
        <h2 className="t-h2" style={{ margin: 0 }}>
          The long way around.
        </h2>
        <span className="l-eyebrow mute">
          {String(TIMELINE.length).padStart(2, "0")} STOPS
        </span>
      </div>

      <div className="m-timeline-list">
        {TIMELINE.map((stop, i) => {
          const isLast = i === TIMELINE.length - 1;
          const now = stop.isNow ? "true" : undefined;
          return (
            <div className="m-timeline-row" key={i}>
              <div className="t-h5 m-timeline-when" data-now={now}>
                {stop.when}
              </div>

              <div className="m-timeline-dot-wrap">
                {!isLast && <div aria-hidden className="m-timeline-rail" />}
                <span className="m-timeline-dot" data-now={now} />
              </div>

              <div className="m-timeline-body">
                <div className="t-h5 m-timeline-title" data-now={now}>
                  {stop.title}
                </div>
                <div className="t-sm m-timeline-blurb">{stop.blurb}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
