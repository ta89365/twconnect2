// apps/cms/schemaTypes/post.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "post",
  title: "News & Columns",
  type: "document",
  fields: [
    /* ===== Channel ===== */
    defineField({
      name: "channel",
      title: "Channel",
      type: "string",
      description: "Select whether this content belongs to News or Column.",
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

    /* ===== Publication Info ===== */
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      description: "Date and time when the post was published.",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: "isFeatured",
      title: "Featured on Entrance",
      type: "boolean",
      initialValue: false,
      description: "If enabled, this post will appear on the News/Column entrance page.",
    }),
    defineField({
      name: "pinnedAtTop",
      title: "Pin to Top",
      type: "boolean",
      initialValue: false,
      description: "If enabled, this post will stay pinned at the top of its list.",
    }),
    defineField({
      name: "showOnHome",
      title: "Show on Home",
      type: "boolean",
      initialValue: false,
      description: "If enabled, this post will be displayed on the homepage article section.",
    }),

    /* ===== Category & Tags ===== */
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      description: "Select the category that this post belongs to.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      description: "Optional tags associated with this post.",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      description: "Author or contributor of the post.",
    }),

    /* ===== Cover & Gallery ===== */
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Alternative text for the cover image.",
        }),
      ],
      validation: (r) => r.required(),
      description: "Main image shown as the post thumbnail or banner.",
    }),
    defineField({
      name: "gallery",
      title: "Gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      description: "Optional gallery of images used within the post.",
    }),

    /* ===== Multi-language Slugs ===== */
    defineField({
      name: "slugJp",
      title: "Slug JP",
      type: "slug",
      description: "Slug for the Japanese version of this post.",
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
      description: "Slug for the Traditional Chinese version of this post.",
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
      description: "Slug for the English version of this post.",
      options: {
        source: "titleEn",
        maxLength: 96,
        slugify: (s) =>
          s?.toString().trim().toLowerCase().replace(/\s+/g, "-").slice(0, 96),
      },
    }),

    /* ===== Multi-language Titles & Excerpts ===== */
    defineField({
      name: "titleJp",
      title: "Title JP",
      type: "string",
      description: "Japanese title of the post.",
    }),
    defineField({
      name: "titleZh",
      title: "Title ZH",
      type: "string",
      description: "Traditional Chinese title of the post.",
    }),
    defineField({
      name: "titleEn",
      title: "Title EN",
      type: "string",
      description: "English title of the post.",
    }),
    defineField({
      name: "excerptJp",
      title: "Excerpt JP",
      type: "text",
      rows: 3,
      description: "Short summary for the Japanese version.",
    }),
    defineField({
      name: "excerptZh",
      title: "Excerpt ZH",
      type: "text",
      rows: 3,
      description: "Short summary for the Traditional Chinese version.",
    }),
    defineField({
      name: "excerptEn",
      title: "Excerpt EN",
      type: "text",
      rows: 3,
      description: "Short summary for the English version.",
    }),

    /* ===== Multi-language Body (Portable Text) ===== */
    defineField({
      name: "bodyJp",
      title: "Body JP",
      type: "array",
      description: "Main article body for the Japanese version.",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "bodyZh",
      title: "Body ZH",
      type: "array",
      description: "Main article body for the Traditional Chinese version.",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "bodyEn",
      title: "Body EN",
      type: "array",
      description: "Main article body for the English version.",
      of: [{ type: "block" }, { type: "image", options: { hotspot: true } }],
    }),

    /* ===== SEO (Multi-language) ===== */
    defineField({
      name: "seoTitleJp",
      title: "SEO Title JP",
      type: "string",
      description: "SEO title for the Japanese version.",
    }),
    defineField({
      name: "seoTitleZh",
      title: "SEO Title ZH",
      type: "string",
      description: "SEO title for the Traditional Chinese version.",
    }),
    defineField({
      name: "seoTitleEn",
      title: "SEO Title EN",
      type: "string",
      description: "SEO title for the English version.",
    }),
    defineField({
      name: "seoDescriptionJp",
      title: "SEO Description JP",
      type: "text",
      rows: 3,
      description: "SEO description for the Japanese version.",
    }),
    defineField({
      name: "seoDescriptionZh",
      title: "SEO Description ZH",
      type: "text",
      rows: 3,
      description: "SEO description for the Traditional Chinese version.",
    }),
    defineField({
      name: "seoDescriptionEn",
      title: "SEO Description EN",
      type: "text",
      rows: 3,
      description: "SEO description for the English version.",
    }),

    /* ===== Auto-generated Field ===== */
    defineField({
      name: "readingMinutes",
      title: "Reading Minutes",
      type: "number",
      readOnly: true,
      description: "Automatically calculated estimated reading time (in minutes).",
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
      title: "Newest first",
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
      showOnHome: "showOnHome",
    },
    prepare(sel) {
      const baseTitle = sel.titleJp || sel.titleZh || sel.titleEn || "Untitled";
      const title = sel.showOnHome ? `[HOME] ${baseTitle}` : baseTitle;
      return {
        title,
        subtitle: sel.date ? new Date(sel.date).toLocaleString() : "",
        media: sel.media,
      };
    },
  },
});
