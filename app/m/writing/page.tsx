import { getAllPosts } from "@/lib/posts";
import { MobileWriting } from "@/components/mobile/MobileWriting";

export const revalidate = 60;

export const metadata = {
  title: "Writing — Vaibhav Verma",
  description: "Notes, essays, build logs.",
};

export default async function WritingPage() {
  const posts = await getAllPosts();
  return (
    <main className="flex-1">
      <MobileWriting posts={posts} />
    </main>
  );
}
