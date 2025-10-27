// File: apps/web/next.config.js

/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== "production";

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
    // ✅ 僅開發環境啟用，避免 Vercel build 警告
    ...(isDev ? { allowedDevOrigins: ["http://127.0.0.1:3000", "http://localhost:3000"] } : {}),
  },

  // TypeScript / ESLint 設定
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: true },
};

module.exports = nextConfig;
