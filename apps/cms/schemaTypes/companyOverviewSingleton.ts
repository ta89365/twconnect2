// apps/cms/schemaTypes/companyOverviewSingleton.ts
import { defineType, defineField } from "sanity";

/** 簡易 Portable Text：段落、粗體、斜體、連結 */
const simpleBlock = defineType({
  name: "simpleBlock",
  title: "Simple Block",
  type: "array",
  of: [
    {
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              { name: "href", type: "url", title: "URL" },
              { name: "blank", type: "boolean", title: "Open in new tab?" },
            ],
          },
        ],
      },
    },
  ],
});

/** 三語字串 */
const localeString = defineType({
  name: "localeString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({ name: "jp", type: "string", title: "日本語" }),
    defineField({ name: "zh", type: "string", title: "中文" }),
    defineField({ name: "en", type: "string", title: "English" }),
  ],
  preview: {
    select: { jp: "jp", zh: "zh", en: "en" },
    prepare({ jp, zh, en }) {
      return { title: jp || zh || en || "(empty)", subtitle: "JP / ZH / EN" };
    },
  },
});

/** 三語 Portable Text */
const localeBlock = defineType({
  name: "localeBlock",
  title: "Localized Block",
  type: "object",
  fields: [
    defineField({ name: "jp", type: "simpleBlock", title: "日本語" }),
    defineField({ name: "zh", type: "simpleBlock", title: "中文" }),
    defineField({ name: "en", type: "simpleBlock", title: "English" }),
  ],
});

/** 三語字串陣列（多行短句） */
const localeStringArray = defineType({
  name: "localeStringArray",
  title: "Localized String Array",
  type: "object",
  fields: [
    defineField({ name: "jp", type: "array", title: "日本語", of: [{ type: "string" }] }),
    defineField({ name: "zh", type: "array", title: "中文", of: [{ type: "string" }] }),
    defineField({ name: "en", type: "array", title: "English", of: [{ type: "string" }] }),
  ],
});

/** Values 單項 */
const valueItem = defineType({
  name: "valueItem",
  title: "Value Item",
  type: "object",
  fields: [
    defineField({ name: "order", type: "number", title: "順序", validation: (r) => r.required() }),
    defineField({
      name: "key",
      type: "string",
      title: "識別鍵（例如 local-expertise / grow-with-clients）",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "iconKey",
      type: "string",
      title: "Icon Key（前端對應 Lucide 或自訂 Icon）",
      description: "例如 building-2 / handshake / globe-2 ...",
    }),
    defineField({
      name: "title",
      type: "localeString",
      title: "標題（三語）",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descLong",
      type: "localeString",
      title: "長版說明（三語）",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descShort",
      type: "localeString",
      title: "短版說明（三語，用於四欄 icon 區）",
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: { order: "order", jp: "title.jp", zh: "title.zh", en: "title.en" },
    prepare({ order, jp, zh, en }) {
      return { title: `${order ?? 0}. ${jp || zh || en || "(untitled)"}`, subtitle: "Value Item" };
    },
  },
});

/** Founder（代表紹介） */
const founderProfile = defineType({
  name: "founderProfile",
  title: "Founder / 代表紹介",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "姓名（三語）",
      type: "localeString",
      description: "例：jp=洪 靖文 / zh=洪靖文 / en=Winny Hung",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "頭銜（三語）",
      type: "localeString",
      description: "例：代表取締役／代表董事／Representative Director",
    }),
    defineField({
      name: "photo",
      title: "照片",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt", validation: (r) => r.required() }],
    }),
    defineField({
      name: "credentials",
      title: "資格與稱號（自由文字，多筆）",
      type: "array",
      of: [{ type: "string" }],
      description: "例：USCPA, Taiwan CPA, Big4 audit, cross-border advisory...（不分語系亦可）",
    }),
    defineField({
      name: "bioLong",
      title: "長版介紹（三語）",
      type: "localeBlock",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "bioShort",
      title: "短版介紹（三語）",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "social",
      title: "Social / 連結",
      type: "object",
      fields: [
        defineField({ name: "email", type: "string", title: "Email" }),
        defineField({ name: "linkedin", type: "url", title: "LinkedIn" }),
        defineField({ name: "website", type: "url", title: "Website" }),
      ],
    }),
  ],
});

/** 可選：各區塊標籤文字（清理後） */
const overviewLabels = defineType({
  name: "overviewLabels",
  title: "區塊標籤（可選）",
  type: "object",
  fields: [
    defineField({ name: "pageLabel", type: "localeString", title: "頁面標籤（頂部小字）" }),
    defineField({ name: "mission", type: "localeString", title: "Mission 標籤" }),
    // Vision 標籤已移除
    defineField({ name: "values", type: "localeString", title: "Values 標籤" }),
    defineField({ name: "founder", type: "localeString", title: "Founder 標籤" }),
    defineField({ name: "repMessage", type: "localeString", title: "Representative Message 標籤" }),
    defineField({ name: "companyInfo", type: "localeString", title: "Company Info 標籤" }),
  ],
});

