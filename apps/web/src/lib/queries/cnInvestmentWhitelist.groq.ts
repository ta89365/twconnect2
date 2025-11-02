// File: apps/cms/schemaTypes/queries/cnInvestmentWhitelist.groq.ts
export const cnInvestmentWhitelistQuery = /* groq */ `
*[_type == "cnInvestmentWhitelist" && coalesce(meta.isDraft, false) != true][0]{
  _id,
  "slug": slug.current,
  heroTitleZhCn,
  heroSubtitleZhCn,
  heroImage{
    "assetId": asset->_id,
    "url": asset->url,
    "alt": coalesce(alt, ""),
    hotspot, crop,
    "dimensions": asset->metadata.dimensions{width,height,aspectRatio},
    "lqip": asset->metadata.lqip
  },
  introZhCn[],
  policyBackgroundZhCn[],
  categories[]{
    key,
    titleZhCn,
    introZhCn[],
    allowedExamplesZhCn,
    restrictionsZhCn[]
  },
  reviewFocus[] | order(order asc){
    order, titleZhCn, bodyZhCn[]
  },
  pitfalls[]{
    titleZhCn, adviceZhCn[]
  },
  summaryZhCn[],
  contact{
    email, lineId, lineUrl, noteZhCn[]
  },
  meta{
    updatedAt, sourceUrl, isDraft
  }
}
`;
