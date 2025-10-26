// apps/web/src/lib/queries/overseasRelocation.ts

// 1) 服務詳情：依 slug 取回，多語 fallback（jp → zh → en 或依 $lang 決定順序）
//    並帶出 hero 圖片完整資訊（url、alt、hotspot、crop、尺寸、lqip）
export const overseasRelocationDetailBySlug = /* groq */ `
*[_type == "overseasRelocationSupport" && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  order,

  // Hero image
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

  // Multilang fields with fallback
  "title": select(
    $lang == "jp" => coalesce(titleJp, titleZh, titleEn),
    $lang == "zh" => coalesce(titleZh, titleJp, titleEn),
    $lang == "en" => coalesce(titleEn, titleJp, titleZh),
    coalesce(titleJp, titleZh, titleEn)
  ),

  "background": select(
    $lang == "jp" => coalesce(backgroundJp, backgroundZh, backgroundEn),
    $lang == "zh" => coalesce(backgroundZh, backgroundJp, backgroundEn),
    $lang == "en" => coalesce(backgroundEn, backgroundJp, backgroundZh),
    coalesce(backgroundJp, backgroundZh, backgroundEn)
  ),

  "challenges": select(
    $lang == "jp" => coalesce(challengesJp, challengesZh, challengesEn),
    $lang == "zh" => coalesce(challengesZh, challengesJp, challengesEn),
    $lang == "en" => coalesce(challengesEn, challengesJp, challengesZh),
    coalesce(challengesJp, challengesZh, challengesEn)
  ),

  "services": select(
    $lang == "jp" => coalesce(servicesJp, servicesZh, servicesEn),
    $lang == "zh" => coalesce(servicesZh, servicesJp, servicesEn),
    $lang == "en" => coalesce(servicesEn, servicesJp, servicesZh),
    coalesce(servicesJp, servicesZh, servicesEn)
  ),

  "flowSteps": select(
    $lang == "jp" => coalesce(flowStepsJp, flowStepsZh, flowStepsEn),
    $lang == "zh" => coalesce(flowStepsZh, flowStepsJp, flowStepsEn),
    $lang == "en" => coalesce(flowStepsEn, flowStepsJp, flowStepsZh),
    coalesce(flowStepsJp, flowStepsZh, flowStepsEn)
  ),

  "fees": select(
    $lang == "jp" => coalesce(feesJp, feesZh, feesEn),
    $lang == "zh" => coalesce(feesZh, feesJp, feesEn),
    $lang == "en" => coalesce(feesEn, feesJp, feesZh),
    coalesce(feesJp, feesZh, feesEn)
  ),

  "ctaLabel": select(
    $lang == "jp" => coalesce(ctaLabelJp, ctaLabelZh, ctaLabelEn),
    $lang == "zh" => coalesce(ctaLabelZh, ctaLabelJp, ctaLabelEn),
    $lang == "en" => coalesce(ctaLabelEn, ctaLabelJp, ctaLabelZh),
    coalesce(ctaLabelJp, ctaLabelZh, ctaLabelEn)
  )
}
`;

// 2) Slug 列表（給 SSG 用）
//    如需判斷是否已有圖片，可一併回傳 hasHero 與預覽 url
export const overseasRelocationSlugs = /* groq */ `
*[_type == "overseasRelocationSupport" && defined(slug.current)]{
  "slug": slug.current,
  "hasHero": defined(heroImage.asset),
  "heroUrl": heroImage.asset->url
}
`;
