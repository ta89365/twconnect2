// apps/web/src/lib/queries/twServices.ts
import { groq } from "next-sanity";

export type Lang = "jp" | "zh" | "en";

/**
 * 1) 詳情（支援新版分段費用表 + 舊 feesFlat* fallback）
 *
 * - title 支援：title 可能是單語 string 或多語 object，最後一個參數加上 title 作為保底
 * - background/challenges/services/serviceFlow/scheduleExample：維持你原本的多語結構
 * - 新增 feesSectionTitle
 * - 新增 subsidiaryPlans / branchSupport / repOfficeSupport / accountingTaxSupport / valueAddedServices
 * - 保留舊 feesFlatJp/Zh/En（自動依 $lang 取對應陣列）
 */
export const twServiceDetailBySlug = groq`
*[_type in ["twServiceDetail","twService","service"] && slug.current == $slug][0]{
  _id,
  "slug": slug.current,

  // title 可能是 object 也可能是 string
  "title": coalesce(title[$lang], title.jp, title.zh, title.en, title),

  coverImage{
    ...,
    "url": asset->url
  },

  // 多語內容
  "background": coalesce(background[$lang], background.jp, background.zh, background.en),
  "challenges": coalesce(challenges[$lang], challenges.jp, challenges.zh, challenges.en),

  "services": {
    "items":    coalesce(services[$lang], services.jp, services.zh, services.en),
    "keywords": coalesce(services.keywords[$lang], services.keywords.jp, services.keywords.zh, services.keywords.en)
  },

  "serviceFlow": coalesce(serviceFlow[$lang], serviceFlow.jp, serviceFlow.zh, serviceFlow.en),
  "scheduleExample": coalesce(scheduleExample[$lang], scheduleExample.jp, scheduleExample.zh, scheduleExample.en),

  // 新：費用區塊標題
  "feesSectionTitle": coalesce(feesSectionTitle[$lang], feesSectionTitle.jp, feesSectionTitle.zh, feesSectionTitle.en),

  // 新：I. 子公司（方案列）
  "subsidiaryPlans": subsidiaryPlans[]{
    "plan":      coalesce(plan[$lang], plan.jp, plan.zh, plan.en),
    "services":  coalesce(services[$lang], services.jp, services.zh, services.en),
    "who":       coalesce(who[$lang], who.jp, who.zh, who.en),
    feeJpy,
    "notes":     coalesce(notes[$lang], notes.jp, notes.zh, notes.en)
  },

  // 新：II. 分公司（行列）
  "branchSupport": branchSupport[]{
    "name":      coalesce(name[$lang], name.jp, name.zh, name.en),
    "details":   coalesce(details[$lang], details.jp, details.zh, details.en),
    "idealFor":  coalesce(idealFor[$lang], idealFor.jp, idealFor.zh, idealFor.en),
    feeJpy,
    "notes":     coalesce(notes[$lang], notes.jp, notes.zh, notes.en)
  },

  // 新：III. 辦事處（行列）
  "repOfficeSupport": repOfficeSupport[]{
    "name":      coalesce(name[$lang], name.jp, name.zh, name.en),
    "details":   coalesce(details[$lang], details.jp, details.zh, details.en),
    "idealFor":  coalesce(idealFor[$lang], idealFor.jp, idealFor.zh, idealFor.en),
    feeJpy,
    "notes":     coalesce(notes[$lang], notes.jp, notes.zh, notes.en)
  },

  // 新：IV. 會計稅務（行列）
  "accountingTaxSupport": accountingTaxSupport[]{
    "name":      coalesce(name[$lang], name.jp, name.zh, name.en),
    "details":   coalesce(details[$lang], details.jp, details.zh, details.en),
    "idealFor":  coalesce(idealFor[$lang], idealFor.jp, idealFor.zh, idealFor.en),
    feeJpy,
    "notes":     coalesce(notes[$lang], notes.jp, notes.zh, notes.en)
  },

  // 新：V. 加值服務（行列）
  "valueAddedServices": valueAddedServices[]{
    "name":      coalesce(name[$lang], name.jp, name.zh, name.en),
    "details":   coalesce(details[$lang], details.jp, details.zh, details.en),
    "idealFor":  coalesce(idealFor[$lang], idealFor.jp, idealFor.zh, idealFor.en),
    feeJpy,
    "notes":     coalesce(notes[$lang], notes.jp, notes.zh, notes.en)
  },

  // 舊：扁平費用表（若仍有使用，依語系自動回傳對應陣列）
  "feesFlat": select(
    $lang == "jp" => feesFlatJp[],
    $lang == "zh" => feesFlatZh[],
    $lang == "en" => feesFlatEn[],
    true => coalesce(feesFlatJp, feesFlatZh, feesFlatEn)[]
  ),

  // CTA
  "ctaLabel": coalesce(ctaLabel[$lang], ctaLabel.jp, ctaLabel.zh, ctaLabel.en),
  ctaLink
}
`;

/**
 * 2) 清單
 * - title 同樣處理單語/多語共存
 * - excerpt 取 background 多語
 */
export const twServiceList = groq`
*[_type in ["twServiceDetail","twService","service"]] | order(coalesce(title[$lang], title.jp, title.zh, title.en, title) asc){
  _id,
  "slug": slug.current,
  "title": coalesce(title[$lang], title.jp, title.zh, title.en, title),
  "excerpt": coalesce(background[$lang], background.jp, background.zh, background.en),
  coverImage{
    ...,
    "url": asset->url
  }
}
`;

/**
 * 3) slugs
 */
export const twServiceSlugs = groq`
*[_type in ["twServiceDetail","twService","service"] && defined(slug.current)]{
  "slug": slug.current
}
`;
