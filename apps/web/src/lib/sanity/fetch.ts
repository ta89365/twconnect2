// File: apps/web/src/lib/sanity/fetch.ts
// 安全版 sfetch：新版 Sanity API + 泛型回傳

import { createClient, type QueryParams } from "@sanity/client";

// ✅ 建議明確指定 API 版本
const API_VERSION = "2025-01-01";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ki3tylfo",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: API_VERSION,
  useCdn: true,              // 前台讀取建議使用 CDN
  perspective: "published",  // 只抓發佈內容
});

/**
 * sfetch<T=unknown>
 * - 以泛型帶入期望的回傳型別
 * - 統一錯誤處理
 */
export async function sfetch<T = unknown>(
  query: string,
  params: QueryParams = {}
): Promise<T> {
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (err: any) {
    console.error("❌ Sanity fetch error:", err?.message || err);
    throw err;
  }
}
