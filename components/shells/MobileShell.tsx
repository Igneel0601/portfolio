import { MobileNav } from "@/components/mobile/MobileNav";
import { SiteFooter } from "@/components/mobile/parts";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileNav />
      {children}
      <SiteFooter />
    </>
  );
}
