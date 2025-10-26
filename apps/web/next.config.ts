/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    // ✅ 允許你的開發 IP 與 localhost，在手機或其他裝置預覽時不被阻擋
    allowedDevOrigins: ["http://10.5.0.2:3000", "http://localhost:3000"],
  },

  images: {
    // ✅ 允許 Sanity 所有常見 CDN 網域
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io", // Sanity v3 預設圖檔來源
      },
      {
        protocol: "https",
        hostname: "images.sanitycdn.com", // 有些 project 使用此路徑（新版 Sanity 或 image pipeline）
      },
    ],
  },
};

export default nextConfig;
