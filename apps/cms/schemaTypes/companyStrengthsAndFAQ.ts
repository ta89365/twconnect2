// schemas/companyStrengthsAndFAQ.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "companyStrengthsAndFAQ",
  title: "Our Strengths & FAQ（企業優勢與常見問題）",
  type: "document",

  fields: [
    /* ========== Hero 圖片欄位（新增） ========== */
    defineField({
      name: "heroImage",
      title: "Hero Image / 頂端背景圖",
      type: "image",
      description:
        "顯示於頁面頂端的主視覺背景圖（建議使用寬幅圖，啟用 Hotspot 以便控制焦點）",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text / 圖片說明文字",
          type: "string",
          description: "圖片替代文字（用於 SEO 與無障礙設計）",
        }),
      ],
    }),

    /* ========== 頂層設定 ========== */
    defineField({
      name: "title",
      title: "Section Title（如 Our Strengths）",
      type: "string",
      initialValue: "Our Strengths",
    }),

    /* ========== 企業優勢 ========== */
    defineField({
      name: "strengths",
      title: "Strength Items（企業優勢項目）",
      type: "array",
      of: [
        defineField({
          name: "strengthItem",
          title: "Strength Item",
          type: "object",
          fields: [
            defineField({
              name: "order",
              title: "Order（顯示順序）",
              type: "number",
            }),
            defineField({
              name: "icon",
              title: "Icon / Emoji（選填）",
              type: "string",
              description: "可填 emoji 或 Lucide 圖示代碼",
            }),

            /* ===== 多語標題 ===== */
            defineField({
              name: "titleJp",
              title: "Title (Japanese)",
              type: "string",
            }),
            defineField({
              name: "titleZh",
              title: "Title (Chinese)",
              type: "string",
            }),
            defineField({
              name: "titleEn",
              title: "Title (English)",
              type: "string",
            }),

            /* ===== 多語內文 ===== */
            defineField({
              name: "bodyJp",
              title: "Body (Japanese)",
              type: "text",
              rows: 5,
            }),
            defineField({
              name: "bodyZh",
              title: "Body (Chinese)",
              type: "text",
              rows: 5,
            }),
            defineField({
              name: "bodyEn",
              title: "Body (English)",
              type: "text",
              rows: 5,
            }),
          ],
          preview: {
            select: { title: "titleJp", subtitle: "order" },
            prepare({ title, subtitle }) {
              return { title, subtitle: `#${subtitle ?? ""}` };
            },
          },
        }),
      ],
    }),

    /* ========== FAQ 區塊 ========== */
    defineField({
      name: "faqTitle",
      title: "FAQ Section Title（如 よくある質問 / 常見問題 / FAQ）",
      type: "object",
      fields: [
        defineField({ name: "jp", title: "Japanese", type: "string" }),
        defineField({ name: "zh", title: "Chinese", type: "string" }),
        defineField({ name: "en", title: "English", type: "string" }),
      ],
    }),

    defineField({
      name: "faqIntro",
      title: "FAQ Intro Paragraph（導言說明文字）",
      type: "object",
      fields: [
        defineField({ name: "jp", title: "Japanese", type: "text", rows: 3 }),
        defineField({ name: "zh", title: "Chinese", type: "text", rows: 3 }),
        defineField({ name: "en", title: "English", type: "text", rows: 3 }),
      ],
    }),

    defineField({
      name: "faqItems",
      title: "FAQ Items（常見問題集）",
      type: "array",
      of: [
        defineField({
          name: "faqItem",
          title: "FAQ Item",
          type: "object",
          fields: [
            defineField({
              name: "order",
              title: "Order（顯示順序）",
              type: "number",
            }),

            /* ===== 多語問題 ===== */
            defineField({
              name: "questionJp",
              title: "Question (Japanese)",
              type: "string",
            }),
            defineField({
              name: "questionZh",
              title: "Question (Chinese)",
              type: "string",
            }),
            defineField({
              name: "questionEn",
              title: "Question (English)",
              type: "string",
            }),

            /* ===== 多語回答 ===== */
            defineField({
              name: "answerJp",
              title: "Answer (Japanese)",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "answerZh",
              title: "Answer (Chinese)",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "answerEn",
              title: "Answer (English)",
              type: "text",
              rows: 4,
            }),
          ],
          preview: {
            select: { title: "questionJp", subtitle: "order" },
            prepare({ title, subtitle }) {
              return { title, subtitle: `#${subtitle ?? ""}` };
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title ?? "Our Strengths & FAQ" };
    },
  },
});
