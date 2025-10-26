import groq from "groq";

export const crossBorderByLang = /* groq */ groq`
*[_type == "crossBorderSection"][0]{
  // 背景圖
  "bgUrl": coalesce(bgImage.asset->url, ""),

  // 主標題
  "heading": select(
    $lang == "jp" => coalesce(headingJp, headingZh, headingEn),
    $lang == "zh" => coalesce(headingZh, headingJp, headingEn),
    coalesce(headingEn, headingJp, headingZh)
  ),

  // 兩條標語帶（對應 para1 / para2）
  "lead1": select(
    $lang == "jp" => para1Jp,
    $lang == "zh" => para1Zh,
    para1En
  ),
  "lead2": select(
    $lang == "jp" => para2Jp,
    $lang == "zh" => para2Zh,
    para2En
  ),

  // 內文段落（對應 para3）
  "body": select(
    $lang == "jp" => para3Jp,
    $lang == "zh" => para3Zh,
    para3En
  ),

  // CTA
  "ctaText": select(
    $lang == "jp" => coalesce(ctaTextJp, ctaTextZh, ctaTextEn),
    $lang == "zh" => coalesce(ctaTextZh, ctaTextJp, ctaTextEn),
    coalesce(ctaTextEn, ctaTextJp, ctaTextZh)
  ),
  "ctaHref": coalesce(ctaHref, "/")
}
`;
