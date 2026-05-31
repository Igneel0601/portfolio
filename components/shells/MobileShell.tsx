import { MobileNav } from "@/components/mobile/MobileNav";
import { SiteFooter } from "@/components/mobile/parts";
import { MotionProvider } from "@/components/MotionProvider";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <MobileNav />
      {children}
      <SiteFooter />
    </MotionProvider>
  );
}
