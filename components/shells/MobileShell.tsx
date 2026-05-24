import { MobileNav } from "@/components/mobile/MobileNav";
import { Footer } from "@/components/Footer";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileNav />
      {children}
      <Footer />
    </>
  );
}
