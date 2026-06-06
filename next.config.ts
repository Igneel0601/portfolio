import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

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

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === "true" })(nextConfig);
