import { NextRequest, NextResponse } from "next/server";
import { sfetch } from "@/lib/sanity/fetch";
import { groq } from "next-sanity";

export const dynamic = "force-dynamic";

type Lang = "jp" | "zh" | "en";
const normalizeLang = (s?: string): Lang => {
  const k = String(s ?? "").trim().toLowerCase();
  if (!k) return "jp";
  if (["zh", "zh-hant", "hant", "zh_tw", "zh-tw", "zh-cn", "zh_cn", "zh-hans", "hans", "cn"].includes(k)) return "zh";
  if (["en", "en-us", "en_us", "en-gb"].includes(k)) return "en";
  if (["jp", "ja", "ja-jp"].includes(k)) return "jp";
  return "jp";
};

const tidy = (v: any) => (typeof v === "string" ? v.trim() : v);
const nz = (...vals: Array<any>) => {
  for (const v of vals) {
    const s = tidy(v);
    if (typeof s === "string") {
      if (s.length > 0) return s;
    } else if (s != null) {
      return s;
    }
  }
  return undefined;
};

function pickLocale(obj: any, lang: Lang): string | undefined {
  if (!obj || typeof obj !== "object") return undefined;
  const pri = tidy(obj[lang]);
  if (typeof pri === "string" && pri.length) return pri;
  const jp = tidy(obj.jp);
  const zh = tidy(obj.zh);
  const en = tidy(obj.en);
  return (jp?.length ? jp : undefined) ?? (zh?.length ? zh : undefined) ?? (en?.length ? en : undefined);
}

// 這兩個 query 保留原本設計：找最新的 published / draft（任何 type）
const publishedDocQuery = groq`*[
  _type in ["twServiceDetail","twService","service"] &&
  slug.current == $slug &&
  !(_id in path("drafts.**"))
]| order(_updatedAt desc)[0]{ ..., "coverImageUrl": coverImage.asset->url }`;

const draftDocQuery = groq`*[
  _type in ["twServiceDetail","twService","service"] &&
  slug.current == $slug &&
  _id in path("drafts.**")
]| order(_updatedAt desc)[0]{ ..., "coverImageUrl": coverImage.asset->url }`;

