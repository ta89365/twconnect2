// File: schemas/cnInvestmentLanding.ts
import {defineType, defineField} from "sanity";

export default defineType({
  name: "cnInvestmentLanding",
  title: "CN Investment Landing",
  type: "document",
  // 單頁型：通常只會有一份
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL slug for this landing page. Keep it stable, e.g. 'china-investment'.",
      options: {source: "titleZh", maxLength: 96},
      validation: (r) => r.required(),
    }),

    /* ---------------------- Hero / Top ---------------------- */
    defineField({
      name: "titleZh",
      title: "Title (ZH-CN)",
      type: "string",
      description: "Main page title in Simplified Chinese, e.g., '陆资企业进入台湾市场专区'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "taglineEn",
      title: "Tagline (EN)",
      type: "string",
      description: "English tagline shown below the title, e.g., 'Helping Chinese-funded enterprises successfully enter and operate in Taiwan'.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description: "Hero image for the landing page. Upload a wide image. Add alt text.",
      options: {hotspot: true},
      fields: [
        {name: "alt", title: "Alt text", type: "string", description: "Describe the image for accessibility and SEO."},
      ],
    }),

    /* ---------------------- Why/Intro ---------------------- */
    defineField({
      name: "whyZh",
      title: "Why Professional Help (ZH-CN)",
      type: "array",
      description: "Rich text explaining why PRC investment needs professional assistance.",
      of: [{type: "block"}],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "principleZh",
      title: "Our Philosophy (ZH-CN)",
      type: "text",
      rows: 3,
      description: "One-sentence principle, e.g., '让陆资企业合规落地、顺利营运'…",
    }),

    /* ---------------------- Regulations ---------------------- */
    defineField({
      name: "regulationDefinitionZh",
      title: "Definition of PRC Investment (ZH-CN)",
      type: "array",
      description: "Rich text describing UBO/control test and legal basis.",
      of: [{type: "block"}],
    }),
    defineField({
      name: "authorities",
      title: "Competent Authorities",
      type: "array",
      description: "List of authorities related to review and approval.",
      of: [{type: "authority"}],
    }),

    /* ---------------------- Review Focus ---------------------- */
    defineField({
      name: "reviewFocus",
      title: "Review Focus Items",
      type: "array",
      description: "Key items evaluated by MOEAIC / MAC.",
      of: [{type: "reviewItem"}],
    }),

    /* ---------------------- Doubts/Questions CTA ---------------------- */
    defineField({
      name: "doubtsZh",
      title: "Common Doubts Intro (ZH-CN)",
      type: "array",
      description: "Short bullets of typical questions before contacting you.",
      of: [{type: "block"}],
    }),
    defineField({
      name: "contactFormHref",
      title: "Contact Form URL",
      type: "string",
      description: "External form link. Open in same tab is fine.",
    }),

    /* ---------------------- Process ---------------------- */
    defineField({
      name: "processSteps",
      title: "Investment & Company Setup – Steps",
      type: "array",
      description: "Ordered steps from analysis to registration and tax.",
      of: [{type: "processStep"}],
    }),
    defineField({
      name: "timelineZh",
      title: "Estimated Timeline (ZH-CN)",
      type: "string",
      description: "Plain text estimate, e.g., '约 3〜6 个月（依文件完整度与审查内容而定）'.",
    }),

    /* ---------------------- Advantages / Services ---------------------- */
    defineField({
      name: "advantagesIntroZh",
      title: "Advantages Intro (ZH-CN)",
      type: "array",
      description: "Rich text paragraph before the bullet services.",
      of: [{type: "block"}],
    }),
    defineField({
      name: "serviceBulletsZh",
      title: "Service Bullets (ZH-CN)",
      type: "array",
      description: "Short bullet lines of what you provide.",
      of: [{type: "serviceBullet"}],
    }),
    defineField({
      name: "teamImage",
      title: "Team / Illustration Image",
      type: "image",
      description: "Suggested visual: team photo or process illustration.",
      options: {hotspot: true},
      fields: [{name: "alt", title: "Alt text", type: "string", description: "Describe the image for accessibility and SEO."}],
    }),

    /* ---------------------- FAQ ---------------------- */
    defineField({
      name: "faq",
      title: "FAQ",
      type: "array",
      description: "Frequently asked questions with answers in ZH-CN.",
      of: [{type: "faqItem"}],
    }),

    /* ---------------------- Recommended Articles ---------------------- */
    defineField({
      name: "recommended",
      title: "Recommended Articles",
      type: "array",
      description: "Show in a 3–4 card grid. Either reference internal posts or provide external URL.",
      of: [{type: "recommendedItem"}],
    }),

    /* ---------------------- Contact ---------------------- */
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      description: "Public email address shown in the contact section.",
    }),
    defineField({
      name: "contactLine",
      title: "LINE ID",
      type: "string",
      description: "Public LINE account or ID, e.g., '@030qreji'.",
    }),
    defineField({
      name: "bookingHref",
      title: "Booking Link",
      type: "string",
      description: "Booking page URL, e.g., Google Form or Notion booking page.",
    }),
  ],
});

