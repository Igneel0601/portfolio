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
  // Vary so any CDN keeps the variants separate. Excludes /api/*, /_next/*,
  // and anything with a file extension — those don't discriminate by UA and
  // shipping Vary: User-Agent would fragment the CDN cache key by browser
  // (defeating the immutable header on /api/bloggz-media and ballooning the
  // per-asset cache footprint for /_next/static and /public/*).
  async headers() {
    return [
      {
        source: "/:path((?!api/|_next/)(?!.*\\.[a-z0-9]+$).*)",
        headers: [{ key: "Vary", value: "User-Agent" }],
      },
    ];
  },
};

export default nextConfig;
