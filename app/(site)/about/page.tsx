import { AboutPage } from "@/app/_impl/about";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("about");

export default function Page() {
  return <AboutPage />;
}
