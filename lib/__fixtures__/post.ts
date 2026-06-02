import type { Post } from "@/lib/posts";

// Minimal fabricated Post for SEO/JSON-LD tests — avoids touching Postgres.
export function makePost(over: Partial<Post> = {}): Post {
  return {
    id: 1,
    title: "Hello World",
    slug: "hello-world",
    publishedAt: "2026-06-01T00:00:00Z",
    updatedAt: "2026-06-02T00:00:00Z",
    metaDescription: "A meta description.",
    categories: [],
    wordCount: 1234,
    readMinutes: 6,
    content: { root: { children: [] } } as unknown as Post["content"],
    heroImage: { url: "/api/media/file/hero.png" } as unknown as Post["heroImage"],
    metaTitle: "Meta Title",
    metaImage: null,
    dropCap: false,
    ...over,
  } as Post;
}
