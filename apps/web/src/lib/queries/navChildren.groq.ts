// apps/web/src/lib/queries/navChildren.groq.ts
import groq from "groq";

/** 與首頁卡片一致：直接讀 service 集合 */
export const servicesNavChildrenQuery = /* groq */ groq`
*[_type == "service" && defined(href)] | order(order asc){
  _id,
  order,
  "href": href,
  "label": select(
    $lang == "jp" => coalesce(titleJp, titleEn, titleZh),
    $lang == "zh" => coalesce(titleZh, titleEn, titleJp),
    $lang == "zh-cn" => coalesce(titleZh, titleEn, titleJp),
    coalesce(titleEn, titleJp, titleZh)
  )
}
`;
