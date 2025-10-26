// apps/web/src/lib/queries/servicesLanding.ts
import { groq } from "next-sanity";

/**
 * 給 <ServiceSection/> 使用的扁平資料。
 * 若你的 schema 欄位命名不同，改成對應名稱即可。
 */
export const servicesLandingByLang = groq`
*[_type == "service" && !(_id in path("drafts.**"))] | order(order asc) {
  _id,
  order,
  // 目標連結：先用 href/route，否則退回 /services/[slug]
  "href": coalesce(href, route, select(defined(slug.current) => "/services/"+slug.current, null)),
  // 圖片來源：依序嘗試 cardImage / image / thumbnail
  "imageUrl": coalesce(
    cardImage.asset->url,
    image.asset->url,
    thumbnail.asset->url
  ),
  // 多語標題：jp/zh/en，找不到退回通用 title
  "title": select(
    $lang == "jp" => coalesce(titleJp, titleJa, title),
    $lang == "zh" => coalesce(titleZh, titleCn, title),
    $lang == "en" => coalesce(titleEn, title),
    title
  ),
  // 多語描述：jp/zh/en，找不到退回 description/desc
  "desc": select(
    $lang == "jp" => coalesce(descJp, descJa, description, desc),
    $lang == "zh" => coalesce(descZh, descCn, description, desc),
    $lang == "en" => coalesce(descEn, description, desc),
    coalesce(description, desc)
  )
}
`;
