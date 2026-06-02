// JSON-LD structured-data builders. Pure data — rendered via <JsonLd data={…} />.

import { SITE_URL } from "@/lib/site";
import { CONTACT } from "@/lib/content";
import { resolveMediaUrl } from "@/lib/media";
import type { Post } from "@/lib/posts";

const AUTHOR_NAME = "Vaibhav Verma";

/** schema.org Person — feeds the knowledge panel / own-name queries. */
export function personJsonLd() {
  const sameAs = [CONTACT.github].filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR_NAME,
    url: SITE_URL,
    jobTitle: "Software Engineer",
    email: CONTACT.email,
    sameAs,
  };
}

/** Absolute URL for an OG/article image (resolveMediaUrl returns a /-path). */
function absoluteImage(post: Post): string | undefined {
  const rel = resolveMediaUrl(post.metaImage?.url ?? post.heroImage?.url);
  if (!rel) return undefined;
  return rel.startsWith("http") ? rel : `${SITE_URL}${rel}`;
}

/** schema.org BlogPosting — rich-result eligibility for /writing/<slug>. */
export function articleJsonLd(post: Post, slug: string) {
  const url = `${SITE_URL}/writing/${slug}`;
  const image = absoluteImage(post);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.metaTitle || post.title,
    description: post.metaDescription || undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    author: { "@type": "Person", name: AUTHOR_NAME, url: SITE_URL },
    image: image ? [image] : undefined,
    wordCount: post.wordCount || undefined,
    url,
    mainEntityOfPage: url,
  };
}