const companyOverviewSingleton = defineType({
  name: "companyOverviewSingleton",
  title: "Company Overview（公司概要）",
  type: "document",
  fields: [
    // ===== Global Branding =====
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "替代文字 Alt",
          validation: (r) => r.required().min(2),
        }),
      ],
      description: "上傳品牌 Logo，前端可用於 Navigation / Footer。",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "logoText",
      type: "string",
      title: "Logo 旁顯示名稱",
      description: "例：Taiwan Connect Inc.",
      validation: (r) => r.required(),
    }),

    // ===== Heading / Tagline / Top Image =====
    defineField({
      name: "heading",
      title: "見出標題（三語）",
      type: "localeString",
      description: "例：経営理念 / 經營理念 / Mission and Company Profile",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "headingTaglines",
      title: "見出し標語（三語，多行）",
      type: "localeStringArray",
    }),
    defineField({
      name: "topImage",
      title: "頂部圖片",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "替代文字 Alt", validation: (r) => r.required() }),
        defineField({ name: "focal", type: "string", title: "前端裁切提示（可選）" }),
        defineField({
          name: "metadata",
          type: "object",
          title: "Metadata（可選）",
          fields: [{ name: "lqip", type: "string", title: "LQIP Base64（可選）" }],
        }),
      ],
      description: "公司概要頁面頂部 Hero/橫幅圖片。",
      validation: (r) => r.required(),
    }),

    // ===== Optional labels =====
    defineField({ name: "labels", title: "區塊標籤（可選）", type: "overviewLabels" }),

    // ===== Mission & Vision =====
    defineField({ name: "mission", title: "Mission 本文（三語）", type: "localeBlock", validation: (r) => r.required() }),
    defineField({ name: "vision", title: "Vision 本文（三語）", type: "localeBlock", validation: (r) => r.required() }),
    defineField({
      name: "visionShort",
      title: "Vision 短句卡片（三語，每語多行）",
      type: "localeStringArray",
      description: "供卡片式短句展示；未填可退回使用 vision 段落渲染。",
    }),

    // ===== Values =====
    defineField({
      name: "values",
      title: "Values（四大價值）",
      type: "array",
      of: [{ type: "valueItem" }],
      validation: (r) => r.min(4).max(12),
    }),

    // ===== Founder / Co-Founder =====
    defineField({ name: "founder", title: "代表紹介 / About the Founder", type: "founderProfile", validation: (r) => r.required() }),
    defineField({ name: "coFounder", title: "Co-Founder", type: "founderProfile", validation: (r) => r.required() }),

    // ===== Representative Message =====
    defineField({ name: "repMessageLong", title: "代表者メッセージ（長版，三語）", type: "localeBlock", validation: (r) => r.required() }),
    defineField({ name: "repMessageShort", title: "代表者メッセージ（短版，三語）", type: "localeString", validation: (r) => r.required() }),
    // ★ 已移除 repMessageAuthor 整組欄位

    // ===== Company Info =====
    defineField({
      name: "companyInfo",
      title: "公司資訊 / Company Profile（三語）",
      type: "object",
      fields: [
        defineField({
          name: "jp",
          title: "日本語",
          type: "object",
          fields: [
            defineField({ name: "companyName", type: "string", title: "会社名" }),
            defineField({ name: "representative", type: "string", title: "代表" }),
            defineField({ name: "activities", type: "array", title: "事業内容（複數可加）", of: [{ type: "string" }] }),
            defineField({ name: "addressJapan", type: "string", title: "所在地（日本）" }),
            defineField({ name: "addressTaiwan", type: "string", title: "所在地（台湾）" }),
          ],
        }),
        defineField({
          name: "zh",
          title: "中文",
          type: "object",
          fields: [
            defineField({ name: "companyName", type: "string", title: "公司名稱" }),
            defineField({ name: "representative", type: "string", title: "代表人" }),
            defineField({ name: "activities", type: "array", title: "主要業務（可多條）", of: [{ type: "string" }] }),
            defineField({ name: "addressJapan", type: "string", title: "據點（日本）" }),
            defineField({ name: "addressTaiwan", type: "string", title: "據點（台灣）" }),
          ],
        }),
        defineField({
          name: "en",
          title: "English",
          type: "object",
          fields: [
            defineField({ name: "companyName", type: "string", title: "Company Name" }),
            defineField({ name: "representative", type: "string", title: "Representative" }),
            defineField({ name: "activities", type: "array", title: "Business Activities", of: [{ type: "string" }] }),
            defineField({ name: "addressJapan", type: "string", title: "Address Japan" }),
            defineField({ name: "addressTaiwan", type: "string", title: "Address Taiwan" }),
          ],
        }),
      ],
    }),

    // ===== Contact CTA =====
    defineField({
      name: "contactCta",
      title: "Contact CTA（三語）",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "localeString", title: "標題" }),
        defineField({ name: "subtext", type: "localeString", title: "補充說明" }),
        defineField({ name: "buttonText", type: "localeString", title: "按鈕文字" }),
        defineField({ name: "href", type: "string", title: "連結", description: "例如 /contact", initialValue: "/contact" }),
      ],
    }),
  ],
  preview: {
    select: { titleJp: "heading.jp", titleZh: "heading.zh", titleEn: "heading.en", media: "logo" },
    prepare({ titleJp, titleZh, titleEn, media }) {
      return { title: titleJp || titleZh || titleEn || "Company Overview", subtitle: "Singleton", media };
    },
  },
});

export default companyOverviewSingleton;

export const companyOverviewTypes = [
  simpleBlock,
  localeString,
  localeBlock,
  localeStringArray,
  valueItem,
  founderProfile,
  overviewLabels,
];
