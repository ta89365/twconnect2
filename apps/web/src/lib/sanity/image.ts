// apps/web/src/lib/sanity/image.ts
import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client"; // 你既有的 client（next-sanity 的 createClient）

const builder = imageUrlBuilder(sanityClient);

/** 取得可鏈式設定的 builder（需要 .width().height().url() 的地方用這個） */
export function img(source: unknown) {
  return builder.image(source as any);
}

/** 直接取得 URL（傳入 string 會原樣回傳，無效值回空字串，最安全） */
export function urlFor(source: unknown): string {
  if (!source) return "";
  if (typeof source === "string") return source;
  try {
    return builder.image(source as any).url();
  } catch {
    return "";
  }
}
