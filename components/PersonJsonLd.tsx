import { SITE_URL } from "@/lib/site";
import { CONTACT } from "@/lib/content";

// JSON-LD Person schema for the home page — feeds Google's knowledge panel and
// gives own-name queries ("Vaibhav Verma") a structured signal to latch onto.
// sameAs lists only real profiles; LinkedIn/X are placeholders in CONTACT, so
// they're omitted until they point somewhere real.
export function PersonJsonLd() {
  const sameAs = [CONTACT.github].filter(Boolean);
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Vaibhav Verma",
    url: SITE_URL,
    jobTitle: "Software Engineer",
    email: CONTACT.email,
    sameAs,
  };
  return (
    <script
      type="application/ld+json"
      // schema.org JSON-LD — static, no user input, safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
