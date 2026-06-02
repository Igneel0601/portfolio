import { MobileHome } from "@/components/mobile/MobileHome";
import { PersonJsonLd } from "@/components/PersonJsonLd";

export const metadata = {
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": "/rss.xml" },
  },
};

export default function Home() {
  return (
    <main className="flex-1">
      <PersonJsonLd />
      <MobileHome />
    </main>
  );
}
