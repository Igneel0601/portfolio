import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./tokens.css";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DesktopShell } from "@/components/shells/DesktopShell";
import { MobileShell } from "@/components/shells/MobileShell";
import { getDevice } from "@/lib/device";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://igneel.dev"),
  title: "Vaibhav Verma — software engineer",
  description:
    "I build software that teaches itself to write more software. CSE grad, Noida. Open to full-time + freelance.",
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    title: "Vaibhav Verma — software engineer",
    description:
      "I build software that teaches itself to write more software.",
    url: "https://igneel.dev",
    siteName: "Vaibhav Verma",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaibhav Verma — software engineer",
    description:
      "I build software that teaches itself to write more software.",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const device = await getDevice();
  const Shell = device === "mobile" ? MobileShell : DesktopShell;
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Shell>{children}</Shell>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