// 專門對 twServiceDetail 做 localized 探針：同時回 raw + 已 coalesce 過的結果
const localizedProbeQuery = groq`*[
  _type == "twServiceDetail" &&
  slug.current == $slug
]| order(_updatedAt desc)[0]{
  _id,
  _type,
  "slug": slug.current,

  // === raw 欄位：直接看看 schema 實際長怎樣 ===
  subsidiaryTitle,
  branchTitle,
  repOfficeTitle,
  accountingTaxTitle,
  valueAddedTitle,

  subsidiaryColumns,
  branchColumns,
  repOfficeColumns,
  accountingTaxColumns,
  valueAddedColumns,

  background,
  services,

  // === localized 版本：用現在你打算在 GROQ / 前端用的邏輯去挑 ===
  "localizedTableTitles": {
    "subsidiary":    coalesce(select($lang=="jp"=>subsidiaryTitle.jp,    $lang=="zh"=>subsidiaryTitle.zh,    $lang=="en"=>subsidiaryTitle.en),    subsidiaryTitle.jp,    subsidiaryTitle.zh,    subsidiaryTitle.en),
    "branch":        coalesce(select($lang=="jp"=>branchTitle.jp,        $lang=="zh"=>branchTitle.zh,        $lang=="en"=>branchTitle.en),        branchTitle.jp,        branchTitle.zh,        branchTitle.en),
    "repOffice":     coalesce(select($lang=="jp"=>repOfficeTitle.jp,     $lang=="zh"=>repOfficeTitle.zh,     $lang=="en"=>repOfficeTitle.en),     repOfficeTitle.jp,     repOfficeTitle.zh,     repOfficeTitle.en),
    "accountingTax": coalesce(select($lang=="jp"=>accountingTaxTitle.jp, $lang=="zh"=>accountingTaxTitle.zh, $lang=="en"=>accountingTaxTitle.en), accountingTaxTitle.jp, accountingTaxTitle.zh, accountingTaxTitle.en),
    "valueAdded":    coalesce(select($lang=="jp"=>valueAddedTitle.jp,    $lang=="zh"=>valueAddedTitle.zh,    $lang=="en"=>valueAddedTitle.en),    valueAddedTitle.jp,    valueAddedTitle.zh,    valueAddedTitle.en)
  },

  "localizedColumns": {
    "subsidiary": {
      "col1": coalesce(select($lang=="jp"=>subsidiaryColumns.col1.jp, $lang=="zh"=>subsidiaryColumns.col1.zh, $lang=="en"=>subsidiaryColumns.col1.en), subsidiaryColumns.col1.jp, subsidiaryColumns.col1.zh, subsidiaryColumns.col1.en),
      "col2": coalesce(select($lang=="jp"=>subsidiaryColumns.col2.jp, $lang=="zh"=>subsidiaryColumns.col2.zh, $lang=="en"=>subsidiaryColumns.col2.en), subsidiaryColumns.col2.jp, subsidiaryColumns.col2.zh, subsidiaryColumns.col2.en),
      "col3": coalesce(select($lang=="jp"=>subsidiaryColumns.col3.jp, $lang=="zh"=>subsidiaryColumns.col3.zh, $lang=="en"=>subsidiaryColumns.col3.en), subsidiaryColumns.col3.jp, subsidiaryColumns.col3.zh, subsidiaryColumns.col3.en),
      "col4": coalesce(select($lang=="jp"=>subsidiaryColumns.col4.jp, $lang=="zh"=>subsidiaryColumns.col4.zh, $lang=="en"=>subsidiaryColumns.col4.en), subsidiaryColumns.col4.jp, subsidiaryColumns.col4.zh, subsidiaryColumns.col4.en)
    },
    "branch": {
      "col1": coalesce(select($lang=="jp"=>branchColumns.col1.jp, $lang=="zh"=>branchColumns.col1.zh, $lang=="en"=>branchColumns.col1.en), branchColumns.col1.jp, branchColumns.col1.zh, branchColumns.col1.en),
      "col2": coalesce(select($lang=="jp"=>branchColumns.col2.jp, $lang=="zh"=>branchColumns.col2.zh, $lang=="en"=>branchColumns.col2.en), branchColumns.col2.jp, branchColumns.col2.zh, branchColumns.col2.en),
      "col3": coalesce(select($lang=="jp"=>branchColumns.col3.jp, $lang=="zh"=>branchColumns.col3.zh, $lang=="en"=>branchColumns.col3.en), branchColumns.col3.jp, branchColumns.col3.zh, branchColumns.col3.en)
    },
    "repOffice": {
      "col1": coalesce(select($lang=="jp"=>repOfficeColumns.col1.jp, $lang=="zh"=>repOfficeColumns.col1.zh, $lang=="en"=>repOfficeColumns.col1.en), repOfficeColumns.col1.jp, repOfficeColumns.col1.zh, repOfficeColumns.col1.en),
      "col2": coalesce(select($lang=="jp"=>repOfficeColumns.col2.jp, $lang=="zh"=>repOfficeColumns.col2.zh, $lang=="en"=>repOfficeColumns.col2.en), repOfficeColumns.col2.jp, repOfficeColumns.col2.zh, repOfficeColumns.col2.en),
      "col3": coalesce(select($lang=="jp"=>repOfficeColumns.col3.jp, $lang=="zh"=>repOfficeColumns.col3.zh, $lang=="en"=>repOfficeColumns.col3.en), repOfficeColumns.col3.jp, repOfficeColumns.col3.zh, repOfficeColumns.col3.en)
    },
    "accountingTax": {
      "col1": coalesce(select($lang=="jp"=>accountingTaxColumns.col1.jp, $lang=="zh"=>accountingTaxColumns.col1.zh, $lang=="en"=>accountingTaxColumns.col1.en), accountingTaxColumns.col1.jp, accountingTaxColumns.col1.zh, accountingTaxColumns.col1.en),
      "col2": coalesce(select($lang=="jp"=>accountingTaxColumns.col2.jp, $lang=="zh"=>accountingTaxColumns.col2.zh, $lang=="en"=>accountingTaxColumns.col2.en), accountingTaxColumns.col2.jp, accountingTaxColumns.col2.zh, accountingTaxColumns.col2.en),
      "col3": coalesce(select($lang=="jp"=>accountingTaxColumns.col3.jp, $lang=="zh"=>accountingTaxColumns.col3.zh, $lang=="en"=>accountingTaxColumns.col3.en), accountingTaxColumns.col3.jp, accountingTaxColumns.col3.zh, accountingTaxColumns.col3.en)
    },
    "valueAdded": {
      "col1": coalesce(select($lang=="jp"=>valueAddedColumns.col1.jp, $lang=="zh"=>valueAddedColumns.col1.zh, $lang=="en"=>valueAddedColumns.col1.en), valueAddedColumns.col1.jp, valueAddedColumns.col1.zh, valueAddedColumns.col1.en),
      "col2": coalesce(select($lang=="jp"=>valueAddedColumns.col2.jp, $lang=="zh"=>valueAddedColumns.col2.zh, $lang=="en"=>valueAddedColumns.col2.en), valueAddedColumns.col2.jp, valueAddedColumns.col2.zh, valueAddedColumns.col2.en),
      "col3": coalesce(select($lang=="jp"=>valueAddedColumns.col3.jp, $lang=="zh"=>valueAddedColumns.col3.zh, $lang=="en"=>valueAddedColumns.col3.en), valueAddedColumns.col3.jp, valueAddedColumns.col3.zh, valueAddedColumns.col3.en)
    }
  },

  "backgroundLocalized": coalesce(
    select($lang=="jp"=>background.jp, $lang=="zh"=>background.zh, $lang=="en"=>background.en),
    background.jp,
    background.zh,
    background.en
  ),

  "keywordsLocalized": coalesce(
    select($lang=="jp"=>services.keywords.jp, $lang=="zh"=>services.keywords.zh, $lang=="en"=>services.keywords.en),
    services.keywords.jp,
    services.keywords.zh,
    services.keywords.en
  )
}`;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug") || "taiwan-market-entry-support";
  const lang = normalizeLang(searchParams.get("lang") || "jp");

  try {
    const [published, draft, localized] = await Promise.all([
      sfetch<any>(publishedDocQuery, { slug }),
      sfetch<any>(draftDocQuery, { slug }),
      sfetch<any>(localizedProbeQuery, { slug, lang }),
    ]);

    const doc = published ?? draft ?? null;

    const perTable = doc
      ? {
          subsidiary: {
            col1: pickLocale(doc.subsidiaryColumns?.col1, lang),
            col2: pickLocale(doc.subsidiaryColumns?.col2, lang),
            col3: pickLocale(doc.subsidiaryColumns?.col3, lang),
            col4: pickLocale(doc.subsidiaryColumns?.col4, lang),
          },
          branch: {
            col1: pickLocale(doc.branchColumns?.col1, lang),
            col2: pickLocale(doc.branchColumns?.col2, lang),
            col3: pickLocale(doc.branchColumns?.col3, lang),
          },
          repOffice: {
            col1: pickLocale(doc.repOfficeColumns?.col1, lang),
            col2: pickLocale(doc.repOfficeColumns?.col2, lang),
            col3: pickLocale(doc.repOfficeColumns?.col3, lang),
          },
          accountingTax: {
            col1: pickLocale(doc.accountingTaxColumns?.col1, lang),
            col2: pickLocale(doc.accountingTaxColumns?.col2, lang),
            col3: pickLocale(doc.accountingTaxColumns?.col3, lang),
          },
          valueAdded: {
            col1: pickLocale(doc.valueAddedColumns?.col1, lang),
            col2: pickLocale(doc.valueAddedColumns?.col2, lang),
            col3: pickLocale(doc.valueAddedColumns?.col3, lang),
          },
        }
      : undefined;

    const pageHdr = perTable
      ? {
          plan: nz(perTable.subsidiary.col1) ?? "Plan",
          serviceDetails:
            nz(
              perTable.subsidiary.col2,
              perTable.branch.col1,
              perTable.repOffice.col1,
              perTable.accountingTax.col1,
              perTable.valueAdded.col1
            ) ?? "Service Details",
          idealFor:
            nz(
              perTable.subsidiary.col3,
              perTable.branch.col2,
              perTable.repOffice.col2,
              perTable.accountingTax.col2,
              perTable.valueAdded.col2
            ) ?? "Ideal For",
          feeJpy:
            nz(
              perTable.subsidiary.col4,
              perTable.branch.col3,
              perTable.repOffice.col3,
              perTable.accountingTax.col3,
              perTable.valueAdded.col3
            ) ?? "Fee JPY",
        }
      : undefined;

    return NextResponse.json({
      ok: true,
      slug,
      lang,

      // 哪一筆被當成 "實際使用" 的 doc
      published: published
        ? {
            _id: published._id,
            _type: published._type,
            _updatedAt: published._updatedAt,
            slug: published.slug?.current ?? published.slug,
            raw: published,
          }
        : null,
      draft: draft
        ? {
            _id: draft._id,
            _type: draft._type,
            _updatedAt: draft._updatedAt,
            slug: draft.slug?.current ?? draft.slug,
            raw: draft,
          }
        : null,

      // 專對 twServiceDetail 的 localized probe（含 raw + localized）
      localizedProjection: localized ?? null,

      // 用「generic doc + pickLocale()」算出來的每個表格欄位
      headersByTable: perTable ?? null,

      // 用跟 page.tsx 類似邏輯算出的 4 個表頭
      pageHdr: pageHdr ?? null,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, slug, lang, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}
