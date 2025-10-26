import groq from "groq";

export const siteSettingsByLang = groq`*[_type == "siteSettings"][0]{
  "logoUrl": coalesce(
    logo.asset->url,
    logo.image.asset->url,
    brand.logo.asset->url,
    header.logo.asset->url,
    ""
  ),

  "title": select(
    $lang == "zh" => coalesce(titleZh, titleEn, titleJp, title),
    $lang == "jp" => coalesce(titleJp, titleEn, titleZh, title),
    coalesce(titleEn, titleZh, titleJp, title)
  ),

  "logoText": coalesce(
    select(
      $lang == "jp" => coalesce(titleJp, siteNameJp, brandNameJp, header.titleJp, headerSubJp, taglineJp, sloganJp, companyNameJp),
      $lang == "zh" => coalesce(titleZh, siteNameZh, brandNameZh, header.titleZh, headerSubZh, taglineZh, sloganZh, companyNameZh),
      null
    ),
    siteName, siteTitle, brandName, header.title, headerSub, tagline, slogan, companyName, title, "TW Connect"
  ),

  "navigation": (
    select(
      count(navigation[]) > 0 => navigation[],
      count(header.navigation[]) > 0 => header.navigation[],
      count(navItems[]) > 0 => navItems[],
      count(nav.items[]) > 0 => nav.items[],
      count(menu.items[]) > 0 => menu.items[],
      count(primaryNav[]) > 0 => primaryNav[],
      []
    )
  ){
    "label": select(
      $lang == "jp" => coalesce(labelJp, labelJa, labelJP, titleJp, nameJp, nameJa, labelEn, labelZh, label, title, name),
      $lang == "zh" => coalesce(labelZh, labelCN, labelTw, titleZh, nameZh, labelEn, labelJp, label, title, name),
      coalesce(labelEn, titleEn, nameEn, label, title, name)
    ),
    "href": coalesce(href, url, link, path, "/" + slug.current),
    "external": coalesce(external, isExternal, false),
    "order": coalesce(order, sortOrder, position, idx, 999)
  }[defined(label) && defined(href)] | order(order asc)
}`;
