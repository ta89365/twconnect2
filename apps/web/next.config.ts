/** @type {import("next").NextConfig} */
const nextConfig = {
  // ✅ 若要在手機或其他裝置預覽本機開發站，可改用 dev proxy 或 middleware 控制 CORS
  // 不再使用 experimental.allowedDevOrigins

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

  // ✅ 若要在開發階段允許手機訪問，可加上以下設定
  // （這樣 http://10.5.0.2:3000 之類的本機 IP 可用）
  devIndicators: {
    appIsrStatus: false,
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
