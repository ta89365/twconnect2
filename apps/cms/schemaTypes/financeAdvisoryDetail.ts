// apps/cms/schemas/financeAdvisoryDetail.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "financeAdvisoryDetail",
  title: "Financial & Accounting Advisory Services",
  type: "document",
  fields: [
    /* ========== Basic Information ========== */
    defineField({
      name: "title",
      title: "Service Title",
      type: "object",
      description: "Enter service titles in Japanese, Chinese, and English.",
      fields: [
        { name: "jp", title: "Japanese", type: "string" },
        { name: "zh", title: "Chinese", type: "string" },
        { name: "en", title: "English", type: "string" },
      ],
    }),

    defineField({
      name: "slug",
      title: "Slug (for URL)",
      type: "slug",
      description: "Used in the page URL. Automatically generated from the English title.",
      options: { source: "title.en", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description:
        "Main image displayed at the top of the page. Use a wide image and enable Hotspot for better control.",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Alternative text for accessibility and SEO.",
        },
      ],
    }),

    /* ========== Section 1: Background ========== */
    defineField({
      name: "background",
      title: "Background",
      type: "object",
      description: "Short introductory paragraph describing the background of this service.",
      fields: [
        { name: "jp", title: "Japanese", type: "text" },
        { name: "zh", title: "Chinese", type: "text" },
        { name: "en", title: "English", type: "text" },
      ],
    }),

    /* ========== Section 2: Challenges ========== */
    defineField({
      name: "challenges",
      title: "Challenges",
      type: "object",
      fields: [
        { name: "jp", title: "Japanese", type: "array", of: [{ type: "string" }] },
        { name: "zh", title: "Chinese", type: "array", of: [{ type: "string" }] },
        { name: "en", title: "English", type: "array", of: [{ type: "string" }] },
      ],
    }),

    /* ========== Section 3: Services ========== */
    defineField({
      name: "services",
      title: "Services",
      type: "object",
      fields: [
        { name: "jp", title: "Japanese", type: "array", of: [{ type: "string" }] },
        { name: "zh", title: "Chinese", type: "array", of: [{ type: "string" }] },
        { name: "en", title: "English", type: "array", of: [{ type: "string" }] },
      ],
    }),

    /* ========== Section 4: Service Flow ========== */
    defineField({
      name: "serviceFlow",
      title: "Service Flow",
      type: "object",
      description: "Step-by-step process explaining how the service is delivered.",
      fields: [
        {
          name: "jp",
          title: "Japanese",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "step", title: "Step Number", type: "string" },
                { name: "desc", title: "Description", type: "text" },
              ],
            },
          ],
        },
        {
          name: "zh",
          title: "Chinese",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "step", title: "Step Number", type: "string" },
                { name: "desc", title: "Description", type: "text" },
              ],
            },
          ],
        },
        {
          name: "en",
          title: "English",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "step", title: "Step Number", type: "string" },
                { name: "desc", title: "Description", type: "text" },
              ],
            },
          ],
        },
      ],
    }),

    /* ========== Section 5: Fees ========== */
    defineField({
      name: "fees",
      title: "Fees (Reference)",
      type: "object",
      description: "Reference pricing or example fee structure in multiple languages.",
      fields: [
        {
          name: "jp",
          title: "Japanese",
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "items", title: "Items", type: "array", of: [{ type: "string" }] },
          ],
        },
        {
          name: "zh",
          title: "Chinese",
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "items", title: "Items", type: "array", of: [{ type: "string" }] },
          ],
        },
        {
          name: "en",
          title: "English",
          type: "object",
          fields: [
            { name: "title", title: "Title", type: "string" },
            { name: "items", title: "Items", type: "array", of: [{ type: "string" }] },
          ],
        },
      ],
    }),

    /* ========== Display Settings ========== */
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),
  ],

  /* 讓 Studio 清單與文件標頭顯示 English 版 Service Title */
  preview: {
    select: { title: "title.en", media: "heroImage" },
    prepare({ title, media }) {
      return {
        title: title || "(Untitled Service)",
        media,
      };
    },
  },
});
