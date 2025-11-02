// apps/cms/schemaTypes/siteSettings.ts
import { defineType, defineField } from "sanity";

/** 共用：Footer 連結型別（給 footer.primaryLinks / secondaryLinks 用） */
const footerLink = defineType({
  name: "footerLink",
  title: "Footer Link",
  type: "object",
  fields: [
    { name: "labelZh",   title: "Label (ZH-TW)", type: "string" },
    { name: "labelZhCn", title: "Label (ZH-CN)", type: "string" },
    { name: "labelEn",   title: "Label (EN)",    type: "string" },
    { name: "labelJp",   title: "Label (JP)",    type: "string" },
    { name: "href",      title: "Href",          type: "string", validation: Rule => Rule.required() },
    { name: "external",  title: "Open in new tab?", type: "boolean", initialValue: false },
    { name: "order",     title: "Order",         type: "number" },
  ],
  preview: {
    select: { zh: "labelZh", zhcn: "labelZhCn", en: "labelEn", jp: "labelJp", href: "href" },
    prepare({ zh, zhcn, en, jp, href }) {
      return { title: zh || zhcn || en || jp || "(no label)", subtitle: href || "" };
    },
  },
});

/** 與舊資料相容：Header 導覽項目（沿用 name: "navItem"） */
const navItem = defineType({
  name: "navItem",
  title: "Nav Item",
  type: "object",
  fields: [
    { name: "labelZh",   title: "Label (ZH-TW)", type: "string" },
    { name: "labelZhCn", title: "Label (ZH-CN)", type: "string" },
    { name: "labelEn",   title: "Label (EN)",    type: "string" },
    { name: "labelJp",   title: "Label (JP)",    type: "string" },
    { name: "href",      title: "Href",          type: "string" },
    { name: "external",  title: "Open in new tab?", type: "boolean", initialValue: false },
    { name: "order",     title: "Order",         type: "number" },
  ],
  preview: {
    select: { zh: "labelZh", zhcn: "labelZhCn", en: "labelEn", jp: "labelJp", href: "href" },
    prepare({ zh, zhcn, en, jp, href }) {
      return { title: zh || zhcn || en || jp || "(no label)", subtitle: href || "" };
    },
  },
});

/** 主文件：Site Settings */
const siteSettings = defineType({
  name: "siteSettings",
  title: "Global Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),

    // 舊版相容（保留舊值不顯示）
    defineField({ name: "title", title: "Legacy Title", type: "string", hidden: true }),
    defineField({ name: "description", title: "Legacy Description", type: "text", hidden: true }),

    // Header 導覽（使用 navItem，與舊資料完全相容）
    defineField({
      name: "navigation",
      title: "Header Navigation",
      type: "array",
      of: [{ type: "navItem" }],
      options: { sortable: true },
    }),

    // Footer 設定
    defineField({
      name: "footer",
      title: "Footer",
      type: "object",
      fields: [
        defineField({
          name: "company",
          title: "Company",
          type: "object",
          fields: [
            { name: "nameZh",   title: "Company Name (ZH-TW)", type: "string" },
            { name: "nameZhCn", title: "Company Name (ZH-CN)", type: "string" },
            { name: "nameEn",   title: "Company Name (EN)",    type: "string" },
            { name: "nameJp",   title: "Company Name (JP)",    type: "string" },
            { name: "logo",     title: "Footer Logo (optional)", type: "image", options: { hotspot: true } },
            { name: "descZh",   title: "Description (ZH-TW)",  type: "text" },
            { name: "descZhCn", title: "Description (ZH-CN)",  type: "text" },
            { name: "descEn",   title: "Description (EN)",     type: "text" },
            { name: "descJp",   title: "Description (JP)",     type: "text" },
          ],
        }),
        defineField({
          name: "contact",
          title: "Contact",
          type: "object",
          fields: [
            { name: "email",     title: "Email",             type: "string" },
            { name: "lineId",    title: "LINE ID",           type: "string" },
            { name: "addressJp", title: "Address in Japan",  type: "string" },
            { name: "addressTw", title: "Address in Taiwan", type: "string" },
          ],
        }),
        defineField({
          name: "sitemapLabel",
          title: "Sitemap Label",
          type: "object",
          fields: [
            { name: "zh",   title: "ZH-TW", type: "string" },
            { name: "zhcn", title: "ZH-CN", type: "string" },
            { name: "en",   title: "EN",    type: "string" },
            { name: "jp",   title: "JP",    type: "string" },
          ],
        }),
        defineField({
          name: "primaryLinks",
          title: "Primary Links",
          type: "array",
          of: [{ type: "footerLink" }],
          options: { sortable: true },
        }),
        defineField({
          name: "secondaryLinks",
          title: "Secondary Links",
          type: "array",
          of: [{ type: "footerLink" }],
          options: { sortable: true },
        }),
      ],
    }),

    // Social（前端可選擇是否讀用）
    defineField({
      name: "social",
      title: "Social",
      type: "object",
      fields: [
        { name: "facebook",  type: "url" },
        { name: "instagram", type: "url" },
        { name: "linkedin",  type: "url" },
        { name: "github",    type: "url" },
        { name: "medium",    type: "url" },
        { name: "note",      type: "url" },
        { name: "line",      title: "LINE URL", type: "url" },
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Site Settings" }) },
});

export default siteSettings;
/** 一併註冊共用型別，確保 Studio 載入 */
export const siteSettingsTypes = [footerLink, navItem];
