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

    "internal": internalPost->{
      _id, _type, "slug": slug.current, channel
    },

    "external": externalUrl,

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
