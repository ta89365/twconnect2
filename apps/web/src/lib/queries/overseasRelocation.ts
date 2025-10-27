export const overseasRelocationDetailBySlug = /* groq */ `
*[
  _type == "overseasRelocationSupport" &&
  (slug.current == $slug || !defined($slug))
]|order(_updatedAt desc)[0]{
  _id,
  "slug": slug.current,
  order,

  "heroImage": heroImage{
    "assetId": asset->_id,
    "url": asset->url,
    "alt": coalesce(alt, ""),
    hotspot,
    crop,
    "lqip": asset->metadata.lqip
  },
  "heroUrl": heroImage.asset->url,
  "heroSrc": coalesce(heroImage.asset->url, asset->url),
  "hasHero": defined(heroImage.asset),
  "imageMeta": heroImage.asset->metadata{ "lqip": lqip, "dim": dimensions },

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
    $lang == "jp" => coalesce(challengesJp, challengesZh, challengesEn, []),
    $lang == "zh" => coalesce(challengesZh, challengesJp, challengesEn, []),
    $lang == "en" => coalesce(challengesEn, challengesJp, challengesZh, []),
    coalesce(challengesJp, challengesZh, challengesEn, [])
  ),

  "services": select(
    $lang == "jp" => coalesce(servicesJp, servicesZh, servicesEn, []),
    $lang == "zh" => coalesce(servicesZh, servicesJp, servicesEn, []),
    $lang == "en" => coalesce(servicesEn, servicesJp, servicesZh, []),
    coalesce(servicesJp, servicesZh, servicesEn, [])
  ),

  "flowSteps": select(
    $lang == "jp" => coalesce(flowStepsJp, flowStepsZh, flowStepsEn, []),
    $lang == "zh" => coalesce(flowStepsZh, flowStepsJp, flowStepsEn, []),
    $lang == "en" => coalesce(flowStepsEn, flowStepsJp, flowStepsZh, []),
    coalesce(flowStepsJp, flowStepsZh, flowStepsEn, [])
  ),

  "fees": select(
    $lang == "jp" => coalesce(feesJp, feesZh, feesEn, []),
    $lang == "zh" => coalesce(feesZh, feesJp, feesEn, []),
    $lang == "en" => coalesce(feesEn, feesJp, feesZh, []),
    coalesce(feesJp, feesZh, feesEn, [])
  ),

  "ctaLabel": select(
    $lang == "jp" => coalesce(ctaLabelJp, ctaLabelZh, ctaLabelEn),
    $lang == "zh" => coalesce(ctaLabelZh, ctaLabelJp, ctaLabelEn),
    $lang == "en" => coalesce(ctaLabelEn, ctaLabelJp, ctaLabelZh),
    coalesce(ctaLabelJp, ctaLabelZh, ctaLabelEn)
  )
}
`;
