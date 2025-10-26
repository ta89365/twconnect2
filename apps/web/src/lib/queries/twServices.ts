// apps/web/src/lib/queries/twServices.ts
import { groq } from "next-sanity";

export type Lang = "jp" | "zh" | "en";

// 1) 詳情
export const twServiceDetailBySlug = groq`
*[_type in ["twServiceDetail","twService","service"] && slug.current == $slug][0]{
  _id,
  "slug": slug.current,
  "title": coalesce(title[$lang], title.jp, title.zh, title.en),
  coverImage{
    ...,
    "url": asset->url
  },
  "background": coalesce(background[$lang], background.jp, background.zh, background.en),
  "challenges": coalesce(challenges[$lang], challenges.jp, challenges.zh, challenges.en),
  "services": {
    "items":    coalesce(services[$lang], services.jp, services.zh, services.en),
    "keywords": coalesce(services.keywords[$lang], services.keywords.jp, services.keywords.zh, services.keywords.en)
  },
  "serviceFlow": coalesce(serviceFlow[$lang], serviceFlow.jp, serviceFlow.zh, serviceFlow.en),
  "scheduleExample": coalesce(scheduleExample[$lang], scheduleExample.jp, scheduleExample.zh, scheduleExample.en),
  fees[]{
    category,
    entries[]{
      serviceName{ "text": coalesce(@[$lang], @.jp, @.zh, @.en) },
      fee,
      notes{ "text": coalesce(@[$lang], @.jp, @.zh, @.en) }
    }
  },
  "feesFlat": fees[].entries[]{
    "category": ^.^.category,
    "serviceName": coalesce(serviceName[$lang], serviceName.jp, serviceName.zh, serviceName.en),
    fee,
    "notes": coalesce(notes[$lang], notes.jp, notes.zh, notes.en)
  },
  "ctaLabel": coalesce(ctaLabel[$lang], ctaLabel.jp, ctaLabel.zh, ctaLabel.en),
  ctaLink
}
`;

// 2) 清單
export const twServiceList = groq`
*[_type in ["twServiceDetail","twService","service"]] | order(title.en asc){
  _id,
  "slug": slug.current,
  "title": coalesce(title[$lang], title.jp, title.zh, title.en),
  "excerpt": coalesce(background[$lang], background.jp, background.zh, background.en),
  coverImage{
    ...,
    "url": asset->url
  }
}
`;

// 3) slugs
export const twServiceSlugs = groq`
*[_type in ["twServiceDetail","twService","service"] && defined(slug.current)]{
  "slug": slug.current
}
`;
