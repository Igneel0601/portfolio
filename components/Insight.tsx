import { Fragment } from "react";

// Render a project `insight` string: `*word*` → accent highlight (`<em className="hl">`,
// tinted via the panel's `--ca`), `\n` → line break. Shared by the desktop showcase
// (ProjectsShowcaseCinematic) and the mobile panels (MobileProjects).
//
// `breaks` controls how `\n` renders: desktop keeps its hand-tuned line breaks
// (`<br />`); mobile flows the text (a space) so narrow widths wrap naturally.
export function Insight({
  text,
  breaks = true,
}: {
  text: string;
  breaks?: boolean;
}) {
  return (
    <>
      {text.split("\n").map((line, li) => (
        <Fragment key={li}>
          {li > 0 && (breaks ? <br /> : " ")}
          {line.split(/(\*[^*]+\*)/).map((seg, si) =>
            seg.startsWith("*") && seg.endsWith("*") ? (
              <em key={si} className="hl">
                {seg.slice(1, -1)}
              </em>
            ) : (
              seg
            ),
          )}
        </Fragment>
      ))}
    </>
  );
}
