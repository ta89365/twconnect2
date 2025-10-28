// apps/web/src/lib/queries/companyOverview.ts
import groq from "groq";

/* ============================ Types ============================ */
export type Lang = "jp" | "zh" | "en";

export type SanityImageMeta = {
  dimensions?: { width?: number; height?: number; aspectRatio?: number };
  lqip?: string | null;
  palette?: unknown;
};

export type SanityImageObj = {
  url?: string | null;
  alt?: string | null;
  ref?: string | null;
  metadata?: SanityImageMeta | null;
  // removed: focal (custom field was dropped in schema)
};

// removed: LabelBundle (labels schema was removed)

export type ValueItem = {
  order?: number | null;
  key?: string | null;
  iconKey?: string | null;
  title?: string | null;
  descLong?: string | null;
  descShort?: string | null;
};

export type PersonML = {
  name?: { jp?: string | null; zh?: string | null; en?: string | null } | null;
  title?: { jp?: string | null; zh?: string | null; en?: string | null } | null;
  photo?: { url?: string | null; alt?: string | null } | null;
  credentials?: unknown[] | null;
  bioLong?: { jp?: string | null; zh?: string | null; en?: string | null } | null;
  bioShort?: { jp?: string | null; zh?: string | null; en?: string | null } | null;
};

export type ContactCTA = {
  heading?: string | null;
  subtext?: string | null;
  buttonText?: string | null;
  href?: string | null;
};

/** Strongly-typed shape for the GROQ result below */
export type CompanyOverviewData = {
  logo?: SanityImageObj | null;
  logoText?: string | null;

  heading?: string | null;
  // removed: tagline (not in schema)
  headingTaglines?: string[] | null;

  topImage?: SanityImageObj | null;

  // removed: labels

  mission?: unknown[] | null;
  vision?: unknown[] | null;

  visionShort?: string[] | null;

  values?: ValueItem[] | null;

  founder?: PersonML | null;
  coFounder?: PersonML | null;

  repMessageLong?: unknown[] | null;
  repMessageShort?: string | null;

  companyInfo?: unknown[] | null;

  cta?: ContactCTA | null;
};

/* ============================ GROQ ============================ */
/**
 * Company Overview by language
 * - Images returned as objects with null-safety: logo, topImage
 * - Removed: labels, tagline, topImage.focal (custom field), topImage.metadata.lqip custom
 *   Note: asset->metadata.lqip still exists and is kept.
 */
export const companyOverviewByLang = groq`
*[_type == "companyOverviewSingleton"][0]{
  // ===== Logo (object + null-safe) =====
  "logo": select(
    defined(logo.asset) => {
      "url": logo.asset->url,
      "alt": coalesce(logo.alt, "Logo"),
      "ref": logo.asset->_ref,
      "metadata": {
        "dimensions": logo.asset->metadata.dimensions,
        "lqip": logo.asset->metadata.lqip,
        "palette": logo.asset->metadata.palette
      }
    },
    null
  ),
  logoText,

  // ===== Heading =====
  "heading": select(
    $lang == "jp" => coalesce(heading.jp, heading.zh, heading.en),
    $lang == "zh" => coalesce(heading.zh, heading.jp, heading.en),
    coalesce(heading.en, heading.zh, heading.jp)
  ),

  // ===== Heading Taglines (multi-line with fallback) =====
  "headingTaglines": coalesce(
    select(
      $lang == "jp" => headingTaglines.jp,
      $lang == "zh" => headingTaglines.zh,
      headingTaglines.en
    ),
    headingTaglines.jp, headingTaglines.zh, headingTaglines.en
  ),

  // ===== Top Image (object + null-safe) =====
  "topImage": select(
    defined(topImage.asset) => {
      "url": topImage.asset->url,
      "alt": topImage.alt,
      "ref": topImage.asset->_ref,
      "metadata": {
        "dimensions": topImage.asset->metadata.dimensions,
        "lqip": topImage.asset->metadata.lqip,
        "palette": topImage.asset->metadata.palette
      }
    },
    null
  ),

  // ===== Mission / Vision (Portable Text with fallback) =====
  "mission": coalesce(
    select($lang == "jp" => mission.jp, $lang == "zh" => mission.zh, mission.en),
    mission.jp, mission.zh, mission.en
  ),
  "vision": coalesce(
    select($lang == "jp" => vision.jp, $lang == "zh" => vision.zh, vision.en),
    vision.jp, vision.zh, vision.en
  ),

  // ===== Vision Short (multi-line with fallback) =====
  "visionShort": coalesce(
    select($lang == "jp" => visionShort.jp, $lang == "zh" => visionShort.zh, visionShort.en),
    visionShort.jp, visionShort.zh, visionShort.en
  ),

  // ===== Values (ordered + localized fallback) =====
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
    "name": { "jp": founder.name.jp, "zh": founder.name.zh, "en": founder.name.en },
    "title": { "jp": founder.title.jp, "zh": founder.title.zh, "en": founder.title.en },
    "photo": select(
      defined(founder.photo.asset) => {
        "url": founder.photo.asset->url,
        "alt": coalesce(founder.photo.alt, "Founder")
      },
      null
    ),
    "credentials": founder.credentials[],
    "bioLong": { "jp": founder.bioLong.jp, "zh": founder.bioLong.zh, "en": founder.bioLong.en },
    "bioShort": { "jp": founder.bioShort.jp, "zh": founder.bioShort.zh, "en": founder.bioShort.en }
  },
  "coFounder": select(
    defined(coFounder) => {
      "name": { "jp": coFounder.name.jp, "zh": coFounder.name.zh, "en": coFounder.name.en },
      "title": { "jp": coFounder.title.jp, "zh": coFounder.title.zh, "en": coFounder.title.en },
      "photo": select(
        defined(coFounder.photo.asset) => {
          "url": coFounder.photo.asset->url,
          "alt": coalesce(coFounder.photo.alt, "Co-Founder")
        },
        null
      ),
      "credentials": coFounder.credentials[],
      "bioLong": { "jp": coFounder.bioLong.jp, "zh": coFounder.bioLong.zh, "en": coFounder.bioLong.en },
      "bioShort": { "jp": coFounder.bioShort.jp, "zh": coFounder.bioShort.zh, "en": coFounder.bioShort.en }
    },
    null
  ),

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

  // ===== Company Info (whole localized block with fallback) =====
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
