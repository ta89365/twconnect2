// apps/web/src/lib/queries/contact.ts
import groq from "groq";

/**
 * 依語系回傳 Contact 區塊內容
 * 備註：schema 欄位為 headingZh/headingJp/headingEn、bodyZh/bodyJp/bodyEn、lineId、email、qrImage
 */
export const contactByLang = groq`
*[_type == "contactSection"][0]{
  "heading": select(
    $lang == "zh" => coalesce(headingZh, headingEn, headingJp),
    $lang == "jp" => coalesce(headingJp, headingEn, headingZh),
    coalesce(headingEn, headingZh, headingJp)
  ),
  "body": select(
    $lang == "zh" => coalesce(bodyZh, bodyEn, bodyJp),
    $lang == "jp" => coalesce(bodyJp, bodyEn, bodyZh),
    coalesce(bodyEn, bodyZh, bodyJp)
  ),
  lineId,
  email,
  "qrUrl": qrImage.asset->url
}`;
