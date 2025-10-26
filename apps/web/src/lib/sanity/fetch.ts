// File: apps/web/src/lib/sanity/fetch.ts
// 安全版 sfetch：使用新版 Sanity API，支援 concat()、array::unique() 等新語法。
// 依據官方建議明確設定 apiVersion 與使用 CDN 快取。

import { createClient, type QueryParams } from "@sanity/client";

// ✅ 設定新版 API 版本（舊版會導致 concat() 等函式失效）
const API_VERSION = "2025-01-01";

// ✅ 初始化 Sanity client
export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ki3tylfo",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: API_VERSION,
  useCdn: true, // 快取查詢結果，前台讀取推薦設 true
  perspective: "published", // 僅抓取已發佈內容
});

/**
 * sfetch<T>
 * 統一封裝 Sanity 查詢請求
 * - 自動套用泛型結果型別
 * - 傳入 query 與參數
 * - 自動捕捉錯誤並印出
 */
export async function sfetch<T>(query: string, params: QueryParams = {}): Promise<T> {
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (err: any) {
    console.error("❌ Sanity fetch error:", err.message || err);
    throw err;
  }
}
