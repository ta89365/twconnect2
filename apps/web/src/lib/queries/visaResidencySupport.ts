// apps/web/src/lib/queries/visaResidencySupport.ts

// ---- i18n helpers exported from here for backward-compatibility ----
export type Lang = "jp" | "zh" | "en";

export function resolveLang(sp?: string): Lang {
  const l = (sp ?? "").toLowerCase();
  return l === "jp" || l === "zh" || l === "en" ? (l as Lang) : "jp";
}

// ---- GROQ queries ----
export const visaResidencySupportBySlug = /* groq */ `
*[_type == "visaResidencySupport" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  order,

  // 投影出 asset->url，避免前端拿不到 URL
  "heroImage": heroImage{
    asset->{
      _id,
      url
    },
    hotspot,
    crop
  },

  // 多語標題
  "title": select(
    $lang == "jp" => coalesce(titleJp, titleZh, titleEn),
    $lang == "zh" => coalesce(titleZh, titleJp, titleEn),
    $lang == "en" => coalesce(titleEn, titleJp, titleZh),
    coalesce(titleJp, titleZh, titleEn)
  ),

  // 背景：對應 schema 的 object 欄位 background.{jp, zh, en}
  "background": select(
    $lang == "jp" => coalesce(background.jp, background.zh, background.en),
    $lang == "zh" => coalesce(background.zh, background.jp, background.en),
    $lang == "en" => coalesce(background.en, background.jp, background.zh),
    coalesce(background.jp, background.zh, background.en)
  ),

  // 課題：object challenges.{jp, zh, en}，每個是 array<string>
  "challenges": select(
    $lang == "jp" => coalesce(challenges.jp, challenges.zh, challenges.en),
    $lang == "zh" => coalesce(challenges.zh, challenges.jp, challenges.en),
    $lang == "en" => coalesce(challenges.en, challenges.jp, challenges.zh),
    coalesce(challenges.jp, challenges.zh, challenges.en)
  ),

  // 服務內容：object services.{jp, zh, en}，每個是 array<string>
  "services": select(
    $lang == "jp" => coalesce(services.jp, services.zh, services.en),
    $lang == "zh" => coalesce(services.zh, services.jp, services.en),
    $lang == "en" => coalesce(services.en, services.jp, services.zh),
    coalesce(services.jp, services.zh, services.en)
  ),

  // Incubation Track：object incubationTrack.{jp, zh, en}，每個是 array<string>
  "incubationTrack": select(
    $lang == "jp" => coalesce(incubationTrack.jp, incubationTrack.zh, incubationTrack.en),
    $lang == "zh" => coalesce(incubationTrack.zh, incubationTrack.jp, incubationTrack.en),
    $lang == "en" => coalesce(incubationTrack.en, incubationTrack.jp, incubationTrack.zh),
    coalesce(incubationTrack.jp, incubationTrack.zh, incubationTrack.en)
  ),

  // 服務流程：object serviceFlow.{jp, zh, en}，每個是 array<object>
  "serviceFlow": select(
    $lang == "jp" => coalesce(serviceFlow.jp, serviceFlow.zh, serviceFlow.en),
    $lang == "zh" => coalesce(serviceFlow.zh, serviceFlow.jp, serviceFlow.en),
    $lang == "en" => coalesce(serviceFlow.en, serviceFlow.jp, serviceFlow.zh),
    coalesce(serviceFlow.jp, serviceFlow.zh, serviceFlow.en)
  ),

  // 費用：object fees.{jp, zh, en}，每個是 text/string
  "fees": select(
    $lang == "jp" => coalesce(fees.jp, fees.zh, fees.en),
    $lang == "zh" => coalesce(fees.zh, fees.jp, fees.en),
    $lang == "en" => coalesce(fees.en, fees.jp, fees.zh),
    coalesce(fees.jp, fees.zh, fees.en)
  ),

  // CTA：object ctaLabel.{jp, zh, en}，每個是 string
  "ctaLabel": select(
    $lang == "jp" => coalesce(ctaLabel.jp, ctaLabel.zh, ctaLabel.en),
    $lang == "zh" => coalesce(ctaLabel.zh, ctaLabel.jp, ctaLabel.en),
    $lang == "en" => coalesce(ctaLabel.en, ctaLabel.jp, ctaLabel.zh),
    coalesce(ctaLabel.jp, ctaLabel.zh, ctaLabel.en)
  )
}
`;

export const visaResidencySlugs = /* groq */ `
*[_type == "visaResidencySupport" && defined(slug.current)]{
  "slug": slug.current
}
`;
