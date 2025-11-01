// apps/cms/schemaTypes/index.ts
import siteSettings from "./siteSettings";
import hero from "./hero";
import service from "./service";
import challenge from "./challenge";
import fiveCommonChallenges from "./clientChallengesSectionDetail"; // Client Challenges SectionDetail
import crossBorderSection from "./crossBorderSection";
import about from "./About";
import contactSection from "./contactSection";
import companyOverviewSingleton, { companyOverviewTypes } from "./companyOverviewSingleton";
import twServiceDetail from "./twServiceDetail";
import visaResidencySupport from "./visaResidencySupport";
import overseasRelocationSupport from "./overseasRelocationSupport";
import financeAdvisoryDetail from "./financeAdvisoryDetail";
import companyStrengthsAndFAQ from "./companyStrengthsAndFAQ";

// News system
import newsSettings from "./newsSettings";
import columnSettings from "./columnSettings"; // 新增 專欄入口設定
import post from "./post";
import tag from "./tag";
import category from "./category";
import author from "./author";

// Object types
import mlText from "./objects/mlText";
import cta from "./objects/cta";

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
  contactSection, // Contact and Inquiry Section
  companyOverviewSingleton, // Company Mission and Profile
  twServiceDetail, // Taiwan Market Entry Detail
  visaResidencySupport, // Visa and Residency Services
  overseasRelocationSupport, // Relocation and Settlement Services
  financeAdvisoryDetail, // Financial and Accounting Advisory Services
  companyStrengthsAndFAQ, // Our Strengths and FAQs

  /* ========== News and Column System ========== */
  newsSettings, // News Entrance Settings
  columnSettings, // Column Entrance Settings
  post, // Shared Post Document with channel 欄位
  tag, // Article Tags
  category, // Article Categories
  author, // Article Authors

  /* ========== Common Object Types ========== */
  mlText,
  cta,

  /* ========== Company Overview Subtypes ========== */
  ...companyOverviewTypes,
];
