"use client";

import { useEffect, useState } from "react";

// Live IST clock for the /now status board. Client-only (ticks every second);
// renders a placeholder until mounted so there's no hydration mismatch.
export function NowClock() {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="text-[1.625rem] tracking-[0.04em] [font-variant-numeric:tabular-nums]" suppressHydrationWarning>
      {time || "··:··:··"}
    </span>
  );
}
