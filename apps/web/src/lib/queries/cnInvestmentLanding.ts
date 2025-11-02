// apps/web/src/lib/queries/cnInvestmentLanding.ts
export const cnInvestmentLandingQuery = /* groq */ `
*[_type == "cnInvestmentLanding"][0]{
  _id,
  "slug": slug.current,
  titleZh,
  taglineEn,
  heroImage{
    "assetId": asset->_id,
    "url": asset->url,
    "alt": coalesce(alt, ""),
    hotspot, crop,
    "dimensions": asset->metadata.dimensions{width,height,aspectRatio},
    "lqip": asset->metadata.lqip
  },
  whyZh[],
  principleZh,
  regulationDefinitionZh[],
  authorities[]{ nameZh, nameEn, url },
  reviewFocus[] | order(order asc){ order, titleZh, bodyZh },
  doubtsZh[],
  contactFormHref,
  processSteps[] | order(order asc){ order, titleZh, bodyZh[] },
  timelineZh,
  advantagesIntroZh[],
  serviceBulletsZh[]{ textZh },
  teamImage{
    "assetId": asset->_id,
    "url": asset->url,
    "alt": coalesce(alt, ""),
    hotspot, crop,
    "dimensions": asset->metadata.dimensions{width,height,aspectRatio},
    "lqip": asset->metadata.lqip
  },
  faq[]{ qZh, aZh[] },

  recommended[]{
    titleZh,
    summaryZh,
    ctaLabelZh,

    // 內部文章必要資訊（前端如需自組路由也可用）
    "internal": internalPost->{
      _id, _type, "slug": slug.current, channel
    },

    // 原始 external 值（可能是 http(s)、/ 相對路徑、或 #）
    "external": externalUrl,

    // 安全 href：只有當內部 slug 存在才組內部連結，否則回 external
    "href": select(
      defined(internalPost->slug.current) =>
        "/" + coalesce(internalPost->channel, "news") + "/" + internalPost->slug.current,
      defined(externalUrl) => externalUrl,
      null
    ),

    "cover": internalPost->mainImage{
      "assetId": asset->_id,
      "url": asset->url,
      "alt": coalesce(alt, ""),
      "lqip": asset->metadata.lqip
    }
  },

  contactEmail,
  contactLine,
  bookingHref
}
`
