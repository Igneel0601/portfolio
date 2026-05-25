import { PostPage } from "@/app/_impl/post";

export const revalidate = 60;
export const dynamicParams = true;

export { generateStaticParams, generateMetadata } from "@/app/_impl/post";

export default function Page(props: { params: Promise<{ slug: string }> }) {
  return <PostPage {...props} shell="d" />;
}
