// File: apps/web/src/lib/queries/globalAdvisoryHub.ts
import { groq } from "next-sanity";

/**
 * Return localized fields by $lang with JP→ZH→EN or ZH→JP→EN fallback depending on $lang.
 * Usage:
 *   const data = await sfetch(globalAdvisoryHubByLang, { lang });
 */
export const globalAdvisoryHubByLang = groq`
*[_type == "globalAdvisoryHub" && enabled == true][0]{
  "slug": slug.current,

  "hero": {
    "title": select(
      $lang == "jp" => coalesce(hero.title.jp, hero.title.zh, hero.title.en),
      $lang == "zh" => coalesce(hero.title.zh, hero.title.jp, hero.title.en),
      $lang == "en" => coalesce(hero.title.en, hero.title.jp, hero.title.zh),
      coalesce(hero.title.zh, hero.title.jp, hero.title.en)
    ),
    "subtitle": select(
      $lang == "jp" => coalesce(hero.subtitle.jp, hero.subtitle.zh, hero.subtitle.en),
      $lang == "zh" => coalesce(hero.subtitle.zh, hero.subtitle.jp, hero.subtitle.en),
      $lang == "en" => coalesce(hero.subtitle.en, hero.subtitle.jp, hero.subtitle.zh),
      coalesce(hero.subtitle.zh, hero.subtitle.jp, hero.subtitle.en)
    ),
    "badge": hero.badge,
    "bgImage": hero.bgImage{
      "url": asset->url,
      alt,
      objectPosition
    }
  },

  "introduction": {
    "lead": select(
      $lang == "jp" => coalesce(introduction.lead.jp, introduction.lead.zh, introduction.lead.en),
      $lang == "zh" => coalesce(introduction.lead.zh, introduction.lead.jp, introduction.lead.en),
      $lang == "en" => coalesce(introduction.lead.en, introduction.lead.jp, introduction.lead.zh),
      coalesce(introduction.lead.zh, introduction.lead.jp, introduction.lead.en)
    ),
    "body": select(
      $lang == "jp" => coalesce(introduction.body.jp, introduction.body.zh, introduction.body.en),
      $lang == "zh" => coalesce(introduction.body.zh, introduction.body.jp, introduction.body.en),
      $lang == "en" => coalesce(introduction.body.en, introduction.body.jp, introduction.body.zh),
      coalesce(introduction.body.zh, introduction.body.jp, introduction.body.en)
    ),
    "networkBlurb": select(
      $lang == "jp" => coalesce(introduction.networkBlurb.jp, introduction.networkBlurb.zh, introduction.networkBlurb.en),
      $lang == "zh" => coalesce(introduction.networkBlurb.zh, introduction.networkBlurb.jp, introduction.networkBlurb.en),
      $lang == "en" => coalesce(introduction.networkBlurb.en, introduction.networkBlurb.jp, introduction.networkBlurb.zh),
      coalesce(introduction.networkBlurb.zh, introduction.networkBlurb.jp, introduction.networkBlurb.en)
    ),
    "stats": {
      "countriesCount": introduction.stats.countriesCount,
      "regions": introduction.stats.regions
    }
  },

  "challenges": {
    "sectionTitle": select(
      $lang == "jp" => coalesce(challenges.sectionTitle.jp, challenges.sectionTitle.zh, challenges.sectionTitle.en),
      $lang == "zh" => coalesce(challenges.sectionTitle.zh, challenges.sectionTitle.jp, challenges.sectionTitle.en),
      $lang == "en" => coalesce(challenges.sectionTitle.en, challenges.sectionTitle.jp, challenges.sectionTitle.zh),
      coalesce(challenges.sectionTitle.zh, challenges.sectionTitle.jp, challenges.sectionTitle.en)
    ),
    "items": select(
      $lang == "jp" => challenges.items.jp[],
      $lang == "zh" => challenges.items.zh[],
      $lang == "en" => challenges.items.en[],
      challenges.items.zh[]
    )
  },

  "services": {
    "intro": select(
      $lang == "jp" => coalesce(services.intro.jp, services.intro.zh, services.intro.en),
      $lang == "zh" => coalesce(services.intro.zh, services.intro.jp, services.intro.en),
      $lang == "en" => coalesce(services.intro.en, services.intro.jp, services.intro.zh),
      coalesce(services.intro.zh, services.intro.jp, services.intro.en)
    ),

    "financialAdvisory": {
      "pillarTitle": select(
        $lang == "jp" => coalesce(services.financialAdvisory.pillarTitle.jp, services.financialAdvisory.pillarTitle.zh, services.financialAdvisory.pillarTitle.en),
        $lang == "zh" => coalesce(services.financialAdvisory.pillarTitle.zh, services.financialAdvisory.pillarTitle.jp, services.financialAdvisory.pillarTitle.en),
        $lang == "en" => coalesce(services.financialAdvisory.pillarTitle.en, services.financialAdvisory.pillarTitle.jp, services.financialAdvisory.pillarTitle.zh),
        coalesce(services.financialAdvisory.pillarTitle.zh, services.financialAdvisory.pillarTitle.jp, services.financialAdvisory.pillarTitle.en)
      ),
      "items": services.financialAdvisory.items[]{
        "label": select(
          $lang == "jp" => coalesce(label.jp, label.zh, label.en),
          $lang == "zh" => coalesce(label.zh, label.jp, label.en),
          $lang == "en" => coalesce(label.en, label.jp, label.zh),
          coalesce(label.zh, label.jp, label.en)
        ),
        "desc": select(
          $lang == "jp" => coalesce(desc.jp, desc.zh, desc.en),
          $lang == "zh" => coalesce(desc.zh, desc.jp, desc.en),
          $lang == "en" => coalesce(desc.en, desc.jp, desc.zh),
          coalesce(desc.zh, desc.jp, desc.en)
        ),
        icon
      }
    },

    "overseasSupport": {
      "pillarTitle": select(
        $lang == "jp" => coalesce(services.overseasSupport.pillarTitle.jp, services.overseasSupport.pillarTitle.zh, services.overseasSupport.pillarTitle.en),
        $lang == "zh" => coalesce(services.overseasSupport.pillarTitle.zh, services.overseasSupport.pillarTitle.jp, services.overseasSupport.pillarTitle.en),
        $lang == "en" => coalesce(services.overseasSupport.pillarTitle.en, services.overseasSupport.pillarTitle.jp, services.overseasSupport.pillarTitle.zh),
        coalesce(services.overseasSupport.pillarTitle.zh, services.overseasSupport.pillarTitle.jp, services.overseasSupport.pillarTitle.en)
      ),
      "items": services.overseasSupport.items[]{
        "label": select(
          $lang == "jp" => coalesce(label.jp, label.zh, label.en),
          $lang == "zh" => coalesce(label.zh, label.jp, label.en),
          $lang == "en" => coalesce(label.en, label.jp, label.zh),
          coalesce(label.zh, label.jp, label.en)
        ),
        "desc": select(
          $lang == "jp" => coalesce(desc.jp, desc.zh, desc.en),
          $lang == "zh" => coalesce(desc.zh, desc.jp, desc.en),
          $lang == "en" => coalesce(desc.en, desc.jp, desc.zh),
          coalesce(desc.zh, desc.jp, desc.en)
        ),
        icon
      }
    }
  },

  "serviceFlow": {
    "sectionTitle": select(
      $lang == "jp" => coalesce(serviceFlow.sectionTitle.jp, serviceFlow.sectionTitle.zh, serviceFlow.sectionTitle.en),
      $lang == "zh" => coalesce(serviceFlow.sectionTitle.zh, serviceFlow.sectionTitle.jp, serviceFlow.sectionTitle.en),
      $lang == "en" => coalesce(serviceFlow.sectionTitle.en, serviceFlow.sectionTitle.jp, serviceFlow.sectionTitle.zh),
      coalesce(serviceFlow.sectionTitle.zh, serviceFlow.sectionTitle.jp, serviceFlow.sectionTitle.en)
    ),
    "steps": serviceFlow.steps[] | order(stepNo asc){
      stepNo,
      "title": select(
        $lang == "jp" => coalesce(title.jp, title.zh, title.en),
        $lang == "zh" => coalesce(title.zh, title.jp, title.en),
        $lang == "en" => coalesce(title.en, title.jp, title.zh),
        coalesce(title.zh, title.jp, title.en)
      ),
      "desc": select(
        $lang == "jp" => coalesce(desc.jp, desc.zh, desc.en),
        $lang == "zh" => coalesce(desc.zh, desc.jp, desc.en),
        $lang == "en" => coalesce(desc.en, desc.jp, desc.zh),
        coalesce(desc.zh, desc.jp, desc.en)
      ),
      icon
    }
  },

  "feesFinancial": {
    "sectionTitle": select(
      $lang == "jp" => coalesce(feesFinancial.sectionTitle.jp, feesFinancial.sectionTitle.zh, feesFinancial.sectionTitle.en),
      $lang == "zh" => coalesce(feesFinancial.sectionTitle.zh, feesFinancial.sectionTitle.jp, feesFinancial.sectionTitle.en),
      $lang == "en" => coalesce(feesFinancial.sectionTitle.en, feesFinancial.sectionTitle.jp, feesFinancial.sectionTitle.zh),
      coalesce(feesFinancial.sectionTitle.zh, feesFinancial.sectionTitle.jp, feesFinancial.sectionTitle.en)
    ),
    "disclaimer": select(
      $lang == "jp" => coalesce(feesFinancial.disclaimer.jp, feesFinancial.disclaimer.zh, feesFinancial.disclaimer.en),
      $lang == "zh" => coalesce(feesFinancial.disclaimer.zh, feesFinancial.disclaimer.jp, feesFinancial.disclaimer.en),
      $lang == "en" => coalesce(feesFinancial.disclaimer.en, feesFinancial.disclaimer.jp, feesFinancial.disclaimer.zh),
      coalesce(feesFinancial.disclaimer.zh, feesFinancial.disclaimer.jp, feesFinancial.disclaimer.en)
    ),
    "body": select(
      $lang == "jp" => coalesce(feesFinancial.body.jp, feesFinancial.body.zh, feesFinancial.body.en),
      $lang == "zh" => coalesce(feesFinancial.body.zh, feesFinancial.body.jp, feesFinancial.body.en),
      $lang == "en" => coalesce(feesFinancial.body.en, feesFinancial.body.jp, feesFinancial.body.zh),
      coalesce(feesFinancial.body.zh, feesFinancial.body.jp, feesFinancial.body.en)
    ),
    "packages": feesFinancial.packages[]{
      "name": select(
        $lang == "jp" => coalesce(name.jp, name.zh, name.en),
        $lang == "zh" => coalesce(name.zh, name.jp, name.en),
        $lang == "en" => coalesce(name.en, name.jp, name.zh),
        coalesce(name.zh, name.jp, name.en)
      ),
      priceNote,
      "features": select(
        $lang == "jp" => features.jp[],
        $lang == "zh" => features.zh[],
        $lang == "en" => features.en[],
        features.zh[]
      )
    },
    "showContactCta": feesFinancial.showContactCta
  },

  "feesOverseas": {
    "sectionTitle": select(
      $lang == "jp" => coalesce(feesOverseas.sectionTitle.jp, feesOverseas.sectionTitle.zh, feesOverseas.sectionTitle.en),
      $lang == "zh" => coalesce(feesOverseas.sectionTitle.zh, feesOverseas.sectionTitle.jp, feesOverseas.sectionTitle.en),
      $lang == "en" => coalesce(feesOverseas.sectionTitle.en, feesOverseas.sectionTitle.jp, feesOverseas.sectionTitle.zh),
      coalesce(feesOverseas.sectionTitle.zh, feesOverseas.sectionTitle.jp, feesOverseas.sectionTitle.en)
    ),
    "disclaimer": select(
      $lang == "jp" => coalesce(feesOverseas.disclaimer.jp, feesOverseas.disclaimer.zh, feesOverseas.disclaimer.en),
      $lang == "zh" => coalesce(feesOverseas.disclaimer.zh, feesOverseas.disclaimer.jp, feesOverseas.disclaimer.en),
      $lang == "en" => coalesce(feesOverseas.disclaimer.en, feesOverseas.disclaimer.jp, feesOverseas.disclaimer.zh),
      coalesce(feesOverseas.disclaimer.zh, feesOverseas.disclaimer.jp, feesOverseas.disclaimer.en)
    ),
    "body": select(
      $lang == "jp" => coalesce(feesOverseas.body.jp, feesOverseas.body.zh, feesOverseas.body.en),
      $lang == "zh" => coalesce(feesOverseas.body.zh, feesOverseas.body.jp, feesOverseas.body.en),
      $lang == "en" => coalesce(feesOverseas.body.en, feesOverseas.body.jp, feesOverseas.body.zh),
      coalesce(feesOverseas.body.zh, feesOverseas.body.jp, feesOverseas.body.en)
    ),
    "packages": feesOverseas.packages[]{
      "name": select(
        $lang == "jp" => coalesce(name.jp, name.zh, name.en),
        $lang == "zh" => coalesce(name.zh, name.jp, name.en),
        $lang == "en" => coalesce(name.en, name.jp, name.zh),
        coalesce(name.zh, name.jp, name.en)
      ),
      priceNote,
      "features": select(
        $lang == "jp" => features.jp[],
        $lang == "zh" => features.zh[],
        $lang == "en" => features.en[],
        features.zh[]
      )
    },
    "showContactCta": feesOverseas.showContactCta
  },

  "cta": {
    "title": select(
      $lang == "jp" => coalesce(cta.title.jp, cta.title.zh, cta.title.en),
      $lang == "zh" => coalesce(cta.title.zh, cta.title.jp, cta.title.en),
      $lang == "en" => coalesce(cta.title.en, cta.title.jp, cta.title.zh),
      coalesce(cta.title.zh, cta.title.jp, cta.title.en)
    ),
    "subtitle": select(
      $lang == "jp" => coalesce(cta.subtitle.jp, cta.subtitle.zh, cta.subtitle.en),
      $lang == "zh" => coalesce(cta.subtitle.zh, cta.subtitle.jp, cta.subtitle.en),
      $lang == "en" => coalesce(cta.subtitle.en, cta.subtitle.jp, cta.subtitle.zh),
      coalesce(cta.subtitle.zh, cta.subtitle.jp, cta.subtitle.en)
    ),
    "buttonText": select(
      $lang == "jp" => coalesce(cta.buttonText.jp, cta.buttonText.zh, cta.buttonText.en),
      $lang == "zh" => coalesce(cta.buttonText.zh, cta.buttonText.jp, cta.buttonText.en),
      $lang == "en" => coalesce(cta.buttonText.en, cta.buttonText.jp, cta.buttonText.zh),
      coalesce(cta.buttonText.zh, cta.buttonText.jp, cta.buttonText.en)
    ),
    "buttonHref": cta.buttonHref
  },

  "seo": {
    "metaTitle": select(
      $lang == "jp" => coalesce(seo.metaTitle.jp, seo.metaTitle.zh, seo.metaTitle.en),
      $lang == "zh" => coalesce(seo.metaTitle.zh, seo.metaTitle.jp, seo.metaTitle.en),
      $lang == "en" => coalesce(seo.metaTitle.en, seo.metaTitle.jp, seo.metaTitle.zh),
      coalesce(seo.metaTitle.zh, seo.metaTitle.jp, seo.metaTitle.en)
    ),
    "metaDescription": select(
      $lang == "jp" => coalesce(seo.metaDescription.jp, seo.metaDescription.zh, seo.metaDescription.en),
      $lang == "zh" => coalesce(seo.metaDescription.zh, seo.metaDescription.jp, seo.metaDescription.en),
      $lang == "en" => coalesce(seo.metaDescription.en, seo.metaDescription.jp, seo.metaDescription.zh),
      coalesce(seo.metaDescription.zh, seo.metaDescription.jp, seo.metaDescription.en)
    ),
    "ogImage": seo.ogImage{
      "url": asset->url,
      alt
    }
  }
}
`;
