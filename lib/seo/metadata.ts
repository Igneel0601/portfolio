// Metadata builders — turn the central config (and dynamic data) into Next.js
// `Metadata` objects. Logic for the dynamic routes is lifted verbatim from the
// old inline `generateMetadata` bodies so output is unchanged.

import type { Metadata } from "next";
import type { Post } from "@/lib/posts";
import { resolveMediaUrl } from "@/lib/media";
import { PROFILE } from "@/lib/profile";
import { PAGE_SEO, type PageKey, type PageSeo } from "./pages";

const RSS_TYPES = { "application/rss+xml": "/rss.xml" } as const;

/** Build a dynamic per-route OG card URL (relative; resolved against
 *  metadataBase). Rendered by app/api/og — see that route for the card. */
function ogCard(opts: { title: string; subtitle?: string; eyebrow?: string }): string {
  const qs = new URLSearchParams({ title: opts.title });
  if (opts.subtitle) qs.set("subtitle", opts.subtitle);
  if (opts.eyebrow) qs.set("eyebrow", opts.eyebrow);
  return `/api/og?${qs.toString()}`;
}

/** Static route metadata from the central per-page config. */
export function pageMetadata(key: PageKey): Metadata {
  const p: PageSeo = PAGE_SEO[key];
  const meta: Metadata = {
    alternates: {
      canonical: p.path,
      ...(p.rss ? { types: RSS_TYPES } : {}),
    },
  };
  if (p.description) meta.description = p.description;
  // Titled pages get their own OG card; home (no titleLabel) keeps the brand
  // card from app/opengraph-image.tsx.
  if (p.titleLabel) {
    const pageTitle = `${p.titleLabel} — ${PROFILE.name}`;
    meta.title = pageTitle;
    const image = ogCard({ title: p.titleLabel, subtitle: p.description });
    meta.openGraph = { title: pageTitle, description: p.description, images: [image] };
    meta.twitter = {
      card: "summary_large_image",
      title: pageTitle,
      description: p.description,
      images: [image],
    };
  }
  return meta;
}

/** Case-study (`/work/<slug>`) metadata from MDX frontmatter. */
export function caseStudyMetadata(
  data: { title: string; tagline?: string },
  slug: string,
): Metadata {
  const title = `${data.title} · case study`;
  const image = ogCard({ title: data.title, subtitle: data.tagline, eyebrow: "case study" });
  return {
    title,
    description: data.tagline,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { title, description: data.tagline, images: [image] },
    twitter: {
      card: "summary_large_image",
      title,
      description: data.tagline,
      images: [image],
    },
  };
}

/** Blog post (`/writing/<slug>`) metadata. */
export function postMetadata(post: Post, slug: string): Metadata {
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || undefined;
  // Prefer the post's own hero/meta image; fall back to a generated card so
  // even image-less posts unfurl with a real banner instead of the brand default.
  const ogUrl =
    resolveMediaUrl(post.metaImage?.url ?? post.heroImage?.url) ??
    ogCard({ title, subtitle: description, eyebrow: "writing" });

  return {
    title,
    description,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: {
      title,
      description,
      images: [{ url: ogUrl }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl],
    },
  };
}
