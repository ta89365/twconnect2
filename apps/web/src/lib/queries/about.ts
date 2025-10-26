// apps/web/src/lib/queries/about.ts
import groq from "groq";

/** 依語系取得 About（帶 fallback）*/
export const aboutByLang = /* groq */ groq`
*[_type == "aboutSection" && (isActive != false)] | order(order asc)[0]{
  // 核心欄位：依 $lang 取對應語系，並做基本 fallback
  "title": select(
    $lang == "zh" => coalesce(titleZh, titleJp, titleEn),
    $lang == "jp" => coalesce(titleJp, titleZh, titleEn),
    coalesce(titleEn, titleZh, titleJp)
  ),
  "sloganMain": select(
    $lang == "zh" => coalesce(sloganMainZh, sloganMainJp, sloganMainEn),
    $lang == "jp" => coalesce(sloganMainJp, sloganMainZh, sloganMainEn),
    coalesce(sloganMainEn, sloganMainZh, sloganMainJp)
  ),
  "sloganSub": select(
    $lang == "zh" => coalesce(sloganSubZh, sloganSubJp, sloganSubEn),
    $lang == "jp" => coalesce(sloganSubJp, sloganSubZh, sloganSubEn),
    coalesce(sloganSubEn, sloganSubZh, sloganSubJp)
  ),
  "intro": select(
    $lang == "zh" => coalesce(introZh, introJp, introEn),
    $lang == "jp" => coalesce(introJp, introZh, introEn),
    coalesce(introEn, introZh, introJp)
  ),
  "ctaText": select(
    $lang == "zh" => coalesce(ctaTextZh, ctaTextJp, ctaTextEn),
    $lang == "jp" => coalesce(ctaTextJp, ctaTextZh, ctaTextEn),
    coalesce(ctaTextEn, ctaTextZh, ctaTextJp)
  ),
  ctaHref,

  // 圖片（提供 url 與 hotspot/crop，方便前端 <Image> 與裁切）
  "logoUrl": coalesce(logo.asset->url, ""),
  logo{
    crop, hotspot,
    asset->{ _id, url, mimeType, size, metadata{dimensions} }
  },

  "bgUrl": coalesce(bgImage.asset->url, ""),
  bgImage{
    crop, hotspot,
    asset->{ _id, url, mimeType, size, metadata{dimensions} }
  },

  // 便利欄位
  isActive, order
}`;

/** 取得 About 的全語系完整內容（給後台檢視或靜態產生用）*/
export const aboutAllLang = /* groq */ groq`
*[_type == "aboutSection"] | order(order asc)[0]{
  // 全語系文案
  titleZh, titleJp, titleEn,
  sloganMainZh, sloganMainJp, sloganMainEn,
  sloganSubZh,  sloganSubJp,  sloganSubEn,
  introZh, introJp, introEn,

  // CTA
  ctaTextZh, ctaTextJp, ctaTextEn, ctaHref,

  // 圖片
  "logoUrl": coalesce(logo.asset->url, ""),
  logo{ crop, hotspot, asset->{ _id, url, mimeType, size, metadata{dimensions} } },

  "bgUrl": coalesce(bgImage.asset->url, ""),
  bgImage{ crop, hotspot, asset->{ _id, url, mimeType, size, metadata{dimensions} } },

  // 旗標
  isActive, order
}`;
