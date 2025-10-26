// schemas/twServiceDetail.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "twServiceDetail",
  title: "Taiwan Service Detail (台灣相關服務詳情)",
  type: "document",
  fields: [
    /* ========== 基本資訊 ========== */
    defineField({
      name: "title",
      title: "Service Title (服務名稱)",
      type: "object",
      fields: [
        { name: "zh", type: "string", title: "中文" },
        { name: "jp", type: "string", title: "日本語" },
        { name: "en", type: "string", title: "English" },
      ],
    }),

    defineField({
      name: "slug",
      title: "Slug (網址代稱)",
      type: "slug",
      options: { source: "title.en", maxLength: 100 },
    }),

    defineField({
      name: "coverImage",
      title: "Hero Image / 封面圖片",
      type: "image",
      options: { hotspot: true },
    }),

    /* ========== 背景 ========== */
    defineField({
      name: "background",
      title: "Background / 背景說明",
      type: "object",
      fields: [
        { name: "zh", type: "text", title: "中文" },
        { name: "jp", type: "text", title: "日本語" },
        { name: "en", type: "text", title: "English" },
      ],
    }),

    /* ========== 挑戰 (Challenge) ========== */
    defineField({
      name: "challenges",
      title: "Challenges / 課題・挑戰",
      type: "object",
      fields: [
        { name: "zh", type: "array", of: [{ type: "string" }], title: "中文" },
        { name: "jp", type: "array", of: [{ type: "string" }], title: "日本語" },
        { name: "en", type: "array", of: [{ type: "string" }], title: "English" },
      ],
    }),

    /* ========== 服務內容 (Services) ========== */
    defineField({
      name: "services",
      title: "Service Items / 服務內容",
      type: "object",
      fields: [
        { name: "zh", type: "array", of: [{ type: "string" }], title: "中文" },
        { name: "jp", type: "array", of: [{ type: "string" }], title: "日本語" },
        { name: "en", type: "array", of: [{ type: "string" }], title: "English" },
        {
          name: "keywords",
          title: "Keywords / 關鍵詞",
          type: "object",
          fields: [
            { name: "zh", type: "array", of: [{ type: "string" }], title: "中文" },
            { name: "jp", type: "array", of: [{ type: "string" }], title: "日本語" },
            { name: "en", type: "array", of: [{ type: "string" }], title: "English" },
          ],
        },
      ],
    }),

    /* ========== 服務流程 (Service Flow) ========== */
    defineField({
      name: "serviceFlow",
      title: "Service Flow / 服務流程",
      type: "object",
      fields: [
        { name: "zh", type: "array", of: [{ type: "string" }], title: "中文" },
        { name: "jp", type: "array", of: [{ type: "string" }], title: "日本語" },
        { name: "en", type: "array", of: [{ type: "string" }], title: "English" },
      ],
    }),

    /* ========== 時程範例 (Schedule Example) ========== */
    defineField({
      name: "scheduleExample",
      title: "Schedule Example / 時程範例",
      type: "object",
      fields: [
        {
          name: "zh",
          type: "array",
          of: [{ type: "object", fields: [
            { name: "title", type: "string", title: "標題" },
            { name: "items", type: "array", of: [{ type: "string" }], title: "內容" },
          ]}],
          title: "中文",
        },
        {
          name: "jp",
          type: "array",
          of: [{ type: "object", fields: [
            { name: "title", type: "string", title: "タイトル" },
            { name: "items", type: "array", of: [{ type: "string" }], title: "内容" },
          ]}],
          title: "日本語",
        },
        {
          name: "en",
          type: "array",
          of: [{ type: "object", fields: [
            { name: "title", type: "string", title: "Title" },
            { name: "items", type: "array", of: [{ type: "string" }], title: "Items" },
          ]}],
          title: "English",
        },
      ],
    }),

    /* ========== 費用 (Fees) ========== */
    defineField({
      name: "fees",
      title: "Fees (Reference) / 費用參考",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "category", type: "string", title: "Category / 類別" },
            {
              name: "entries",
              title: "Fee Entries / 費用項目",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    {
                      name: "serviceName",
                      title: "Service Name (多語系)",
                      type: "object",
                      fields: [
                        { name: "zh", type: "string", title: "中文" },
                        { name: "jp", type: "string", title: "日本語" },
                        { name: "en", type: "string", title: "English" },
                      ],
                    },
                    { name: "fee", type: "string", title: "費用 (JPY)" },
                    {
                      name: "notes",
                      title: "備註 (多語系)",
                      type: "object",
                      fields: [
                        { name: "zh", type: "string", title: "中文" },
                        { name: "jp", type: "string", title: "日本語" },
                        { name: "en", type: "string", title: "English" },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),

    /* ========== CTA ========== */
    defineField({
      name: "ctaLabel",
      title: "CTA Button Label (多語系)",
      type: "object",
      fields: [
        { name: "zh", type: "string", title: "中文" },
        { name: "jp", type: "string", title: "日本語" },
        { name: "en", type: "string", title: "English" },
      ],
    }),

    defineField({
      name: "ctaLink",
      title: "CTA Link (e.g. Contact Page)",
      type: "url",
    }),
  ],
});
