// apps/cms/schemas/financeAdvisoryDetail.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "financeAdvisoryDetail",
  title: "Financial & Accounting Advisory / 海外發展支援",
  type: "document",
  fields: [
    /* ========== 基本資訊 ========== */
    defineField({
      name: "title",
      title: "標題 Title",
      type: "object",
      fields: [
        { name: "jp", title: "日本語", type: "string" },
        { name: "zh", title: "繁體中文", type: "string" },
        { name: "en", title: "English", type: "string" },
      ],
    }),

    defineField({
      name: "slug",
      title: "Slug（網址代稱）",
      type: "slug",
      options: { source: "title.zh", maxLength: 96 },
    }),

    defineField({
      name: "heroImage",
      title: "Hero Image / 封面圖片",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt文字", type: "string" }],
    }),

    /* ========== Section 1: 背景 / Background ========== */
    defineField({
      name: "background",
      title: "背景 / Background",
      type: "object",
      fields: [
        { name: "jp", title: "日本語", type: "text" },
        { name: "zh", title: "繁體中文", type: "text" },
        { name: "en", title: "English", type: "text" },
      ],
    }),

    /* ========== Section 2: 課題 / Challenges ========== */
    defineField({
      name: "challenges",
      title: "課題 / Challenges",
      type: "object",
      fields: [
        {
          name: "jp",
          title: "日本語版",
          type: "array",
          of: [{ type: "string", title: "課題項目" }],
        },
        {
          name: "zh",
          title: "繁體中文版",
          type: "array",
          of: [{ type: "string", title: "挑戰項目" }],
        },
        {
          name: "en",
          title: "English Version",
          type: "array",
          of: [{ type: "string", title: "Challenge Item" }],
        },
      ],
    }),

    /* ========== Section 3: 服務內容 / Services ========== */
    defineField({
      name: "services",
      title: "服務內容 / Services",
      type: "object",
      fields: [
        {
          name: "jp",
          title: "日本語版",
          type: "array",
          of: [{ type: "string", title: "サービス内容項目" }],
        },
        {
          name: "zh",
          title: "繁體中文版",
          type: "array",
          of: [{ type: "string", title: "服務項目" }],
        },
        {
          name: "en",
          title: "English Version",
          type: "array",
          of: [{ type: "string", title: "Service Item" }],
        },
      ],
    }),

    /* ========== Section 4: 服務流程 / Service Flow ========== */
    defineField({
      name: "serviceFlow",
      title: "服務流程 / Service Flow",
      type: "object",
      fields: [
        {
          name: "jp",
          title: "日本語版",
          type: "array",
          of: [
            defineField({
              type: "object",
              fields: [
                { name: "step", title: "步驟編號", type: "string" },
                { name: "desc", title: "說明", type: "text" },
              ],
            }),
          ],
        },
        {
          name: "zh",
          title: "繁體中文版",
          type: "array",
          of: [
            defineField({
              type: "object",
              fields: [
                { name: "step", title: "步驟編號", type: "string" },
                { name: "desc", title: "說明", type: "text" },
              ],
            }),
          ],
        },
        {
          name: "en",
          title: "English Version",
          type: "array",
          of: [
            defineField({
              type: "object",
              fields: [
                { name: "step", title: "Step", type: "string" },
                { name: "desc", title: "Description", type: "text" },
              ],
            }),
          ],
        },
      ],
    }),

    /* ========== Section 5: 費用參考 / Fees ========== */
    defineField({
      name: "fees",
      title: "費用（參考） / Fees (Reference)",
      type: "object",
      fields: [
        {
          name: "jp",
          title: "日本語版",
          type: "object",
          fields: [
            { name: "title", title: "標題", type: "string" },
            { name: "items", title: "內容", type: "array", of: [{ type: "string" }] },
          ],
        },
        {
          name: "zh",
          title: "繁體中文版",
          type: "object",
          fields: [
            { name: "title", title: "標題", type: "string" },
            { name: "items", title: "內容", type: "array", of: [{ type: "string" }] },
          ],
        },
        {
          name: "en",
          title: "English Version",
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "items", title: "Items", type: "array", of: [{ type: "string" }] },
          ],
        },
      ],
    }),

    /* ========== 排序與顯示控制 ========== */
    defineField({
      name: "order",
      title: "顯示順序",
      type: "number",
    }),

    defineField({
      name: "publishedAt",
      title: "發布時間",
      type: "datetime",
    }),
  ],

  preview: {
    select: {
      title: "title.zh",
      media: "heroImage",
    },
    prepare({ title, media }) {
      return {
        title: title || "未命名服務",
        subtitle: "Financial & Accounting Advisory",
        media,
      };
    },
  },
});
