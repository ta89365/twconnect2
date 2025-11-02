// File: apps/cms/schemaTypes/index.ts

/* ========================== Imports ========================== */
// Global & Visual
import siteSettings from "./siteSettings";
import hero from "./hero";

// Services & Business
import service from "./service";
import challenge from "./challenge";
import fiveCommonChallenges from "./clientChallengesSectionDetail";
import crossBorderSection from "./crossBorderSection";
import about from "./About";
import contactSection from "./contactSection";
import companyOverviewSingleton, { companyOverviewTypes } from "./companyOverviewSingleton";
import twServiceDetail from "./twServiceDetail";
import visaResidencySupport from "./visaResidencySupport";
import overseasRelocationSupport from "./overseasRelocationSupport";
import financeAdvisoryDetail from "./financeAdvisoryDetail";
import companyStrengthsAndFAQ from "./companyStrengthsAndFAQ";

// News & Column
import newsSettings from "./newsSettings";
import columnSettings from "./columnSettings";
import post from "./post";
import tag from "./tag";
import category from "./category";
import author from "./author";

// Mainland China Investment (Landing + Article + UBO Guide + Docs)
import cnInvestmentLanding, {
  authority,
  reviewItem,
  processStep,
  serviceBullet,
  faqItem,
  recommendedItem,
} from "./cnInvestmentLanding";
import mainlandInvestmentGuide from "./mainlandInvestmentGuide";
import cnInvestmentUboGuide from "./cnInvestmentUboGuide";
import cnInvestmentDocsCn from "./cnInvestmentDocsCn";

// CN Investment Whitelist (ZH-CN only)
import cnInvestmentWhitelist from "./cnInvestmentWhitelist";
import blockContentZhCn from "./blockContentZhCn";

// Common Objects
import mlText from "./objects/mlText";
import cta from "./objects/cta";

// Localization & Contact
import localeString from "./objects/localeString";
import localeText from "./objects/localeText";
import localeBlock from "./objects/localeBlock";
import localeStringArray from "./objects/localeStringArray";
import contactCta from "./objects/contactCta";
import contactAddress from "./objects/contactAddress";
import contactPage from "./documents/contactPage";

/* ========================== Exports ========================== */
export const schemaTypes = [
  /* ========== Global and Visual Settings ========== */
  siteSettings,
  hero,

  /* ========== Services and Business Sections ========== */
  challenge,
  fiveCommonChallenges,
  service,
  crossBorderSection,
  about,
  contactSection,
  companyOverviewSingleton,
  twServiceDetail,
  visaResidencySupport,
  overseasRelocationSupport,
  financeAdvisoryDetail,
  companyStrengthsAndFAQ,

  /* ========== News and Column System ========== */
  newsSettings,
  columnSettings,
  post,
  tag,
  category,
  author,

  /* ========== Mainland China Investment ========== */
  cnInvestmentLanding,          // Landing Page
  mainlandInvestmentGuide,      // Article Page
  cnInvestmentUboGuide,         // UBO Guide (ZH-CN)
  cnInvestmentDocsCn,           // Document Preparation & Rejection Reasons (ZH-CN)
  authority,                    // Object Types (Landing)
  reviewItem,
  processStep,
  serviceBullet,
  faqItem,
  recommendedItem,

  /* ========== CN Investment Whitelist (ZH-CN) ========== */
  blockContentZhCn,             // Portable Text for Whitelist
  cnInvestmentWhitelist,        // Whitelist Article (ZH-CN)

  /* ========== Common Object Types ========== */
  mlText,
  cta,

  /* ========== Localization & Contact ========== */
  localeString,
  localeText,
  localeBlock,
  localeStringArray,
  contactCta,
  contactAddress,
  contactPage,

  /* ========== Company Overview Subtypes ========== */
  ...companyOverviewTypes,
];
