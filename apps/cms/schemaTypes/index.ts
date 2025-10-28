// apps/cms/schemaTypes/index.ts
import siteSettings from './siteSettings';
import hero from './hero';
import service from './service';
import challenge from './challenge';
import crossBorderSection from './crossBorderSection';
import about from './About';
import contactSection from './contactSection';
import companyOverviewSingleton, { companyOverviewTypes } from './companyOverviewSingleton';
import twServiceDetail from './twServiceDetail';
import visaResidencySupport from './visaResidencySupport';
import overseasRelocationSupport from './overseasRelocationSupport';
import financeAdvisoryDetail from './financeAdvisoryDetail';
import companyStrengthsAndFAQ from './companyStrengthsAndFAQ';
import newsSettings from './newsSettings';
import post from './post';
import tag from './tag';
import category from './category';
import author from './author';

// 物件型別
import mlText from './objects/mlText';
import cta from './objects/cta';

/* ========================== EXPORT ========================== */
export const schemaTypes = [
  /* ========== Global & Visual Settings ========== */
  siteSettings, // Global Site Settings
  hero, // Homepage Hero Banner

  /* ========== Services & Business Sections ========== */
  challenge, // Client Challenges Section
  service, // Core Services Overview
  crossBorderSection, // Cross-Border Advisory Section
  about, // About Us / Company Introduction
  contactSection, // Contact & Inquiry Section
  companyOverviewSingleton, // Company Mission & Profile
  twServiceDetail, // Taiwan Market Entry Detail
  visaResidencySupport, // Visa & Residency Services
  overseasRelocationSupport, // Relocation & Settlement Services
  financeAdvisoryDetail, // Financial & Accounting Advisory Services
  companyStrengthsAndFAQ, // Our Strengths & FAQs

  /* ========== News System ========== */
  newsSettings, // News & Articles Settings
  post, // News & Articles
  tag, // Article Tags
  category, // Article Categories
  author, // Article Authors

  /* ========== Common Object Types ========== */
  mlText,
  cta,

  /* ========== Company Overview Subtypes ========== */
  ...companyOverviewTypes,
];
