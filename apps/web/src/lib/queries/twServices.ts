// apps/web/src/lib/queries/twServices.ts
import { groq } from "next-sanity";

export type Lang = "jp" | "zh" | "en";

const pickTitleByLang = `
  coalesce(
    select($lang == "jp" => coalesce(titleJp, title.jp)),
    select($lang == "zh" => coalesce(titleZh, title.zh)),
    select($lang == "en" => coalesce(titleEn, title.en)),
    titleJp, titleZh, titleEn,
    title.jp, title.zh, title.en,
    string(title)
  )
`;

/**
 * 只抓 twServiceDetail（排除舊 twService / service）
 * 所有多語欄位都已做 fallback
 */
export const twServiceDetailBySlug = groq`
*[
  _type == "twServiceDetail"
  && slug.current == $slug
  && !(_id in path("drafts.**"))
]
| order(_updatedAt desc)[0]{
  _id,
  "slug": slug.current,

  // 標題（已依語系）
  "title": ${pickTitleByLang},

  coverImage{ ..., "url": asset->url },

  // ===== 背景、挑戰、服務內容 =====
  "background": coalesce(
    background[$lang],
    background.jp,
    background.zh,
    background.en
  ),

  "challenges": coalesce(
    challenges[$lang],
    challenges.jp,
    challenges.zh,
    challenges.en
  ),

  "services": {
    "items": coalesce(
      services[$lang],
      services.jp,
      services.zh,
      services.en
    ),
    "keywords": coalesce(
      services.keywords[$lang],
      services.keywords.jp,
      services.keywords.zh,
      services.keywords.en
    )
  },

  // ===== Service Flow =====
  "serviceFlow": coalesce(
    serviceFlow[$lang][]{
      title,
      description
    },
    serviceFlow.jp[]{
      title,
      description
    },
    serviceFlow.zh[]{
      title,
      description
    },
    serviceFlow.en[]{
      title,
      description
    }
  ),

  // ===== Schedule Example =====
  "scheduleExample": coalesce(
    scheduleExample[$lang],
    scheduleExample.jp,
    scheduleExample.zh,
    scheduleExample.en
  ),

  // ====== 五個表格小標題（已依語系回傳） ======
  "subsidiaryTitle": coalesce(
    subsidiaryTitle[$lang],
    subsidiaryTitle.jp,
    subsidiaryTitle.zh,
    subsidiaryTitle.en
  ),
  "branchTitle": coalesce(
    branchTitle[$lang],
    branchTitle.jp,
    branchTitle.zh,
    branchTitle.en
  ),
  "repOfficeTitle": coalesce(
    repOfficeTitle[$lang],
    repOfficeTitle.jp,
    repOfficeTitle.zh,
    repOfficeTitle.en
  ),
  "accountingTaxTitle": coalesce(
    accountingTaxTitle[$lang],
    accountingTaxTitle.jp,
    accountingTaxTitle.zh,
    accountingTaxTitle.en
  ),
  "valueAddedTitle": coalesce(
    valueAddedTitle[$lang],
    valueAddedTitle.jp,
    valueAddedTitle.zh,
    valueAddedTitle.en
  ),

  // ====== 各表格欄位標題（已依語系回傳） ======
  "subsidiaryColumns": {
    "col1": coalesce(
      subsidiaryColumns.col1[$lang],
      subsidiaryColumns.col1.jp,
      subsidiaryColumns.col1.zh,
      subsidiaryColumns.col1.en
    ),
    "col2": coalesce(
      subsidiaryColumns.col2[$lang],
      subsidiaryColumns.col2.jp,
      subsidiaryColumns.col2.zh,
      subsidiaryColumns.col2.en
    ),
    "col3": coalesce(
      subsidiaryColumns.col3[$lang],
      subsidiaryColumns.col3.jp,
      subsidiaryColumns.col3.zh,
      subsidiaryColumns.col3.en
    ),
    "col4": coalesce(
      subsidiaryColumns.col4[$lang],
      subsidiaryColumns.col4.jp,
      subsidiaryColumns.col4.zh,
      subsidiaryColumns.col4.en
    )
  },

  "branchColumns": {
    "col1": coalesce(
      branchColumns.col1[$lang],
      branchColumns.col1.jp,
      branchColumns.col1.zh,
      branchColumns.col1.en
    ),
    "col2": coalesce(
      branchColumns.col2[$lang],
      branchColumns.col2.jp,
      branchColumns.col2.zh,
      branchColumns.col2.en
    ),
    "col3": coalesce(
      branchColumns.col3[$lang],
      branchColumns.col3.jp,
      branchColumns.col3.zh,
      branchColumns.col3.en
    )
  },

  "repOfficeColumns": {
    "col1": coalesce(
      repOfficeColumns.col1[$lang],
      repOfficeColumns.col1.jp,
      repOfficeColumns.col1.zh,
      repOfficeColumns.col1.en
    ),
    "col2": coalesce(
      repOfficeColumns.col2[$lang],
      repOfficeColumns.col2.jp,
      repOfficeColumns.col2.zh,
      repOfficeColumns.col2.en
    ),
    "col3": coalesce(
      repOfficeColumns.col3[$lang],
      repOfficeColumns.col3.jp,
      repOfficeColumns.col3.zh,
      repOfficeColumns.col3.en
    )
  },

  "accountingTaxColumns": {
    "col1": coalesce(
      accountingTaxColumns.col1[$lang],
      accountingTaxColumns.col1.jp,
      accountingTaxColumns.col1.zh,
      accountingTaxColumns.col1.en
    ),
    "col2": coalesce(
      accountingTaxColumns.col2[$lang],
      accountingTaxColumns.col2.jp,
      accountingTaxColumns.col2.zh,
      accountingTaxColumns.col2.en
    ),
    "col3": coalesce(
      accountingTaxColumns.col3[$lang],
      accountingTaxColumns.col3.jp,
      accountingTaxColumns.col3.zh,
      accountingTaxColumns.col3.en
    )
  },

  "valueAddedColumns": {
    "col1": coalesce(
      valueAddedColumns.col1[$lang],
      valueAddedColumns.col1.jp,
      valueAddedColumns.col1.zh,
      valueAddedColumns.col1.en
    ),
    "col2": coalesce(
      valueAddedColumns.col2[$lang],
      valueAddedColumns.col2.jp,
      valueAddedColumns.col2.zh,
      valueAddedColumns.col2.en
    ),
    "col3": coalesce(
      valueAddedColumns.col3[$lang],
      valueAddedColumns.col3.jp,
      valueAddedColumns.col3.zh,
      valueAddedColumns.col3.en
    )
  },

  // ====== 表格資料 ======
  "subsidiaryPlans": subsidiaryPlans[] {
    "plan":     coalesce(plan[$lang],     plan.jp,     plan.zh,     plan.en),
    "services": coalesce(services[$lang], services.jp, services.zh, services.en),
    "who":      coalesce(who[$lang],      who.jp,      who.zh,      who.en),
    "fee":      coalesce(fee[$lang],      fee.jp,      fee.zh,      fee.en),
    "feeJpy":   coalesce(feeJpy[$lang],   feeJpy.jp,   feeJpy.zh,   feeJpy.en),
    "notes":    coalesce(notes[$lang],    notes.jp,    notes.zh,    notes.en)
  },

  "branchSupport": branchSupport[] {
    "name":     coalesce(name[$lang],     name.jp,     name.zh,     name.en),
    "details":  coalesce(details[$lang],  details.jp,  details.zh,  details.en),
    "idealFor": coalesce(idealFor[$lang], idealFor.jp, idealFor.zh, idealFor.en),
    "fee":      coalesce(fee[$lang],      fee.jp,      fee.zh,      fee.en),
    "feeJpy":   coalesce(feeJpy[$lang],   feeJpy.jp,   feeJpy.zh,   feeJpy.en),
    "notes":    coalesce(notes[$lang],    notes.jp,    notes.zh,    notes.en)
  },

  "repOfficeSupport": repOfficeSupport[] {
    "name":     coalesce(name[$lang],     name.jp,     name.zh,     name.en),
    "details":  coalesce(details[$lang],  details.jp,  details.zh,  details.en),
    "idealFor": coalesce(idealFor[$lang], idealFor.jp, idealFor.zh, idealFor.en),
    "fee":      coalesce(fee[$lang],      fee.jp,      fee.zh,      fee.en),
    "feeJpy":   coalesce(feeJpy[$lang],   feeJpy.jp,   feeJpy.zh,   feeJpy.en),
    "notes":    coalesce(notes[$lang],    notes.jp,    notes.zh,    notes.en)
  },

  "accountingTaxSupport": accountingTaxSupport[] {
    "name":     coalesce(name[$lang],     name.jp,     name.zh,     name.en),
    "details":  coalesce(details[$lang],  details.jp,  details.zh,  details.en),
    "idealFor": coalesce(idealFor[$lang], idealFor.jp, idealFor.zh, idealFor.en),
    "fee":      coalesce(fee[$lang],      fee.jp,      fee.zh,      fee.en),
    "feeJpy":   coalesce(feeJpy[$lang],   feeJpy.jp,   feeJpy.zh,   feeJpy.en),
    "notes":    coalesce(notes[$lang],    notes.jp,    notes.zh,    notes.en)
  },

  "valueAddedServices": valueAddedServices[] {
    "name":     coalesce(name[$lang],     name.jp,     name.zh,     name.en),
    "details":  coalesce(details[$lang],  details.jp,  details.zh,  details.en),
    "idealFor": coalesce(idealFor[$lang], idealFor.jp, idealFor.zh, idealFor.en),
    "fee":      coalesce(fee[$lang],      fee.jp,      fee.zh,      fee.en),
    "feeJpy":   coalesce(feeJpy[$lang],   feeJpy.jp,   feeJpy.zh,   feeJpy.en),
    "notes":    coalesce(notes[$lang],    notes.jp,    notes.zh,    notes.en)
  },

  // ===== 舊 flat fallback（保留） =====
  "feesFlat": select(
    $lang == "jp" => feesFlatJp[] ,
    $lang == "zh" => feesFlatZh[] ,
    $lang == "en" => feesFlatEn[] ,
    true          => coalesce(feesFlatJp, feesFlatZh, feesFlatEn)[]
  ),

  "feesSectionTitle": coalesce(
    feesSectionTitle[$lang],
    feesSectionTitle.jp,
    feesSectionTitle.zh,
    feesSectionTitle.en
  ),

  "ctaLabel": coalesce(
    ctaLabel[$lang],
    ctaLabel.jp,
    ctaLabel.zh,
    ctaLabel.en
  ),
  ctaLink
}
`;

// 列出全部 slug
export const twServiceSlugs = groq`
*[_type == "twServiceDetail" && defined(slug.current)]{
  "slug": slug.current
}
`;
