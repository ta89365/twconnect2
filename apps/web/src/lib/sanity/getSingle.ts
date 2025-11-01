// apps/web/src/lib/sanity/getSingle.ts
import { sfetch } from "@/lib/sanity/fetch";
import { singlePostBySlug } from "@/lib/queries/feed";
import type { Channel } from "@/lib/types/channel";
import type { Lang } from "@/lib/types/channel";

export async function getSinglePost(params: {
  channel: Channel;
  lang: Lang;
  slug: string;
}) {
  const now = new Date().toISOString();
  return await sfetch(singlePostBySlug, {
    channel: params.channel,
    lang: params.lang,
    slug: params.slug,
    now,
  });
}
