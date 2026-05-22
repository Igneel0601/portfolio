import { MobileNav } from "@/components/mobile/MobileNav";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MobileNav />
      {children}
    </>
  );
}
