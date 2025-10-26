// apps/cms/schemaTypes/hero.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({ name: "bgImage", title: "背景圖（大圖）", type: "image", options: { hotspot: true } }),

    // 多語主標題
    defineField({ name: "headingZh", title: "主標題 ZH", type: "string" }),
    defineField({ name: "headingEn", title: "主標題 EN", type: "string" }),
    defineField({ name: "headingJp", title: "主標題 JP", type: "string" }),

    // 多語副標題
    defineField({ name: "subheadingZh", title: "副標題 ZH", type: "text" }),
    defineField({ name: "subheadingEn", title: "副標題 EN", type: "text" }),
    defineField({ name: "subheadingJp", title: "副標題 JP", type: "text" }),

    // 新增多語小標題
    defineField({ name: "subtitleZh", title: "小標題 ZH", type: "string" }),
    defineField({ name: "subtitleEn", title: "小標題 EN", type: "string" }),
    defineField({ name: "subtitleJp", title: "小標題 JP", type: "string" }),

    // 多語 CTA
    defineField({ name: "ctaTextZh", title: "CTA 按鈕文字 ZH", type: "string" }),
    defineField({ name: "ctaTextEn", title: "CTA 按鈕文字 EN", type: "string" }),
    defineField({ name: "ctaTextJp", title: "CTA 按鈕文字 JP", type: "string" }),
    defineField({ name: "ctaHref", title: "CTA 連結", type: "string" }),

    // 語言切換
    defineField({
      name: "languages",
      title: "語言切換",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "顯示文字", type: "string" }),
            defineField({ name: "href", title: "連結", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),

    // 舊版相容 隱藏
    defineField({ name: "heading", title: "Legacy 主標題", type: "string", hidden: true }),
    defineField({ name: "subheading", title: "Legacy 副標題", type: "text", hidden: true }),
    defineField({ name: "ctaText", title: "Legacy CTA 按鈕文字", type: "string", hidden: true }),
    defineField({ name: "ribbonMain", title: "Legacy 標語帶 大", type: "string", hidden: true }),
    defineField({ name: "ribbonSub", title: "Legacy 標語帶 小", type: "string", hidden: true }),
  ],
  preview: {
    select: { zh: "headingZh", en: "headingEn", jp: "headingJp" },
    prepare({ zh, en, jp }) {
      return { title: zh || en || jp || "Hero" };
    },
  },
});
