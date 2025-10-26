// apps/web/src/lib/queries/companyOverview.ts
import groq from "groq";

/**
 * 公司概要（依語系）
 * - 圖片以物件回傳並加上空值保護：logo、topImage
 * - 補上 labels、headingTaglines、founder、coFounder
 */
export const companyOverviewByLang = groq`
*[_type == "companyOverviewSingleton"][0]{
  // ===== Logo（物件 + 空值保護）=====
  "logo": select(
    defined(logo.asset) => {
      "url": logo.asset->url,
      "alt": coalesce(logo.alt, "Logo"),
      "ref": logo.asset->_ref,
      "metadata": {
        "dimensions": logo.asset->metadata.dimensions, // {width,height,aspectRatio}
        "lqip": logo.asset->metadata.lqip,
        "palette": logo.asset->metadata.palette
      }
    },
    null
  ),
  logoText,

  // ===== Heading / Tagline =====
  "heading": select(
    $lang == "jp" => coalesce(heading.jp, heading.zh, heading.en),
    $lang == "zh" => coalesce(heading.zh, heading.jp, heading.en),
    coalesce(heading.en, heading.zh, heading.jp)
  ),
  "tagline": select(
    $lang == "jp" => coalesce(tagline.jp, tagline.zh, tagline.en),
    $lang == "zh" => coalesce(tagline.zh, tagline.jp, tagline.en),
    coalesce(tagline.en, tagline.zh, tagline.jp)
  ),

  // ===== Heading Taglines（每語多行，含 fallback）=====
  "headingTaglines": coalesce(
    select(
      $lang == "jp" => headingTaglines.jp,
      $lang == "zh" => headingTaglines.zh,
      headingTaglines.en
    ),
    headingTaglines.jp, headingTaglines.zh, headingTaglines.en
  ),

  // ===== Top Image（物件 + 空值保護）=====
  "topImage": select(
    defined(topImage.asset) => {
      "url": topImage.asset->url,
      "alt": coalesce(topImage.alt, "Top image"),
      "focal": topImage.focal,
      "ref": topImage.asset->_ref,
      "metadata": {
        "dimensions": topImage.asset->metadata.dimensions,
        "lqip": topImage.asset->metadata.lqip,
        "palette": topImage.asset->metadata.palette
      }
    },
    null
  ),

  // ===== Labels（可選）=====
  "labels": {
    "pageLabel": select(
      $lang == "jp" => coalesce(labels.pageLabel.jp, labels.pageLabel.zh, labels.pageLabel.en),
      $lang == "zh" => coalesce(labels.pageLabel.zh, labels.pageLabel.jp, labels.pageLabel.en),
      coalesce(labels.pageLabel.en, labels.pageLabel.zh, labels.pageLabel.jp)
    ),
    "mission": select(
      $lang == "jp" => coalesce(labels.mission.jp, labels.mission.zh, labels.mission.en),
      $lang == "zh" => coalesce(labels.mission.zh, labels.mission.jp, labels.mission.en),
      coalesce(labels.mission.en, labels.mission.zh, labels.mission.jp)
    ),
    "values": select(
      $lang == "jp" => coalesce(labels.values.jp, labels.values.zh, labels.values.en),
      $lang == "zh" => coalesce(labels.values.zh, labels.values.jp, labels.values.en),
      coalesce(labels.values.en, labels.values.zh, labels.values.jp)
    ),
    "founder": select(
      $lang == "jp" => coalesce(labels.founder.jp, labels.founder.zh, labels.founder.en),
      $lang == "zh" => coalesce(labels.founder.zh, labels.founder.jp, labels.founder.en),
      coalesce(labels.founder.en, labels.founder.zh, labels.founder.jp)
    ),
    "repMessage": select(
      $lang == "jp" => coalesce(labels.repMessage.jp, labels.repMessage.zh, labels.repMessage.en),
      $lang == "zh" => coalesce(labels.repMessage.zh, labels.repMessage.jp, labels.repMessage.en),
      coalesce(labels.repMessage.en, labels.repMessage.zh, labels.repMessage.jp)
    ),
    "companyInfo": select(
      $lang == "jp" => coalesce(labels.companyInfo.jp, labels.companyInfo.zh, labels.companyInfo.en),
      $lang == "zh" => coalesce(labels.companyInfo.zh, labels.companyInfo.jp, labels.companyInfo.en),
      coalesce(labels.companyInfo.en, labels.companyInfo.zh, labels.companyInfo.jp)
    )
  },

  // ===== Mission / Vision（Portable Text，含 fallback）=====
  "mission": coalesce(
    select($lang == "jp" => mission.jp, $lang == "zh" => mission.zh, mission.en),
    mission.jp, mission.zh, mission.en
  ),
  "vision": coalesce(
    select($lang == "jp" => vision.jp, $lang == "zh" => vision.zh, vision.en),
    vision.jp, vision.zh, vision.en
  ),

  // ===== Vision Short（每語多行，含 fallback）=====
  "visionShort": coalesce(
    select($lang == "jp" => visionShort.jp, $lang == "zh" => visionShort.zh, visionShort.en),
    visionShort.jp, visionShort.zh, visionShort.en
  ),

  // ===== Values（排序 + 多語 fallback）=====
  "values": values[] | order(order asc){
    order, key, iconKey,
    "title": select(
      $lang == "jp" => coalesce(title.jp, title.zh, title.en),
      $lang == "zh" => coalesce(title.zh, title.jp, title.en),
      coalesce(title.en, title.zh, title.jp)
    ),
    "descLong": select(
      $lang == "jp" => coalesce(descLong.jp, descLong.zh, descLong.en),
      $lang == "zh" => coalesce(descLong.zh, descLong.jp, descLong.en),
      coalesce(descLong.en, descLong.zh, descLong.jp)
    ),
    "descShort": select(
      $lang == "jp" => coalesce(descShort.jp, descShort.zh, descShort.en),
      $lang == "zh" => coalesce(descShort.zh, descShort.jp, descShort.en),
      coalesce(descShort.en, descShort.zh, descShort.jp)
    )
  },

  // ===== Founder / Co-Founder =====
  "founder": {
    "name": {
      "jp": founder.name.jp, "zh": founder.name.zh, "en": founder.name.en
    },
    "title": {
      "jp": founder.title.jp, "zh": founder.title.zh, "en": founder.title.en
    },
    "photo": select(
      defined(founder.photo.asset) => {
        "url": founder.photo.asset->url,
        "alt": coalesce(founder.photo.alt, "Founder")
      },
      null
    ),
    "credentials": founder.credentials[],
    "bioLong": {
      "jp": founder.bioLong.jp, "zh": founder.bioLong.zh, "en": founder.bioLong.en
    },
    "bioShort": {
      "jp": founder.bioShort.jp, "zh": founder.bioShort.zh, "en": founder.bioShort.en
    }
  },
  "coFounder": {
    "name": {
      "jp": coFounder.name.jp, "zh": coFounder.name.zh, "en": coFounder.name.en
    },
    "title": {
      "jp": coFounder.title.jp, "zh": coFounder.title.zh, "en": coFounder.title.en
    },
    "photo": select(
      defined(coFounder.photo.asset) => {
        "url": coFounder.photo.asset->url,
        "alt": coFounder.photo.alt
      },
      null
    ),
    "credentials": coFounder.credentials[],
    "bioLong": {
      "jp": coFounder.bioLong.jp, "zh": coFounder.bioLong.zh, "en": coFounder.bioLong.en
    },
    "bioShort": {
      "jp": coFounder.bioShort.jp, "zh": coFounder.bioShort.zh, "en": coFounder.bioShort.en
    }
  },

  // ===== Representative Message =====
  "repMessageLong": coalesce(
    select($lang == "jp" => repMessageLong.jp, $lang == "zh" => repMessageLong.zh, repMessageLong.en),
    repMessageLong.jp, repMessageLong.zh, repMessageLong.en
  ),
  "repMessageShort": select(
    $lang == "jp" => coalesce(repMessageShort.jp, repMessageShort.zh, repMessageShort.en),
    $lang == "zh" => coalesce(repMessageShort.zh, repMessageShort.jp, repMessageShort.en),
    coalesce(repMessageShort.en, repMessageShort.zh, repMessageShort.jp)
  ),

  // ===== Company Info（語系整塊回傳，含 fallback）=====
  "companyInfo": coalesce(
    select($lang == "jp" => companyInfo.jp, $lang == "zh" => companyInfo.zh, companyInfo.en),
    companyInfo.jp, companyInfo.zh, companyInfo.en
  ),

  // ===== Contact CTA =====
  "cta": {
    "heading": select(
      $lang == "jp" => coalesce(contactCta.heading.jp, contactCta.heading.zh, contactCta.heading.en),
      $lang == "zh" => coalesce(contactCta.heading.zh, contactCta.heading.jp, contactCta.heading.en),
      coalesce(contactCta.heading.en, contactCta.heading.zh, contactCta.heading.jp)
    ),
    "subtext": select(
      $lang == "jp" => coalesce(contactCta.subtext.jp, contactCta.subtext.zh, contactCta.subtext.en),
      $lang == "zh" => coalesce(contactCta.subtext.zh, contactCta.subtext.jp, contactCta.subtext.en),
      coalesce(contactCta.subtext.en, contactCta.subtext.zh, contactCta.subtext.jp)
    ),
    "buttonText": select(
      $lang == "jp" => coalesce(contactCta.buttonText.jp, contactCta.buttonText.zh, contactCta.buttonText.en),
      $lang == "zh" => coalesce(contactCta.buttonText.zh, contactCta.buttonText.jp, contactCta.buttonText.en),
      coalesce(contactCta.buttonText.en, contactCta.buttonText.zh, contactCta.buttonText.jp)
    ),
    "href": coalesce(contactCta.href, "/contact")
  }
}
`;
