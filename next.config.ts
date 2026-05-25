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
  // and known asset extensions — those don't discriminate by UA and shipping
  // Vary: User-Agent would fragment the CDN cache key by browser (defeating
  // the immutable header on /api/bloggz-media and ballooning the per-asset
  // cache footprint for /_next/static and /public/*).
  //
  // Asset list mirrors the skip regex in proxy.ts. A generic `.[a-z0-9]+$`
  // rule would strip Vary from legitimate slugs containing dots (e.g.
  // /writing/lessons-from-v1.0), causing CDNs to serve one shell to both UAs.
  async headers() {
    return [
      {
        source:
          "/:path((?!api/|_next/)(?!.*\\.(?:png|jpe?g|webp|avif|gif|svg|ico|bmp|tiff?|css|js|mjs|map|woff2?|ttf|otf|eot|txt|xml|json|pdf|mp4|webm|mov|mp3|ogg|wav|zip)$).*)",
        headers: [{ key: "Vary", value: "User-Agent" }],
      },
    ];
  },
};

export default nextConfig;
