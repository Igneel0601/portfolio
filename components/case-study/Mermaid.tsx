"use client";

import { useEffect, useRef, useState } from "react";

let initialized = false;
let counter = 0;

export function Mermaid({
  chart,
  caption,
  n,
}: {
  chart: string;
  caption?: string;
  n?: string;
}) {
  const idRef = useRef<string>(`mermaid_${++counter}`);
  const [svg, setSvg] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaidLib = await import("mermaid");
        const mermaid = mermaidLib.default;
        const elk = (await import("@mermaid-js/layout-elk")).default;
        if (!initialized) {
          mermaid.registerLayoutLoaders(elk);
          mermaid.initialize({
            layout: "elk",
            startOnLoad: false,
            securityLevel: "loose",
            theme: "base",
            fontFamily: "var(--font-plex-mono), ui-monospace, monospace",
            themeVariables: {
              background: "transparent",
              mainBkg: "#0e1116",
              primaryColor: "#0e1116",
              primaryTextColor: "#e6edf3",
              primaryBorderColor: "#5b6573",
              secondaryColor: "#161b22",
              tertiaryColor: "#0e1116",
              lineColor: "#8b949e",
              edgeLabelBackground: "#0e1116",
              clusterBkg: "transparent",
              clusterBorder: "#5b6573",
            },
            flowchart: { curve: "linear", padding: 24, nodeSpacing: 60, rankSpacing: 80, useMaxWidth: true, htmlLabels: false },
          });
          initialized = true;
        }
        const { svg: rendered } = await mermaid.render(idRef.current, chart.trim());
        if (!cancelled) {
          setSvg(rendered);
          setErr(null);
        }
      } catch (e: any) {
        console.error("[Mermaid] render failed:", e);
        if (!cancelled) setErr(String(e?.message ?? e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart]);

  return (
    <figure className="cs-mermaid">
      {err ? (
        <pre style={{ color: "#f0b73a", whiteSpace: "pre-wrap" }}>{err}</pre>
      ) : (
        <div className="cs-mermaid-render" dangerouslySetInnerHTML={{ __html: svg }} />
      )}
      {caption && (
        <figcaption className="cs-mermaid-caption">
          fig. {n && <span className="cs-mermaid-n">{n}</span>} · {caption}
        </figcaption>
      )}
    </figure>
  );
}
