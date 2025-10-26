// apps/web/src/lib/queries/challenges.ts
import groq from "groq";

/** 五大痛點：多語（優先日文），含 icon 三種來源與排序 */
export const challengesQueryML = /* groq */ groq`
*[_type == "challenge"] | order(coalesce(order, 999) asc) {
  _id,
  order,
  iconKey,
  "iconImageUrl": coalesce(iconImage.asset->url, ""),
  iconEmoji,
  "title": select(
    $lang == "jp" => coalesce(titleJp, titleEn, titleZh),
    $lang == "zh" => coalesce(titleZh, titleEn, titleJp),
    coalesce(titleEn, titleJp, titleZh)
  ),
  "desc": select(
    $lang == "jp" => coalesce(descJp, descEn, descZh),
    $lang == "zh" => coalesce(descZh, descEn, descJp),
    coalesce(descEn, descJp, descZh)
  )
}
`;
