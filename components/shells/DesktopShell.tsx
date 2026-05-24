import { Background } from "@/components/Background";
import CustomCursor from "@/components/CustomCursor";
import { MotionProvider } from "@/components/MotionProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export function DesktopShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <Background />
      <CustomCursor />
      <Nav />
      {children}
      <Footer />
    </MotionProvider>
  );
}
