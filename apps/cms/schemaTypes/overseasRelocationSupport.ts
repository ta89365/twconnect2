// /schemas/twServices/overseasRelocationSupport.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "overseasRelocationSupport",
  title: "Relocation & Settlement Services",
  type: "document",
  fields: [
    /* ---- Basic Information ---- */
    defineField({
      name: "titleEn",
      title: "Service Title",
      type: "string",
      description: "Enter the English title of the service (e.g. Overseas Residence & Relocation Support).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (for URL)",
      type: "slug",
      description: "Used in the page URL. Automatically generated from the English Service Title.",
      options: { source: "titleEn", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Controls the display order of this service section on the website.",
    }),

    /* ---- Localized Titles ---- */
    defineField({
      name: "titleJp",
      title: "Service Title (Japanese)",
      type: "string",
      description: "Example: 海外居住・移住サポート",
      initialValue: "海外居住・移住サポート",
    }),
    defineField({
      name: "titleZh",
      title: "Service Title (Chinese)",
      type: "string",
      description: "Example: 海外居住／移居支援",
      initialValue: "海外居住／移居支援",
    }),

    /* ---- Hero Image ---- */
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description: "Main hero image displayed at the top of the page. Use a wide image and enable Hotspot for better control.",
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

    /* ---- Section 1: Background ---- */
    defineField({
      name: "backgroundJp",
      title: "Background (Japanese)",
      type: "text",
      description: "Short introductory background in Japanese.",
    }),
    defineField({
      name: "backgroundZh",
      title: "Background (Chinese)",
      type: "text",
      description: "Short introductory background in Chinese.",
    }),
    defineField({
      name: "backgroundEn",
      title: "Background (English)",
      type: "text",
      description: "Short introductory background in English.",
    }),

    /* ---- Section 2: Challenges ---- */
    defineField({
      name: "challengesJp",
      title: "Challenges (Japanese)",
      type: "array",
      of: [{ type: "string" }],
      description: "List of challenges (in Japanese).",
    }),
    defineField({
      name: "challengesZh",
      title: "Challenges (Chinese)",
      type: "array",
      of: [{ type: "string" }],
      description: "List of challenges (in Chinese).",
    }),
    defineField({
      name: "challengesEn",
      title: "Challenges (English)",
      type: "array",
      of: [{ type: "string" }],
      description: "List of challenges (in English).",
    }),

    /* ---- Section 3: Services ---- */
    defineField({
      name: "servicesJp",
      title: "Services (Japanese)",
      type: "array",
      of: [{ type: "string" }],
      description: "Detailed list of service contents (in Japanese).",
    }),
    defineField({
      name: "servicesZh",
      title: "Services (Chinese)",
      type: "array",
      of: [{ type: "string" }],
      description: "Detailed list of service contents (in Chinese).",
    }),
    defineField({
      name: "servicesEn",
      title: "Services (English)",
      type: "array",
      of: [{ type: "string" }],
      description: "Detailed list of service contents (in English).",
    }),

    /* ---- Section 4: Service Flow ---- */
    defineField({
      name: "flowStepsJp",
      title: "Service Flow (Japanese)",
      type: "array",
      description: "Step-by-step flow description (in Japanese).",
      of: [
        {
          type: "object",
          fields: [
            { name: "stepNumber", title: "Step Number", type: "string" },
            { name: "title", title: "Step Title", type: "string" },
            { name: "desc", title: "Description", type: "text" },
          ],
        },
      ],
    }),
    defineField({
      name: "flowStepsZh",
      title: "Service Flow (Chinese)",
      type: "array",
      description: "Step-by-step flow description (in Chinese).",
      of: [
        {
          type: "object",
          fields: [
            { name: "stepNumber", title: "Step Number", type: "string" },
            { name: "title", title: "Step Title", type: "string" },
            { name: "desc", title: "Description", type: "text" },
          ],
        },
      ],
    }),
    defineField({
      name: "flowStepsEn",
      title: "Service Flow (English)",
      type: "array",
      description: "Step-by-step flow description (in English).",
      of: [
        {
          type: "object",
          fields: [
            { name: "stepNumber", title: "Step Number", type: "string" },
            { name: "title", title: "Step Title", type: "string" },
            { name: "desc", title: "Description", type: "text" },
          ],
        },
      ],
    }),

    /* ---- Section 5: Fees ---- */
    defineField({
      name: "feesJp",
      title: "Fees (Japanese)",
      type: "array",
      of: [{ type: "string" }],
      description: "Fee information or reference notes (in Japanese).",
    }),
    defineField({
      name: "feesZh",
      title: "Fees (Chinese)",
      type: "array",
      of: [{ type: "string" }],
      description: "Fee information or reference notes (in Chinese).",
    }),
    defineField({
      name: "feesEn",
      title: "Fees (English)",
      type: "array",
      of: [{ type: "string" }],
      description: "Fee information or reference notes (in English).",
    }),

    /* ---- CTA ---- */
    defineField({
      name: "ctaLabelJp",
      title: "CTA Label (Japanese)",
      type: "string",
      description: "Button label (in Japanese). Example: お問い合わせはこちら",
      initialValue: "お問い合わせはこちら",
    }),
    defineField({
      name: "ctaLabelZh",
      title: "CTA Label (Chinese)",
      type: "string",
      description: "Button label (in Chinese). Example: 聯絡我們",
      initialValue: "聯絡我們",
    }),
    defineField({
      name: "ctaLabelEn",
      title: "CTA Label (English)",
      type: "string",
      description: "Button label (in English). Example: Contact Us",
      initialValue: "Contact Us",
    }),
  ],
});
