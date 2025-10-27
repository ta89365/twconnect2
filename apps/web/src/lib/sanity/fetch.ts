// File: apps/web/src/lib/sanity/fetch.ts
// 安全版 sfetch：支援 Token、僅抓發佈內容、且不把 Token 打進瀏覽器

import "server-only";
import { createClient, type QueryParams } from "@sanity/client";

// 明確指定 API 版本（可用環境變數覆蓋）
const API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01";

// 專案參數
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "ki3tylfo";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_TOKEN; // 只讀 Token（.env.local）

// 有 token 時關閉 CDN，避免權限與快取落差；無 token 才走 CDN
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: API_VERSION,
  token,                // 若未設定，Sanity 會當成公開讀取
  useCdn: !token,       // token → false；無 token → true
  perspective: "published",
});

export async function sfetch<T = unknown>(
  query: string,
  params: QueryParams = {}
): Promise<T> {
  try {
    return await sanityClient.fetch<T>(query, params);
  } catch (err: any) {
    // 基礎診斷，不輸出敏感資訊
    console.error("❌ Sanity fetch error:", err?.message || err);
    console.error("   projectId:", projectId, "dataset:", dataset, "apiVersion:", API_VERSION);
    throw err;
  }
}
