import { getAllPosts } from "@/lib/posts";
import { MobileWriting } from "@/components/mobile/MobileWriting";
import { pageMetadata } from "@/lib/seo/metadata";

export const revalidate = 60;

export const metadata = pageMetadata("writing");

export default async function WritingPage() {
  const posts = await getAllPosts();
  return (
    <main className="flex-1">
      <MobileWriting posts={posts} />
    </main>
  );
}
