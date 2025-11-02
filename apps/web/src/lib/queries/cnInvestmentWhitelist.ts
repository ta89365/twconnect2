// File: apps/web/src/lib/queries/cnInvestmentWhitelist.ts
import groq from "groq";

export const cnInvestmentWhitelistQuery = groq`
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
export type WhitelistDoc = {
  _id: string;
  slug?: string;
  heroTitleZhCn?: string;
  heroSubtitleZhCn?: string;
  heroImage?: {
    assetId?: string;
    url?: string;
    alt?: string;
    lqip?: string;
    hotspot?: any;
    crop?: any;
    dimensions?: { width: number; height: number; aspectRatio: number };
  };
  introZhCn?: any[];
  policyBackgroundZhCn?: any[];
  categories?: Array<{
    key?: "manufacturing" | "services" | "public_infrastructure" | string;
    titleZhCn?: string;
    introZhCn?: any[];
    allowedExamplesZhCn?: string[];
    restrictionsZhCn?: any[];
  }>;
  reviewFocus?: Array<{ order: number; titleZhCn?: string; bodyZhCn?: any[] }>;
  pitfalls?: Array<{ titleZhCn?: string; adviceZhCn?: any[] }>;
  summaryZhCn?: any[];
  contact?: { email?: string; lineId?: string; lineUrl?: string; noteZhCn?: any[] };
  meta?: { updatedAt?: string; sourceUrl?: string; isDraft?: boolean };
};
