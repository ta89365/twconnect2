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

export const twServiceDetailBySlug = groq`
*[
  _type in ["twServiceDetail","twService","service"]
  && slug.current == $slug
  && !(_id in path("drafts.**"))
]
| order(_updatedAt desc)[0]{
  _id,
  "slug": slug.current,

  // 單一標題（已選語系）
  "title": ${pickTitleByLang},

  coverImage{ ..., "url": asset->url },

  "background": coalesce(background[$lang], background.jp, background.zh, background.en),
  "challenges": coalesce(challenges[$lang], challenges.jp, challenges.zh, challenges.en),

  "services": {
    "items":    coalesce(services[$lang], services.jp, services.zh, services.en),
    "keywords": coalesce(services.keywords[$lang], services.keywords.jp, services.keywords.zh, services.keywords.en)
  },

  // 新版 serviceFlow：每個步驟有 title 與 description 兩行
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

  "scheduleExample": coalesce(scheduleExample[$lang], scheduleExample.jp, scheduleExample.zh, scheduleExample.en),

  // ====== 新增：各表格多語標題（已選語系） ======
  "subsidiaryTitle":    coalesce(subsidiaryTitle[$lang],    subsidiaryTitle.jp,    subsidiaryTitle.zh,    subsidiaryTitle.en),
  "branchTitle":        coalesce(branchTitle[$lang],        branchTitle.jp,        branchTitle.zh,        branchTitle.en),
  "repOfficeTitle":     coalesce(repOfficeTitle[$lang],     repOfficeTitle.jp,     repOfficeTitle.zh,     repOfficeTitle.en),
  "accountingTaxTitle": coalesce(accountingTaxTitle[$lang], accountingTaxTitle.jp, accountingTaxTitle.zh, accountingTaxTitle.en),
  "valueAddedTitle":    coalesce(valueAddedTitle[$lang],    valueAddedTitle.jp,    valueAddedTitle.zh,    valueAddedTitle.en),

  // ====== 表格資料 ======
  "subsidiaryPlans": subsidiaryPlans[]{
    "plan":     coalesce(plan[$lang], plan.jp, plan.zh, plan.en),
    "services": coalesce(services[$lang], services.jp, services.zh, services.en),
    "who":      coalesce(who[$lang], who.jp, who.zh, who.en),
    feeJpy,
    "notes":    coalesce(notes[$lang], notes.jp, notes.zh, notes.en)
  },

  "branchSupport": branchSupport[]{
    "name":     coalesce(name[$lang], name.jp, name.zh, name.en),
    "details":  coalesce(details[$lang], details.jp, details.zh, details.en),
    "idealFor": coalesce(idealFor[$lang], idealFor.jp, idealFor.zh, idealFor.en),
    feeJpy,
    "notes":    coalesce(notes[$lang], notes.jp, notes.zh, notes.en)
  },

  "repOfficeSupport": repOfficeSupport[]{
    "name":     coalesce(name[$lang], name.jp, name.zh, name.en),
    "details":  coalesce(details[$lang], details.jp, details.zh, details.en),
    "idealFor": coalesce(idealFor[$lang], idealFor.jp, idealFor.zh, idealFor.en),
    feeJpy,
    "notes":    coalesce(notes[$lang], notes.jp, notes.zh, notes.en)
  },

  "accountingTaxSupport": accountingTaxSupport[]{
    "name":     coalesce(name[$lang], name.jp, name.zh, name.en),
    "details":  coalesce(details[$lang], details.jp, details.zh, details.en),
    "idealFor": coalesce(idealFor[$lang], idealFor.jp, idealFor.zh, idealFor.en),
    feeJpy,
    "notes":    coalesce(notes[$lang], notes.jp, notes.zh, notes.en)
  },

  "valueAddedServices": valueAddedServices[]{
    "name":     coalesce(name[$lang], name.jp, name.zh, name.en),
    "details":  coalesce(details[$lang], details.jp, details.zh, details.en),
    "idealFor": coalesce(idealFor[$lang], idealFor.jp, idealFor.zh, idealFor.en),
    feeJpy,
    "notes":    coalesce(notes[$lang], notes.jp, notes.zh, notes.en)
  },

  // 舊 flat fallback（保留）
  "feesFlat": select(
    $lang == "jp" => feesFlatJp[],
    $lang == "zh" => feesFlatZh[],
    $lang == "en" => feesFlatEn[],
    true => coalesce(feesFlatJp, feesFlatZh, feesFlatEn)[]
  ),

  "ctaLabel": coalesce(ctaLabel[$lang], ctaLabel.jp, ctaLabel.zh, ctaLabel.en),
  ctaLink
}
`;

export const twServiceSlugs = groq`
*[_type in ["twServiceDetail","twService","service"] && defined(slug.current)]{
  "slug": slug.current
}
`;
