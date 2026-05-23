import { CaseStudyPage } from "@/app/_impl/case-study";

export const dynamicParams = false;

export {
  generateStaticParams,
  generateMetadata,
} from "@/app/_impl/case-study";

export default function Page(props: { params: Promise<{ slug: string }> }) {
  return <CaseStudyPage {...props} shell="d" />;
}