/* ===================== Object types ===================== */

export const authority = defineType({
  name: "authority",
  title: "Authority",
  type: "object",
  fields: [
    defineField({name: "nameZh", title: "Name (ZH-CN)", type: "string", description: "e.g., 经济部投资审议委员会"}),
    defineField({name: "nameEn", title: "Name (EN)", type: "string", description: "e.g., Investment Commission, MOEAIC"}),
    defineField({name: "url", title: "Official URL", type: "url", description: "Optional link to official site."}),
  ],
});

export const reviewItem = defineType({
  name: "reviewItem",
  title: "Review Focus Item",
  type: "object",
  fields: [
    defineField({name: "order", title: "Order", type: "number", description: "Display order, smaller first."}),
    defineField({name: "titleZh", title: "Title (ZH-CN)", type: "string", description: "e.g., 投资主体与最终受益人（UBO）认定"}),
    defineField({name: "bodyZh", title: "Body (ZH-CN)", type: "text", rows: 3, description: "One or two sentences to describe the key review point."}),
  ],
});

export const processStep = defineType({
  name: "processStep",
  title: "Process Step",
  type: "object",
  fields: [
    defineField({name: "order", title: "Order", type: "number", description: "1-based order as displayed in the UI."}),
    defineField({name: "titleZh", title: "Title (ZH-CN)", type: "string", description: "e.g., Step 1｜陆资身份与投资架构分析"}),
    defineField({name: "bodyZh", title: "Body (ZH-CN)", type: "array", of: [{type: "block"}], description: "Rich text for step details."}),
  ],
});

export const serviceBullet = defineType({
  name: "serviceBullet",
  title: "Service Bullet",
  type: "object",
  fields: [
    defineField({name: "textZh", title: "Text (ZH-CN)", type: "string", description: "Short bullet, e.g., 投审会文件撰写与申请辅导"}),
  ],
});

export const faqItem = defineType({
  name: "faqItem",
  title: "FAQ Item",
  type: "object",
  fields: [
    defineField({name: "qZh", title: "Question (ZH-CN)", type: "string", description: "FAQ question in Simplified Chinese."}),
    defineField({name: "aZh", title: "Answer (ZH-CN)", type: "array", of: [{type: "block"}], description: "Rich text answer in Simplified Chinese."}),
  ],
});

// File: apps/cms/schemaTypes/cnInvestmentLanding.ts
// ...其餘內容不動

export const recommendedItem = defineType({
  name: "recommendedItem",
  title: "Recommended Article",
  type: "object",
  fields: [
    defineField({
      name: "titleZh",
      title: "Title (ZH-CN)",
      type: "string",
      description: "Card title in Simplified Chinese.",
    }),
    defineField({
      name: "summaryZh",
      title: "Summary (ZH-CN)",
      type: "text",
      rows: 3,
      description: "1–2 sentence summary.",
    }),
    defineField({
      name: "internalPost",
      title: "Internal Post",
      type: "reference",
      to: [{ type: "post" }],
      description: "Optional reference to an internal article document of type 'post'.",
    }),

    // ✅ URL 欄位允許空白、允許 # 或相對路徑
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "string", // ← 改成 string，就不再強制 URL 格式
      description:
        "If not linking to an internal post, you may provide a full URL or leave empty. Optional.",
      validation: (Rule) =>
        Rule.custom((val) => {
          if (!val) return true; // 可留空
          const validUrlPattern = /^(https?:\/\/|\/|#)/;
          return validUrlPattern.test(val)
            ? true
            : "Must start with http(s)://, /, or #";
        }),
    }),

    defineField({
      name: "ctaLabelZh",
      title: "CTA Label (ZH-CN)",
      type: "string",
      description:
        "Button label, e.g., '阅读文章 →'. If empty, UI may default.",
    }),
  ],
});