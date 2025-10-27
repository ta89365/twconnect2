// apps/web/src/lib/sanity/image.ts
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// 建立 Sanity client（請確認環境變數設定正確）
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2025-01-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);
type UrlBuilder = ReturnType<typeof imageUrlBuilder>;

/**
 * 統一取得圖片 URL。
 * - 若傳入為 string（已是完整 URL）直接回傳。
 * - 若傳入為 Sanity 圖片物件或 asset ref，自動生成完整 URL。
 * - 若為空值，回傳空字串以避免 runtime 錯誤。
 */
export function urlFor(source: unknown, b: UrlBuilder = builder): string {
  if (!source) return "";
  if (typeof source === "string") return source;
  try {
    return b.image(source).url();
  } catch {
    return "";
  }
}
