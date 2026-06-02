// Metadata builders — turn the central config (and dynamic data) into Next.js
// `Metadata` objects. Logic for the dynamic routes is lifted verbatim from the
// old inline `generateMetadata` bodies so output is unchanged.

import type { Metadata } from "next";
import type { Post } from "@/lib/posts";
import { resolveMediaUrl } from "@/lib/media";
import { PROFILE } from "@/lib/profile";
import { PAGE_SEO, type PageKey, type PageSeo } from "./pages";

const RSS_TYPES = { "application/rss+xml": "/rss.xml" } as const;

/** Static route metadata from the central per-page config. */
export function pageMetadata(key: PageKey): Metadata {
  const p: PageSeo = PAGE_SEO[key];
  const meta: Metadata = {
    alternates: {
      canonical: p.path,
      ...(p.rss ? { types: RSS_TYPES } : {}),
    },
  };
  if (p.titleLabel) meta.title = `${p.titleLabel} — ${PROFILE.name}`;
  if (p.description) meta.description = p.description;
  return meta;
}

/** Case-study (`/work/<slug>`) metadata from MDX frontmatter. */
export function caseStudyMetadata(
  data: { title: string; tagline?: string },
  slug: string,
): Metadata {
  return {
    title: `${data.title} · case study`,
    description: data.tagline,
    alternates: { canonical: `/work/${slug}` },
  };
}

/** Blog post (`/writing/<slug>`) metadata. */
export function postMetadata(post: Post, slug: string): Metadata {
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || undefined;
  const ogUrl =
    resolveMediaUrl(post.metaImage?.url ?? post.heroImage?.url) ?? undefined;

  return {
    title,
    description,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: {
      title,
      description,
      images: ogUrl ? [{ url: ogUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogUrl ? [ogUrl] : undefined,
    },
  };
}
