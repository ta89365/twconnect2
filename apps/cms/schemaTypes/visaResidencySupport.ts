// schemas/visaResidencySupport.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "visaResidencySupport",
  title: "VisaResidency Support",
  type: "document",
  fields: [
    /* ===== 基本資訊 ===== */
    defineField({
      name: "slug",
      title: "Slug（URL 用）",
      type: "slug",
      options: { source: "titleEn", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "顯示順序",
      type: "number",
    }),

    /* ===== 多語標題 ===== */
    defineField({
      name: "titleJp",
      title: "日文標題",
      type: "string",
      description: "例：ビザ・居留サポート",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleZh",
      title: "中文標題",
      type: "string",
      description: "例：簽證與居留支援",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleEn",
      title: "英文標題",
      type: "string",
      description: "例：Visa & Residency Support",
      validation: (Rule) => Rule.required(),
    }),

    /* ===== 背景 ===== */
    defineField({
      name: "background",
      title: "背景 Background",
      type: "object",
      fields: [
        { name: "jp", title: "日本語版", type: "text" },
        { name: "zh", title: "中文版", type: "text" },
        { name: "en", title: "English Version", type: "text" },
      ],
      options: { collapsible: true, collapsed: false },
    }),

    /* ===== 課題 Challenges ===== */
    defineField({
      name: "challenges",
      title: "課題 Challenges",
      type: "object",
      fields: [
        { name: "jp", title: "日本語版", type: "array", of: [{ type: "string" }] },
        { name: "zh", title: "中文版", type: "array", of: [{ type: "string" }] },
        { name: "en", title: "English Version", type: "array", of: [{ type: "string" }] },
      ],
      options: { collapsible: true, collapsed: false },
    }),

    /* ===== 服務內容 Services ===== */
    defineField({
      name: "services",
      title: "服務內容 Services",
      type: "object",
      fields: [
        { name: "jp", title: "日本語版", type: "array", of: [{ type: "string" }] },
        { name: "zh", title: "中文版", type: "array", of: [{ type: "string" }] },
        { name: "en", title: "English Version", type: "array", of: [{ type: "string" }] },
      ],
      options: { collapsible: true, collapsed: false },
    }),

    /* ===== 服務流程 Service Flow ===== */
    defineField({
      name: "serviceFlow",
      title: "服務流程 Service Flow",
      type: "object",
      fields: [
        {
          name: "jp",
          title: "日本語版",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "order", title: "步驟序號", type: "string" },
                { name: "title", title: "步驟標題", type: "string" },
                { name: "desc", title: "步驟說明", type: "text" },
              ],
            },
          ],
        },
        {
          name: "zh",
          title: "中文版",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "order", title: "步驟序號", type: "string" },
                { name: "title", title: "步驟標題", type: "string" },
                { name: "desc", title: "步驟說明", type: "text" },
              ],
            },
          ],
        },
        {
          name: "en",
          title: "English Version",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "order", title: "Step No.", type: "string" },
                { name: "title", title: "Title", type: "string" },
                { name: "desc", title: "Description", type: "text" },
              ],
            },
          ],
        },
      ],
      options: { collapsible: true, collapsed: false },
    }),

    /* ===== 費用 Fees ===== */
    defineField({
      name: "fees",
      title: "費用參考 Fees",
      type: "object",
      fields: [
        { name: "jp", title: "日本語版", type: "text" },
        { name: "zh", title: "中文版", type: "text" },
        { name: "en", title: "English Version", type: "text" },
      ],
      options: { collapsible: true, collapsed: false },
    }),

    /* ===== CTA ===== */
    defineField({
      name: "ctaLabel",
      title: "聯絡我們 CTA 文字",
      type: "object",
      fields: [
        { name: "jp", title: "日本語版", type: "string", initialValue: "お問い合わせはこちら" },
        { name: "zh", title: "中文版", type: "string", initialValue: "聯絡我們" },
        { name: "en", title: "English Version", type: "string", initialValue: "Contact Us" },
      ],
    }),

    /* ===== Hero 圖片（可選） ===== */
    defineField({
      name: "heroImage",
      title: "頂部封面圖",
      type: "image",
      options: { hotspot: true },
    }),
  ],

  preview: {
    select: { title: "titleZh", subtitle: "titleEn", media: "heroImage" },
  },
});
