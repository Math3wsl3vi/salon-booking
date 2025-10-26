import withPWA from "next-pwa";
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const pwaConfig = withPWA({
  dest: "public",
  disable: !isProd,
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  ...pwaConfig,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // ✅ Add this line
      },
    ],
  },
};

export default nextConfig;
