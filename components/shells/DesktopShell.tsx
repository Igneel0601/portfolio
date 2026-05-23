import { Background } from "@/components/Background";
import CustomCursor from "@/components/CustomCursor";
import { MotionProvider } from "@/components/MotionProvider";
import { Nav } from "@/components/Nav";

export function DesktopShell({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <Background />
      <CustomCursor />
      <Nav />
      <div className="page-shell">{children}</div>
    </MotionProvider>
  );
}
