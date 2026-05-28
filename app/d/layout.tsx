import "@/app/desktop.css";
import { DesktopShell } from "@/components/shells/DesktopShell";

export default function DesktopLayout({ children }: { children: React.ReactNode }) {
  return <DesktopShell>{children}</DesktopShell>;
}
