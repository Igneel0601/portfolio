import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // allow LAN dev access (phone over wifi/adb)
  allowedDevOrigins: ["192.168.1.2", "localhost"],
  // UA-based shell pick in app/layout.tsx returns different HTML per device;
  // pin Vary so any CDN keeps the variants separate.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [{ key: "Vary", value: "User-Agent" }],
      },
    ];
  },
};

export default nextConfig;
