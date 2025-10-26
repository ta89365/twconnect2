// apps/cms/schemaTypes/about.ts
import { defineType, defineField } from "sanity";
import { DocumentIcon, ImageIcon } from "@sanity/icons";

export default defineType({
  name: "aboutSection",
  title: "About Section（多語：主標＋標語＋介紹＋CTA）",
  type: "document",
  icon: DocumentIcon,
  fields: [
    // 主標題（多語）
    defineField({ name: "titleZh", title: "主標題（中文）", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "titleJp", title: "主標題（日文）", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "titleEn", title: "主標題（英文）", type: "string", validation: (Rule) => Rule.required() }),

    // LOGO
    defineField({
      name: "logo",
      title: "LOGO 圖片",
      type: "image",
      options: { hotspot: false },
      validation: (Rule) => Rule.required(),
    }),

    // 主標語（多語）
    defineField({ name: "sloganMainZh", title: "主標語（中文）", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "sloganMainJp", title: "主標語（日文）", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "sloganMainEn", title: "主標語（英文）", type: "string", validation: (Rule) => Rule.required() }),

    // 副標語（多語）
    defineField({ name: "sloganSubZh", title: "副標語（中文）", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "sloganSubJp", title: "副標語（日文）", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "sloganSubEn", title: "副標語（英文）", type: "string", validation: (Rule) => Rule.required() }),

    // 核心介紹（多語，多段）
    defineField({
      name: "introZh",
      title: "核心介紹（中文，可多段）",
      type: "array",
      of: [{ type: "text" }],
      description: "可分段輸入，例如 3〜5 段，前端可逐段換行顯示。",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "introJp",
      title: "核心介紹（日文，可多段）",
      type: "array",
      of: [{ type: "text" }],
      description: "可分段輸入，例如 3〜5 段，前端可逐段換行顯示。",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "introEn",
      title: "核心介紹（英文，可多段）",
      type: "array",
      of: [{ type: "text" }],
      description: "可分段輸入，例如 3〜5 段，前端可逐段換行顯示。",
      validation: (Rule) => Rule.min(1),
    }),

    // CTA（多語文案＋單一連結）
    defineField({ name: "ctaTextZh", title: "CTA 文字（中文）", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "ctaTextJp", title: "CTA 文字（日文）", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "ctaTextEn", title: "CTA 文字（英文）", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "ctaHref",
      title: "CTA 連結",
      type: "url",
      validation: (Rule) => Rule.uri({ allowRelative: true }).required(),
      description: "可填相對路徑或完整網址，例如 /about、/ja/about",
    }),

    // 可選：背景圖（若要在 About 區塊鋪底）
    defineField({
      name: "bgImage",
      title: "背景圖片（選填）",
      type: "image",
      options: { hotspot: true },
    }),

    // 額外：排序與啟用
    defineField({ name: "order", title: "排序序號（選填）", type: "number", initialValue: 1 }),
    defineField({ name: "isActive", title: "啟用這個區塊", type: "boolean", initialValue: true }),
  ],

  preview: {
    select: {
      titleJp: "titleJp",
      sloganJp: "sloganMainJp",
      media: "logo",
    },
    prepare({ titleJp, sloganJp, media }) {
      return {
        title: titleJp || "About Section",
        subtitle: sloganJp || "主標＋標語＋介紹＋CTA",
        media: media || ImageIcon,
      };
    },
  },
});
