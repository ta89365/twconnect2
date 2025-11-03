// apps/cms/schemaTypes/post.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "post",
  title: "News & Columns",
  type: "document",
  fields: [
    // 內容頻道區分：news 或 column
    defineField({
      name: "channel",
      title: "Channel",
      type: "string",
      description: "內容頻道。news 為新聞動態，column 為專欄文章。",
      options: {
        list: [
          { title: "News", value: "news" },
          { title: "Column", value: "column" },
        ],
        layout: "radio",
      },
      initialValue: "news",
      validation: (r) => r.required(),
    }),

    /* ===== 發佈與中台資訊 ===== */
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "isFeatured",
      title: "Featured on Entrance",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "pinnedAtTop",
      title: "Pin to Top",
      type: "boolean",
      initialValue: false,
    }),

    /* ===== 類別與標籤 ===== */
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),

    /* ===== 封面與圖庫 ===== */
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string" }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),

    /* ===== 多語 slug ===== */
    defineField({
      name: "slugJp",
      title: "Slug JP",
      type: "slug",
      options: {
        source: "titleJp",
        maxLength: 96,
        slugify: (s) =>
          s?.toString().trim().toLowerCase().replace(/\s+/g, "-").slice(0, 96),
      },
    }),
    defineField({
      name: "slugZh",
      title: "Slug ZH",
      type: "slug",
      options: {
        source: "titleZh",
        maxLength: 96,
        slugify: (s) =>
          s?.toString().trim().toLowerCase().replace(/\s+/g, "-").slice(0, 96),
      },
    }),
    defineField({
      name: "slugEn",
      title: "Slug EN",
      type: "slug",
      options: {
        source: "titleEn",
        maxLength: 96,
        slugify: (s) =>
          s?.toString().trim().toLowerCase().replace(/\s+/g, "-").slice(0, 96),
      },
    }),

    /* ===== 多語標題與摘要 ===== */
    defineField({ name: "titleJp", title: "Title JP", type: "string" }),
    defineField({ name: "titleZh", title: "Title ZH", type: "string" }),
    defineField({ name: "titleEn", title: "Title EN", type: "string" }),
    defineField({ name: "excerptJp", title: "Excerpt JP", type: "text", rows: 3 }),
    defineField({ name: "excerptZh", title: "Excerpt ZH", type: "text", rows: 3 }),
    defineField({ name: "excerptEn", title: "Excerpt EN", type: "text", rows: 3 }),

    /* ===== 多語內文（Portable Text）===== */
    defineField({
      name: "bodyJp",
      title: "Body JP",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "bodyZh",
      title: "Body ZH",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "bodyEn",
      title: "Body EN",
      type: "array",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),

    /* ===== SEO（多語）===== */
    defineField({ name: "seoTitleJp", title: "SEO Title JP", type: "string" }),
    defineField({ name: "seoTitleZh", title: "SEO Title ZH", type: "string" }),
    defineField({ name: "seoTitleEn", title: "SEO Title EN", type: "string" }),
    defineField({
      name: "seoDescriptionJp",
      title: "SEO Description JP",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "seoDescriptionZh",
      title: "SEO Description ZH",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "seoDescriptionEn",
      title: "SEO Description EN",
      type: "text",
      rows: 3,
    }),

    /* ===== 自動欄位 ===== */
    defineField({
      name: "readingMinutes",
      title: "Reading Minutes",
      type: "number",
      readOnly: true,
    }),
  ],

  orderings: [
    {
      title: "Pinned first, newest",
      name: "pinDescDateDesc",
      by: [
        { field: "pinnedAtTop", direction: "desc" },
        { field: "publishedAt", direction: "desc" },
      ],
    },
    {
      title: "Newest",
      name: "dateDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],

  preview: {
    select: {
      titleJp: "titleJp",
      titleZh: "titleZh",
      titleEn: "titleEn",
      media: "coverImage",
      date: "publishedAt",
    },
    prepare(sel) {
      const title = sel.titleJp || sel.titleZh || sel.titleEn || "Untitled";
      return {
        title,
        subtitle: sel.date ? new Date(sel.date).toLocaleString() : "",
        media: sel.media,
      };
    },
  },
});
