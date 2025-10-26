// apps/cms/schemaTypes/category.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    defineField({ name: "titleJp", title: "Title JP", type: "string", validation: r => r.required() }),
    defineField({ name: "titleZh", title: "Title ZH", type: "string" }),
    defineField({ name: "titleEn", title: "Title EN", type: "string" }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "titleEn", maxLength: 96 },
      validation: r => r.required(),
    }),
    defineField({
      name: "color",
      title: "Chip Color",
      type: "string",
      description: "Optional chip color key for front end mapping",
    }),
  ],
  preview: {
    select: { jp: "titleJp", zh: "titleZh", en: "titleEn" },
    prepare: ({ jp, zh, en }) => ({ title: jp || zh || en || "Category" }),
  },
});
