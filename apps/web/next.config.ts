// File: apps/web/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // ✅ 使用新版 remotePatterns（取代 domains）
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "images.sanitycdn.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    // ✅ 正確放在 experimental 底下，避免 dev 警告
    allowedDevOrigins: ["http://127.0.0.1:3000", "http://localhost:3000"],
  },

  // TypeScript / ESLint 設定
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
