// apps/web/src/lib/sanity/getFeed.ts
import { sfetch } from "@/lib/sanity/fetch";
import { feedEntranceQuery } from "@/lib/queries/feed";
import type { Channel } from "@/lib/types/channel";

export async function getEntranceFeed(channel: Channel) {
  const settingsType = channel === "news" ? "newsSettings" : "columnSettings";
  const now = new Date().toISOString();
  return await sfetch(feedEntranceQuery, {
    settingsType,
    channel,
    now,
  });
}
