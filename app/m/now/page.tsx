import { NowPage } from "@/app/_impl/now";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("now");

export default function Page() {
  return <NowPage shell="m" />;
}
