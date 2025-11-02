// File: C:\Users\ta893\twconnect2\apps\cms\schemaTypes\queries\cnInvestmentUboGuide.groq.ts
export const cnInvestmentUboGuideQuery = /* groq */ `
*[_type == "cnInvestmentUboGuide" && coalesce(meta.isDraft, false) != true][0]{
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

  // ============ Content Sections ============
  importanceZhCn[],
  legalBasisZhCn[],
  ownershipThresholdZhCn[],
  controlCriteriaZhCn[],
  layeredCalculationZhCn[],
  uboFocusZhCn[],

  // ============ Examples ============
  examples[]{
    titleZhCn,
    scenarioZhCn[],
    conclusionZhCn[]
  },

  // ============ Practical Advice ============
  practicalAdvice[]{
    labelZhCn,
    bodyZhCn[]
  },

  // ============ Conclusion ============
  conclusionZhCn[],

  // ============ Contact ============
  contact{
    email,
    lineId,
    contactNoteZhCn[]
  },

  // ============ Meta ============
  lastUpdatedAt,
  meta{
    isDraft,
    seoDescription
  }
}
`;
