// apps/cms/schemaTypes/crossBorderSection.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "crossBorderSection", // ← 原本是 ipoSection
  title: "Cross-Border Service Section", // ← 左側顯示名稱
  type: "document",
  // 建議當成單一文件使用
  fields: [
    defineField({
      name: "headingZh",
      title: "主標題（中文）",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headingJp",
      title: "主標題（日文）",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headingEn",
      title: "主標題（英文）",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // 3 段文字
    defineField({ name: "para1Zh", title: "段落一（中文）", type: "text" }),
    defineField({ name: "para1Jp", title: "段落一（日文）", type: "text" }),
    defineField({ name: "para1En", title: "段落一（英文）", type: "text" }),

    defineField({ name: "para2Zh", title: "段落二（中文）", type: "text" }),
    defineField({ name: "para2Jp", title: "段落二（日文）", type: "text" }),
    defineField({ name: "para2En", title: "段落二（英文）", type: "text" }),

    defineField({ name: "para3Zh", title: "段落三（中文）", type: "text" }),
    defineField({ name: "para3Jp", title: "段落三（日文）", type: "text" }),
    defineField({ name: "para3En", title: "段落三（英文）", type: "text" }),

    // CTA
    defineField({
      name: "ctaTextZh",
      title: "CTA 文字（中文）",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaTextJp",
      title: "CTA 文字（日文）",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaTextEn",
      title: "CTA 文字（英文）",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaHref",
      title: "CTA 連結",
      type: "url",
      validation: (Rule) => Rule.uri({ allowRelative: true }).required(),
    }),

    // 背景圖（支援 hotspot）
    defineField({
      name: "bgImage",
      title: "背景圖片",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      titleJp: "headingJp",
      media: "bgImage",
    },
    prepare({ titleJp, media }) {
      return {
        title: titleJp || "Cross-Border Service Section",
        subtitle: "三段文字 + CTA + 背景圖",
        media,
      };
    },
  },
});
