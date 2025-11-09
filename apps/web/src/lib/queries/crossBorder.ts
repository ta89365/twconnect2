import groq from "groq";

export const crossBorderByLang = groq`
*[_type == "crossBorderSection"][0]{
  "bgUrl": coalesce(bgImage.asset->url, ""),

  "heading": select(
    $lang == "jp" => coalesce(headingJp, headingZh, headingEn),
    $lang == "zh" => coalesce(headingZh, headingJp, headingEn),
    coalesce(headingEn, headingJp, headingZh)
  ),

  "lead1": select(
    $lang == "jp" => coalesce(para1Jp, ""),
    $lang == "zh" => coalesce(para1Zh, ""),
    coalesce(para1En, "")
  ),
  "lead2": select(
    $lang == "jp" => coalesce(para2Jp, ""),
    $lang == "zh" => coalesce(para2Zh, ""),
    coalesce(para2En, "")
  ),

  "body": select(
    $lang == "jp" => coalesce(para3Jp, ""),
    $lang == "zh" => coalesce(para3Zh, ""),
    coalesce(para3En, "")
  ),

  "ctaText": select(
    $lang == "jp" => coalesce(ctaTextJp, ctaTextZh, ctaTextEn),
    $lang == "zh" => coalesce(ctaTextZh, ctaTextJp, ctaTextEn),
    coalesce(ctaTextEn, ctaTextJp, ctaTextZh)
  ),
  "ctaHref": coalesce(ctaHref, "/"),

  "leftPillar": {
    "title": select(
      $lang == "jp" => coalesce(leftPillar.titleJp, leftPillar.titleZh, leftPillar.titleEn),
      $lang == "zh" => coalesce(leftPillar.titleZh, leftPillar.titleJp, leftPillar.titleEn),
      coalesce(leftPillar.titleEn, leftPillar.titleJp, leftPillar.titleZh)
    ),
    "items": select(
      $lang == "jp" => coalesce(leftPillar.itemsJp, []),
      $lang == "zh" => coalesce(leftPillar.itemsZh, []),
      coalesce(leftPillar.itemsEn, [])
    ),
    "ctaText": select(
      $lang == "jp" => coalesce(leftPillar.ctaTextJp, leftPillar.ctaTextZh, leftPillar.ctaTextEn),
      $lang == "zh" => coalesce(leftPillar.ctaTextZh, leftPillar.ctaTextJp, leftPillar.ctaTextEn),
      coalesce(leftPillar.ctaTextEn, leftPillar.ctaTextJp, leftPillar.ctaTextZh)
    ),
    "href": coalesce(leftPillar.ctaHref, "")
  },

  "rightPillar": {
    "title": select(
      $lang == "jp" => coalesce(rightPillar.titleJp, rightPillar.titleZh, rightPillar.titleEn),
      $lang == "zh" => coalesce(rightPillar.titleZh, rightPillar.titleJp, rightPillar.titleEn),
      coalesce(rightPillar.titleEn, rightPillar.titleJp, rightPillar.titleZh)
    ),
    "items": select(
      $lang == "jp" => coalesce(rightPillar.itemsJp, []),
      $lang == "zh" => coalesce(rightPillar.itemsZh, []),
      coalesce(rightPillar.itemsEn, [])
    ),
    "ctaText": select(
      $lang == "jp" => coalesce(rightPillar.ctaTextJp, rightPillar.ctaTextZh, rightPillar.ctaTextEn),
      $lang == "zh" => coalesce(rightPillar.ctaTextZh, rightPillar.ctaTextJp, rightPillar.ctaTextEn),
      coalesce(rightPillar.ctaTextEn, rightPillar.ctaTextJp, rightPillar.ctaTextZh)
    ),
    "href": coalesce(rightPillar.ctaHref, "")
  }
}
`;
