import "@/app/mobile.css";
import { MobileShell } from "@/components/shells/MobileShell";

export default function MobileLayout({ children }: { children: React.ReactNode }) {
  return <MobileShell>{children}</MobileShell>;
}
