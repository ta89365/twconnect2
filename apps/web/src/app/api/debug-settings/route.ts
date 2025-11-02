// apps/web/src/app/api/debug/site-settings/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";
import { siteSettingsByLang } from "@/lib/queries/siteSettings";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2025-01-01",
  useCdn: false,           // 不用 CDN 才能看最新
  token: process.env.SANITY_API_TOKEN || undefined, // 若 dataset 不公開，需只讀 token
  perspective: "published" // 想看草稿可改 "previewDrafts"
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lang = searchParams.get("lang") || "jp";

  try {
    const data = await client.fetch(siteSettingsByLang, { lang });
    return NextResponse.json(
      { ok: true, lang, data },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
