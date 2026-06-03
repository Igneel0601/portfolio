import { ContactPage } from "@/app/_impl/contact";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata("contact");

export default function Page() {
  return <ContactPage shell="d" />;
}
