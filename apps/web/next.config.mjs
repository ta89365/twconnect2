/** @type {import("next").NextConfig} */
const nextConfig = {
  // 可依你網卡位址調整或加其他來源
  allowedDevOrigins: ["http://10.5.0.2:3000"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }]
  }
};
export default nextConfig;
