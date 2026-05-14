import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/MotionProvider";
import { TerminalBar } from "@/components/scenes/TerminalBar";
import { Nav } from "@/components/Nav";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MotionProvider>
          <TerminalBar />
          <Nav />
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
