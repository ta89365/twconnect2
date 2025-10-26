import groq from "groq";

/** Service：多語 + 圖片 */
export const servicesQueryML = /* groq */ groq`
*[_type == "service"] | order(order asc) {
  _id,
  order,
  href,
  "imageUrl": coalesce(image.asset->url, ""),
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
