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

// Common Objects
import mlText from "./objects/mlText";
import cta from "./objects/cta";

/* ===== New: Contact Form and Localization Schema ===== */
import localeString from "./objects/localeString";
import localeText from "./objects/localeText";
import localeBlock from "./objects/localeBlock";
import localeStringArray from "./objects/localeStringArray";
import contactCta from "./objects/contactCta";
import contactAddress from "./objects/contactAddress";
import contactPage from "./documents/contactPage";

/* ========================== EXPORT ========================== */
export const schemaTypes = [
  /* ========== Global and Visual Settings ========== */
  siteSettings, // Global Site Settings
  hero, // Homepage Hero Banner

  /* ========== Services and Business Sections ========== */
  challenge, // Client Challenges Section
  fiveCommonChallenges, // Client Challenges SectionDetail
  service, // Core Services Overview
  crossBorderSection, // Cross Border Advisory Section
  about, // About Us or Company Introduction
  contactSection, // Contact and Inquiry Section (legacy)
  companyOverviewSingleton, // Company Mission and Profile
  twServiceDetail, // Taiwan Market Entry Detail
  visaResidencySupport, // Visa and Residency Services
  overseasRelocationSupport, // Relocation and Settlement Services
  financeAdvisoryDetail, // Financial and Accounting Advisory Services
  companyStrengthsAndFAQ, // Our Strengths and FAQs

  /* ========== News and Column System ========== */
  newsSettings, // News Entrance Settings
  columnSettings, // Column Entrance Settings
  post, // Shared Post Document
  tag, // Article Tags
  category, // Article Categories
  author, // Article Authors

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
  contactPage, // 新增 Contact Form 設定文件

  /* ========== Company Overview Subtypes ========== */
  ...companyOverviewTypes,
];
