// apps/cms/schemaTypes/serviceFollowup.ts
import { defineType, defineField } from "sanity";
import { ImageIcon } from "@sanity/icons";

export default defineType({
  name: "serviceFollowup",
  title: "Service Follow-up",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "enabled",
      title: "啟用",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "排序",
      type: "number",
      description: "若未使用單例 desk 結構，可用排序控制位置",
      validation: (Rule) => Rule.min(0).integer(),
      initialValue: 0,
    }),
    defineField({
      name: "bgImage",
      title: "背景大圖",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "overlay",
      title: "深色遮罩不透明度",
      type: "number",
      description: "0 到 1，建議 0.25–0.55",
      validation: (Rule) => Rule.min(0).max(1),
      initialValue: 0.35,
    }),

    // 三塊文字
    defineField({ name: "block1", title: "文字區塊 1", type: "mlText", validation: (Rule) => Rule.required() }),
    defineField({ name: "block2", title: "文字區塊 2", type: "mlText" }),
    defineField({ name: "block3", title: "文字區塊 3", type: "mlText" }),

    // CTA
    defineField({ name: "cta", title: "CTA", type: "cta", validation: (Rule) => Rule.required() }),

    // 版面與對齊
    defineField({
      name: "contentAlign",
      title: "文字對齊",
      type: "string",
      options: {
        list: [
          { title: "置左", value: "left" },
          { title: "置中", value: "center" },
          { title: "置右", value: "right" },
        ],
        layout: "radio",
      },
      initialValue: "left",
    }),
  ],
  preview: {
    select: {
      title: "block1.zh",
      media: "bgImage",
      enabled: "enabled",
    },
    prepare: ({ title, media, enabled }) => ({
      title: title || "Service 後附加區塊",
      subtitle: enabled ? "Enabled" : "Disabled",
      media,
    }),
  },
});
