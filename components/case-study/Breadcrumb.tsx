import Link from "next/link";

/** Path-style crumb shown above the title on /work/[slug] and /writing/[slug]:
 *  a link back to the section index, then the current file. */
export function Breadcrumb({
  section,
  file,
}: {
  section: "work" | "writing";
  file: string;
}) {
  return (
    <div className="cs-crumb-line c-sm">
      <Link href={`/${section}`} className="no-pop">{section}</Link>
      <span className="cs-sep">/</span>
      <span>{file}</span>
    </div>
  );
}
