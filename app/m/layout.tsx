import "@/app/mobile.css";
import { MobileShell } from "@/components/shells/MobileShell";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Scroll-reveal hides .m-reveal until JS animates it in; without JS,
          unhide everything so content is never stuck invisible. */}
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: ".m-reveal{opacity:1!important;transform:none!important}",
          }}
        />
      </noscript>
      <MobileShell>{children}</MobileShell>
    </>
  );
}
