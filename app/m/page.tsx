import { MobileHome } from "@/components/mobile/MobileHome";
import { JsonLd } from "@/components/JsonLd";
import { pageMetadata } from "@/lib/seo/metadata";
import { personJsonLd } from "@/lib/seo/jsonld";

export const metadata = pageMetadata("home");

export default function Home() {
  return (
    <main className="flex-1">
      <JsonLd data={personJsonLd()} />
      <MobileHome />
    </main>
  );
}
