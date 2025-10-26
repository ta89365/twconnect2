// apps/cms/schemaTypes/index.ts
import siteSettings from './siteSettings';
import hero from './hero';
import navItem from './navItem';
import service from './service';
import challenge from './challenge';
import team from './team';
import caseDoc from './case';

// 物件型別
import mlText from './objects/mlText';
import cta from './objects/cta';
import serviceFollowup from './serviceFollowup';

// 單頁 Section
import about from './About';
import crossBorderSection from './crossBorderSection';
import contactSection from './contactSection';

// 公司概要
import companyOverviewSingleton, { companyOverviewTypes } from './companyOverviewSingleton';

// Our Strengths + FAQ
import companyStrengthsAndFAQ from './companyStrengthsAndFAQ';

// 🇹🇼 舊版：台灣相關服務詳情（如仍在用可保留，遷移完成後可移除）
import twServiceDetail from './twServiceDetail';

// ✅ 新版服務詳情
import visaResidencySupport from './visaResidencySupport';          // 簽證／居留支援
import overseasRelocationSupport from './overseasRelocationSupport'; // 海外居住・移住支援
import financeAdvisoryDetail from './financeAdvisoryDetail';         // 財務與會計顧問／海外發展支援

// ✅ 新增：News 專欄系統
import post from './post';
import newsSettings from './newsSettings';
import tag from './tag';
import category from './category';
import author from './author';

export const schemaTypes = [
  siteSettings,
  hero,
  navItem,
  service,
  challenge,
  team,
  caseDoc,

  // 物件型別
  mlText,
  cta,
  serviceFollowup,

  // 單頁 Section
  about,
  crossBorderSection,
  contactSection,

  // 公司概要 document
  companyOverviewSingleton,

  // ✅ 公司概要用到的 object/array 型別
  ...companyOverviewTypes,

  // Our Strengths + FAQ
  companyStrengthsAndFAQ,

  // 🇹🇼 舊版服務詳情（如不再使用可移除）
  twServiceDetail,

  // ✅ 新版服務詳情
  visaResidencySupport,
  overseasRelocationSupport,
  financeAdvisoryDetail,

  // ✅ 新增：News 專欄系統
  post,
  newsSettings,
  tag,
  category,
  author,
];