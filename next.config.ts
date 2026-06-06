import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hide the floating Next.js dev-route indicator (the "N" badge at
  // bottom-left in dev). It overlaps the mobile site footer.
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  // allow LAN dev access (phone over wifi/adb)
  allowedDevOrigins: ["192.168.1.2", "localhost"],
};

export default nextConfig;
