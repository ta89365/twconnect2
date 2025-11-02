// File: apps/web/src/lib/queries/mainlandInvestmentGuide.ts

/** Shared hero image projection */
const IMG = `
  "assetId": heroImage.asset->_id,
  "url": heroImage.asset->url,
  "alt": coalesce(heroImage.alt, ""),
  hotspot,
  crop,
  "dimensions": heroImage.asset->metadata.dimensions{width,height,aspectRatio},
  "lqip": heroImage.asset->metadata.lqip
`;

/** Entrance list */
// 重要修正：移除 coalesce()，改用 $limit 參數，呼叫方必須提供整數
export const mainlandInvestmentGuideEntrance = /* groq */ `
*[_type == "mainlandInvestmentGuide"] | order(publishDate desc)[0...$limit]{
  "id": _id,
  "slug": slug.current,
  "publishDate": publishDate,
  "title": title,
  "subtitle": subtitle,
  "heroImage": { ${IMG} }
}
`;

/** Single article by slug */
export const mainlandInvestmentGuideBySlug = /* groq */ `
*[_type == "mainlandInvestmentGuide" && slug.current == $slug][0]{
  "id": _id,
  "slug": slug.current,
  "publishDate": publishDate,
  "title": title,
  "subtitle": subtitle,
  "intro": intro,
  "heroImage": { ${IMG} },
  "sections": sections[]{
    "heading": heading,
    "content": content,
    "tips": tips
  },
  "conclusion": conclusion,
  "contactEmail": contactEmail,
  "contactLine": contactLine
}
`;
