import { TIMELINE } from "@/lib/content";

export function MobileTimeline() {
  return (
    <section
      style={{
        padding: "32px 22px 28px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <h2 className="t-h2" style={{ margin: 0 }}>
          The long way around.
        </h2>
        <span className="l-eyebrow mute">
          {String(TIMELINE.length).padStart(2, "0")} STOPS
        </span>
      </div>

      <div>
        {TIMELINE.map((stop, i) => {
          const isLast = i === TIMELINE.length - 1;
          return (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 24px 1fr",
                alignItems: "start",
                paddingBottom: isLast ? 0 : 28,
              }}
            >
              {/* year column */}
              <div
                className="t-h5"
                style={{
                  color: stop.isNow ? "var(--accent)" : "var(--ink-soft)",
                  textAlign: "right",
                  paddingRight: 12,
                  paddingTop: 2,
                  fontWeight: stop.isNow ? 700 : 500,
                }}
              >
                {stop.when}
              </div>

              {/* dot + connecting line column */}
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  justifyContent: "center",
                  alignSelf: "stretch",
                }}
              >
                {!isLast && (
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: 12,
                      bottom: -38,
                      borderLeft: "2px dashed var(--ink)",
                      transform: "translateX(-1px)",
                      zIndex: 0,
                    }}
                  />
                )}
                <span
                  style={{
                    display: "block",
                    width: 12,
                    height: 12,
                    marginTop: 6,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    boxShadow: stop.isNow
                      ? "0 0 0 4px color-mix(in oklab, var(--accent) 28%, transparent), 0 0 14px color-mix(in oklab, var(--accent) 55%, transparent)"
                      : undefined,
                    position: "relative",
                    zIndex: 1,
                  }}
                />
              </div>

              {/* title + blurb */}
              <div style={{ paddingLeft: 12 }}>
                <div className="t-h5" style={{ color: "var(--ink)" }}>
                  {stop.title}
                </div>
                <div
                  className="t-sm mute"
                  style={{ marginTop: 4, lineHeight: 1.45 }}
                >
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
