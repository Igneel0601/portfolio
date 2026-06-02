// Generic JSON-LD renderer. Pass a structured-data object from lib/seo/jsonld.ts.
// schema.org data is static (no user input) — safe to inline.
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
