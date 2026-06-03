import { UsesPage } from "@/app/_impl/uses";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("uses");

export default function Page() {
  return <UsesPage shell="d" />;
}
