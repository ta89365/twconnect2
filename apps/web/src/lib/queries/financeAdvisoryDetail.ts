// apps/web/src/lib/queries/financeAdvisoryDetail.ts
export type Lang = "jp" | "zh" | "en";

/** 依 slug 取回財務與會計顧問／海外發展支援單筆詳情（多語 fallback） */
export const financeAdvisoryDetailBySlug = /* groq */ `
*[_type == "financeAdvisoryDetail" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  order,
  publishedAt,

  // Hero image 完整資訊
  "heroImage": heroImage{
    "assetId": asset->_id,
    "url": asset->url,
    "alt": coalesce(alt, ""),
    hotspot,
    crop,
    "dimensions": asset->metadata.dimensions{
      width,
      height,
      aspectRatio
    },
    "lqip": asset->metadata.lqip
  },

  // 多語欄位：標題
  "title": select(
    $lang == "jp" => coalesce(title.jp, title.zh, title.en),
    $lang == "zh" => coalesce(title.zh, title.jp, title.en),
    $lang == "en" => coalesce(title.en, title.zh, title.jp),
    coalesce(title.jp, title.zh, title.en)
  ),

  // 多語欄位：背景
  "background": select(
    $lang == "jp" => coalesce(background.jp, background.zh, background.en),
    $lang == "zh" => coalesce(background.zh, background.jp, background.en),
    $lang == "en" => coalesce(background.en, background.zh, background.jp),
    coalesce(background.jp, background.zh, background.en)
  ),

  // 多語欄位：課題列表
  "challenges": select(
    $lang == "jp" => array::compact(challenges.jp),
    $lang == "zh" => array::compact(challenges.zh),
    $lang == "en" => array::compact(challenges.en),
    array::compact(challenges.jp)
  ),

  // 多語欄位：服務內容列表
  "services": select(
    $lang == "jp" => array::compact(services.jp),
    $lang == "zh" => array::compact(services.zh),
    $lang == "en" => array::compact(services.en),
    array::compact(services.jp)
  ),

  // 多語欄位：服務流程（步驟＋說明）
  "serviceFlow": select(
    $lang == "jp" => serviceFlow.jp[]{
      "step": coalesce(step, ""),
      "desc": coalesce(desc, "")
    },
    $lang == "zh" => serviceFlow.zh[]{
      "step": coalesce(step, ""),
      "desc": coalesce(desc, "")
    },
    $lang == "en" => serviceFlow.en[]{
      "step": coalesce(step, ""),
      "desc": coalesce(desc, "")
    },
    serviceFlow.jp[]{
      "step": coalesce(step, ""),
      "desc": coalesce(desc, "")
    }
  ),

  // 多語欄位：費用區塊（標題＋項目）
  "fees": select(
    $lang == "jp" => {
      "title": coalesce(fees.jp.title, ""),
      "items": array::compact(fees.jp.items)
    },
    $lang == "zh" => {
      "title": coalesce(fees.zh.title, ""),
      "items": array::compact(fees.zh.items)
    },
    $lang == "en" => {
      "title": coalesce(fees.en.title, ""),
      "items": array::compact(fees.en.items)
    },
    {
      "title": coalesce(fees.jp.title, fees.zh.title, fees.en.title, ""),
      "items": coalesce(fees.jp.items, fees.zh.items, fees.en.items)
    }
  )
}
`;

/** 取得所有 financeAdvisoryDetail 的 slug 與對應標題（供路由或選單使用） */
export const financeAdvisorySlugs = /* groq */ `
*[_type == "financeAdvisoryDetail" && defined(slug.current)]
| order(order asc, publishedAt desc){
  "slug": slug.current,
  "titleJp": title.jp,
  "titleZh": title.zh,
  "titleEn": title.en,
  order,
  publishedAt
}
`;

/** 建議的語言解析小工具，可與現有 resolveLang 保持一致 */
export function resolveLang(sp?: string): Lang {
  const l = (sp ?? "").toLowerCase();
  return l === "zh" || l === "en" || l === "jp" ? (l as Lang) : "jp";
}
