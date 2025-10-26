// 允許同時處理 Sanity asset ref 與已是完整 URL 的字串
import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

/** 用於 server/client 兩邊都可工作的 public client */
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2024-06-01",
  useCdn: true,
});

const builder = imageUrlBuilder(client);

/**
 * 用法：
 *   urlFor(assetOrUrl).width(2000).height(1200).url()
 * 支援 Sanity asset ref 或完整 URL。
 */
export function urlFor(src: any) {
  if (!src) {
    return { width: () => urlFor(""), height: () => urlFor(""), url: () => "" };
  }

  // 若是完整 URL，建立可鏈式的 stub 物件讓 width/height 不報錯
  if (typeof src === "string" && /^https?:\/\//i.test(src)) {
    const chain = {
      width: (_?: number) => chain,
      height: (_?: number) => chain,
      url: () => src,
    };
    return chain;
  }

  // Sanity image asset/ref
  try {
    return builder.image(src);
  } catch {
    // 防呆：避免 build 失敗時爆錯
    const fallback = {
      width: (_?: number) => fallback,
      height: (_?: number) => fallback,
      url: () => "",
    };
    return fallback;
  }
}
