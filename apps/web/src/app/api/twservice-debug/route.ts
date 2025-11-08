import { NextRequest, NextResponse } from "next/server";
import { sfetch } from "@/lib/sanity/fetch";
import { groq } from "next-sanity";

export const dynamic = "force-dynamic";

// 為了保險，列出常見命名變體
const titleJP = 'coalesce(titleJp, titleJP, title_ja, titleJa, titleJA, title.jp)';
const titleZH = 'coalesce(titleZh, titleZH, title_zh, titleTc, titleTC, title.zh)';
const titleEN = 'coalesce(titleEn, titleEN, title_en, title.en)';

const detailQuery = groq`*[
  _type in ["twServiceDetail","twService","service"] &&
  slug.current == $slug
]| order(_updatedAt desc)[0]{
  _id, _type, "slug": slug.current,
  // 直接把整份文件吐回來（raw）
  ...,
  // 同時把多語標題「各種命名」都探測一次
  "_probe": {
    "jp": ${titleJP},
    "zh": ${titleZH},
    "en": ${titleEN},
    // 如果 title 是物件，也帶回
    "titleObj": select(defined(title.jp) || defined(title.zh) || defined(title.en) => title)
  }
}`;

const titlesQuery = groq`*[
  _type in ["twServiceDetail","twService","service"] &&
  slug.current == $slug
][0]{
  "jp": ${titleJP},
  "zh": ${titleZH},
  "en": ${titleEN},
  "titleObj": select(defined(title.jp) || defined(title.zh) || defined(title.en) => title)
}`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") || "taiwan-market-entry-support";
  const lang = (searchParams.get("lang") || "jp").toLowerCase();

  try {
    const raw = await sfetch<any>(detailQuery, { slug });
    const titles = await sfetch<any>(titlesQuery, { slug });

    // 方便快速比對目前前端使用的最終 title 邏輯
    const pickByLang =
      lang === "jp" ? titles?.jp :
      lang === "zh" ? titles?.zh :
      titles?.en;

    return NextResponse.json({
      ok: true,
      lang,
      slug,
      pickedTitle: pickByLang ?? null,
      titles,
      raw, // ← 這裡包含文件的所有欄位，請直接看最上層是否真的有 titleZh/titleJp/titleEn
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
