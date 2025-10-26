// /schemas/twServices/overseasRelocationSupport.ts

import { defineType, defineField } from "sanity";

export default defineType({
  name: "overseasRelocationSupport",
  title: "Overseas Residence & Relocation Support",
  type: "document",
  fields: [
    /* ---- Basic Metadata ---- */
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titleEn", maxLength: 96 },
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
    defineField({
      name: "titleJp",
      title: "Title (JP)",
      type: "string",
      initialValue: "海外居住・移住サポート",
    }),
    defineField({
      name: "titleZh",
      title: "Title (ZH)",
      type: "string",
      initialValue: "海外居住／移居支援",
    }),
    defineField({
      name: "titleEn",
      title: "Title (EN)",
      type: "string",
      initialValue: "Overseas Residence & Relocation Support",
    }),

    /* ---- Hero Image ---- */
    defineField({
      name: "heroImage",
      title: "Hero Image / 封面圖片",
      type: "image",
      options: { hotspot: true },
      description:
        "顯示於頁面頂端的主視覺圖片（建議寬幅圖，啟用 hotspot 便於裁切）",
      fields: [
        {
          name: "alt",
          title: "Alt text",
          type: "string",
          description: "為 SEO 與無障礙設計提供的圖片說明文字",
        },
      ],
    }),

    /* ---- Section 1: Background ---- */
    defineField({
      name: "backgroundJp",
      title: "Background (JP)",
      type: "text",
    }),
    defineField({
      name: "backgroundZh",
      title: "Background (ZH)",
      type: "text",
    }),
    defineField({
      name: "backgroundEn",
      title: "Background (EN)",
      type: "text",
    }),

    /* ---- Section 2: Challenges ---- */
    defineField({
      name: "challengesJp",
      title: "Challenges (JP)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "challengesZh",
      title: "Challenges (ZH)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "challengesEn",
      title: "Challenges (EN)",
      type: "array",
      of: [{ type: "string" }],
    }),

    /* ---- Section 3: Services ---- */
    defineField({
      name: "servicesJp",
      title: "Services (JP)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "servicesZh",
      title: "Services (ZH)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "servicesEn",
      title: "Services (EN)",
      type: "array",
      of: [{ type: "string" }],
    }),

    /* ---- Section 4: Service Flow ---- */
    defineField({
      name: "flowStepsJp",
      title: "Service Flow (JP)",
      type: "array",
      of: [
        defineField({
          name: "flowStepJp",
          type: "object",
          fields: [
            { name: "stepNumber", title: "Step Number", type: "string" },
            { name: "title", title: "Step Title", type: "string" },
            { name: "desc", title: "Description", type: "text" },
          ],
        }),
      ],
    }),
    defineField({
      name: "flowStepsZh",
      title: "Service Flow (ZH)",
      type: "array",
      of: [
        defineField({
          name: "flowStepZh",
          type: "object",
          fields: [
            { name: "stepNumber", title: "Step Number", type: "string" },
            { name: "title", title: "Step Title", type: "string" },
            { name: "desc", title: "Description", type: "text" },
          ],
        }),
      ],
    }),
    defineField({
      name: "flowStepsEn",
      title: "Service Flow (EN)",
      type: "array",
      of: [
        defineField({
          name: "flowStepEn",
          type: "object",
          fields: [
            { name: "stepNumber", title: "Step Number", type: "string" },
            { name: "title", title: "Step Title", type: "string" },
            { name: "desc", title: "Description", type: "text" },
          ],
        }),
      ],
    }),

    /* ---- Section 5: Fees ---- */
    defineField({
      name: "feesJp",
      title: "Fees (JP)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "feesZh",
      title: "Fees (ZH)",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "feesEn",
      title: "Fees (EN)",
      type: "array",
      of: [{ type: "string" }],
    }),

    /* ---- CTA ---- */
    defineField({
      name: "ctaLabelJp",
      title: "CTA Label (JP)",
      type: "string",
      initialValue: "お問い合わせはこちら",
    }),
    defineField({
      name: "ctaLabelZh",
      title: "CTA Label (ZH)",
      type: "string",
      initialValue: "Contact Us 聯絡我們",
    }),
    defineField({
      name: "ctaLabelEn",
      title: "CTA Label (EN)",
      type: "string",
      initialValue: "Contact Us",
    }),
  ],
});
