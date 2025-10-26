import groq from "groq";

/** 依語系回傳標準化後的 Hero 欄位 */
export const heroByLang = groq`
*[_type == "hero"][0]{
  // 圖片與 hotspot
  "bgUrl": coalesce(bgImage.asset->url, ""),
  "hotspot": select(
    defined(bgImage.hotspot) => {"x": bgImage.hotspot.x, "y": bgImage.hotspot.y},
    null
  ),

  // 統一後欄位：依 $lang 自動 fallback
  "heading": select(
    $lang == "jp" => coalesce(headingJp, headingEn, headingZh),
    $lang == "zh" => coalesce(headingZh, headingEn, headingJp),
    coalesce(headingEn, headingJp, headingZh)
  ),
  "subheading": select(
    $lang == "jp" => coalesce(subheadingJp, subheadingEn, subheadingZh),
    $lang == "zh" => coalesce(subheadingZh, subheadingEn, subheadingJp),
    coalesce(subheadingEn, subheadingJp, subheadingZh)
  ),
  "subtitle": select(
    $lang == "jp" => coalesce(subtitleJp, subtitleEn, subtitleZh),
    $lang == "zh" => coalesce(subtitleZh, subtitleEn, subtitleJp),
    coalesce(subtitleEn, subtitleJp, subtitleZh)
  ),
  "ctaText": select(
    $lang == "jp" => coalesce(ctaTextJp, ctaTextEn, ctaTextZh),
    $lang == "zh" => coalesce(ctaTextZh, ctaTextEn, ctaTextJp),
    coalesce(ctaTextEn, ctaTextJp, ctaTextZh)
  ),
  ctaHref
}
`;
