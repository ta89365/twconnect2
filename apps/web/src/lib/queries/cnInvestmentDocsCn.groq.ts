// File: apps/web/src/lib/queries/cnInvestmentDocsCn.groq.ts
export const cnInvestmentDocsCnQuery = /* groq */ `
*[_type == "cnInvestmentDocsCn"][0]{
  _id,
  "slug": slug.current,
  meta{
    isDraft,
    lastReviewedAt
  },
  heroTitleZhCn,
  heroSubtitleZhCn,
  introZhCn[],
  requiredFiles[] | order(order asc){
    order,
    key,
    titleZhCn,
    summaryZhCn,
    detailsZhCn[],
    notesZhCn[]
  },
  commonRejections[] | order(order asc){
    order,
    titleZhCn,
    problemZhCn[],
    recommendationZhCn[],
    legalNotesZhCn[]
  },
  practicalTips[] | order(order asc){
    order,
    titleZhCn,
    bodyZhCn[]
  },
  conclusionZhCn[],
  contact{
    email,
    lineId
  }
}
`;
