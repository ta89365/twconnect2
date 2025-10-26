/** @type {import("next").NextConfig} */
const nextConfig = {
  // ✅ 若要在手機或其他裝置預覽本機開發站，可改用 dev proxy 或 middleware 控制 CORS
  // 不再使用 experimental.allowedDevOrigins 或 devIndicators.appIsrStatus

  images: {
    // ✅ 允許 Sanity 圖片來源
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io", // Sanity v3 預設圖檔來源
      },
      {
        protocol: "https",
        hostname: "images.sanitycdn.com", // Sanity 新版 pipeline
      },
    ],
  },

  // ✅ 可加快頁面載入，防止 build 過慢
  typescript: {
    ignoreBuildErrors: false,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
