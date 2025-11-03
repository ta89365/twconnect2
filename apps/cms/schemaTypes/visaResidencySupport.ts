// schemas/visaResidencySupport.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "visaResidencySupport",
  title: "Visa & Residency Services",
  type: "document",
  fields: [
    /* ===== Basic Info ===== */
    defineField({
      name: "titleEn",
      title: "Service Title",
      type: "string",
      description: "Enter the English title of the service (e.g. Visa & Residency Support).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (for URL)",
      type: "slug",
      description: "Used in the page URL. Automatically generated from the English title.",
      options: { source: "titleEn", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Controls the order in which this service appears on the website.",
    }),

    /* ===== Localized Titles ===== */
    defineField({
      name: "titleJp",
      title: "Service Title (Japanese)",
      type: "string",
      description: "Example: ビザ・居留サポート",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "titleZh",
      title: "Service Title (Chinese)",
      type: "string",
      description: "Example: 簽證與居留支援",
      validation: (Rule) => Rule.required(),
    }),

    /* ===== Background ===== */
    defineField({
      name: "background",
      title: "Background",
      type: "object",
      description: "Introductory paragraph describing the background of this service.",
      fields: [
        { name: "jp", title: "Japanese", type: "text" },
        { name: "zh", title: "Chinese", type: "text" },
        { name: "en", title: "English", type: "text" },
      ],
      options: { collapsible: true, collapsed: false },
    }),

    /* ===== Challenges ===== */
    defineField({
      name: "challenges",
      title: "Challenges",
      type: "object",
      description: "List of key challenges clients often face regarding this service.",
      fields: [
        { name: "jp", title: "Japanese", type: "array", of: [{ type: "string" }] },
        { name: "zh", title: "Chinese", type: "array", of: [{ type: "string" }] },
        { name: "en", title: "English", type: "array", of: [{ type: "string" }] },
      ],
      options: { collapsible: true, collapsed: false },
    }),

    /* ===== Services ===== */
    defineField({
      name: "services",
      title: "Service Details",
      type: "object",
      description: "Descriptions of the services provided within this category.",
      fields: [
        { name: "jp", title: "Japanese", type: "array", of: [{ type: "string" }] },
        { name: "zh", title: "Chinese", type: "array", of: [{ type: "string" }] },
        { name: "en", title: "English", type: "array", of: [{ type: "string" }] },
      ],
      options: { collapsible: true, collapsed: false },
    }),

    /* ===== Incubation Track ===== */
    defineField({
      name: "incubationTrack",
      title: "Incubation Track",
      type: "object",
      description: "Incubation track items, following the same format as Challenges and Service Details.",
      fields: [
        { name: "jp", title: "Japanese", type: "array", of: [{ type: "string" }] },
        { name: "zh", title: "Chinese", type: "array", of: [{ type: "string" }] },
        { name: "en", title: "English", type: "array", of: [{ type: "string" }] },
      ],
      options: { collapsible: true, collapsed: false },
    }),

    /* ===== Service Flow ===== */
    defineField({
      name: "serviceFlow",
      title: "Service Flow",
      type: "object",
      description: "Step-by-step explanation of the service process.",
      fields: [
        {
          name: "jp",
          title: "Japanese",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "order", title: "Step No.", type: "string" },
                { name: "title", title: "Title", type: "string" },
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
                { name: "order", title: "Step No.", type: "string" },
                { name: "title", title: "Title", type: "string" },
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
                { name: "order", title: "Step No.", type: "string" },
                { name: "title", title: "Title", type: "string" },
                { name: "desc", title: "Description", type: "text" },
              ],
            },
          ],
        },
      ],
      options: { collapsible: true, collapsed: false },
    }),

    /* ===== Fees ===== */
    defineField({
      name: "fees",
      title: "Fees",
      type: "object",
      description: "Fee information or pricing notes for each language version.",
      fields: [
        { name: "jp", title: "Japanese", type: "text" },
        { name: "zh", title: "Chinese", type: "text" },
        { name: "en", title: "English", type: "text" },
      ],
      options: { collapsible: true, collapsed: false },
    }),

    /* ===== CTA ===== */
    defineField({
      name: "ctaLabel",
      title: "CTA Button Label",
      type: "object",
      description: "Text for the call-to-action button (e.g., Contact Us).",
      fields: [
        { name: "jp", title: "Japanese", type: "string", initialValue: "お問い合わせはこちら" },
        { name: "zh", title: "Chinese", type: "string", initialValue: "聯絡我們" },
        { name: "en", title: "English", type: "string", initialValue: "Contact Us" },
      ],
    }),

    /* ===== Hero Image ===== */
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description: "Optional hero image displayed at the top of the page.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Alternative text for accessibility and SEO.",
        }),
      ],
    }),
  ],
});
