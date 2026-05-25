import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // allow LAN dev access (phone over wifi/adb)
  allowedDevOrigins: ["192.168.1.2", "localhost"],
  // UA-based shell pick in proxy.ts returns different HTML per device; pin
  // Vary so any CDN keeps the variants separate. Excludes /api/* — those
  // routes (notably /api/bloggz-media with year-long immutable cache) don't
  // discriminate by UA, and shipping Vary: User-Agent would fragment the
  // CDN cache key by browser, defeating the immutable header.
  async headers() {
    return [
      {
        source: "/:path((?!api/).*)",
        headers: [{ key: "Vary", value: "User-Agent" }],
      },
    ];
  },
};

export default nextConfig;
