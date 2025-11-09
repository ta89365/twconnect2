// apps/cms/schemaTypes/crossBorderSection.ts
import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "crossBorderSection",
  title: "Cross-Border Advisory Section",
  type: "document",
  fields: [
    /* ===========================
     * Headings (multi-language)
     * =========================== */
    defineField({
      name: "headingZh",
      title: "Heading — Traditional Chinese (ZH)",
      type: "string",
      description: "Main headline shown on the homepage section when language is set to Traditional Chinese.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headingJp",
      title: "Heading — Japanese (JP)",
      type: "string",
      description: "Main headline shown on the homepage section when language is set to Japanese.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headingEn",
      title: "Heading — English (EN)",
      type: "string",
      description: "Main headline shown on the homepage section when language is set to English.",
      validation: (Rule) => Rule.required(),
    }),

    /* ===========================
     * Paragraphs (two only)
     * =========================== */
    defineField({
      name: "para1Zh",
      title: "Lead Line 1 — Traditional Chinese (ZH)",
      type: "text",
      description: "Short tagline line 1 displayed under the heading. Keep it concise.",
    }),
    defineField({
      name: "para1Jp",
      title: "Lead Line 1 — Japanese (JP)",
      type: "text",
      description: "Short tagline line 1 displayed under the heading. Keep it concise.",
    }),
    defineField({
      name: "para1En",
      title: "Lead Line 1 — English (EN)",
      type: "text",
      description: "Short tagline line 1 displayed under the heading. Keep it concise.",
    }),

    defineField({
      name: "para2Zh",
      title: "Lead Line 2 — Traditional Chinese (ZH)",
      type: "text",
      description: "Short tagline line 2 displayed under the heading. Optional.",
    }),
    defineField({
      name: "para2Jp",
      title: "Lead Line 2 — Japanese (JP)",
      type: "text",
      description: "Short tagline line 2 displayed under the heading. Optional.",
    }),
    defineField({
      name: "para2En",
      title: "Lead Line 2 — English (EN)",
      type: "text",
      description: "Short tagline line 2 displayed under the heading. Optional.",
    }),

    /* ===========================
     * CTA (main button under the block)
     * =========================== */
    defineField({
      name: "ctaTextZh",
      title: "CTA Text — Traditional Chinese (ZH)",
      type: "string",
      description: "Primary CTA button text for the section in Traditional Chinese.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaTextJp",
      title: "CTA Text — Japanese (JP)",
      type: "string",
      description: "Primary CTA button text for the section in Japanese.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaTextEn",
      title: "CTA Text — English (EN)",
      type: "string",
      description: "Primary CTA button text for the section in English.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaHref",
      title: "CTA Link (relative or absolute URL)",
      type: "url",
      description: "Target URL for the primary CTA. Relative paths are allowed (e.g., /global-advisory-hub).",
      validation: (Rule) => Rule.uri({ allowRelative: true }).required(),
    }),

    /* ===========================
     * Background image
     * =========================== */
    defineField({
      name: "bgImage",
      title: "Background Image",
      type: "image",
      description: "Hero-style background image for this section. Enable hotspot for better cropping.",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),

    /* ===========================================================
     * Left / Right Pillar: Financial Advisory & Overseas Support
     * － CTA fields removed per request
     * =========================================================== */
    defineField({
      name: "leftPillar",
      title: "Left Pillar — Financial & Accounting Advisory",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "titleZh",
          title: "Title — Traditional Chinese (ZH)",
          type: "string",
          description: "Left pillar title in Traditional Chinese.",
          initialValue: "財務會計顧問",
        }),
        defineField({
          name: "titleJp",
          title: "Title — Japanese (JP)",
          type: "string",
          description: "Left pillar title in Japanese.",
          initialValue: "財務・会計アドバイザリー",
        }),
        defineField({
          name: "titleEn",
          title: "Title — English (EN)",
          type: "string",
          description: "Left pillar title in English.",
          initialValue: "Financial & Accounting Advisory",
        }),
        defineField({
          name: "itemsZh",
          title: "Items — Traditional Chinese (ZH)",
          type: "array",
          description: "List of up to 6 bullet items for the left pillar in Traditional Chinese.",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "itemsJp",
          title: "Items — Japanese (JP)",
          type: "array",
          description: "List of up to 6 bullet items for the left pillar in Japanese.",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "itemsEn",
          title: "Items — English (EN)",
          type: "array",
          description: "List of up to 6 bullet items for the left pillar in English.",
          of: [defineArrayMember({ type: "string" })],
        }),
      ],
    }),

    defineField({
      name: "rightPillar",
      title: "Right Pillar — Overseas Expansion Support",
      type: "object",
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: "titleZh",
          title: "Title — Traditional Chinese (ZH)",
          type: "string",
          description: "Right pillar title in Traditional Chinese.",
          initialValue: "海外發展支援",
        }),
        defineField({
          name: "titleJp",
          title: "Title — Japanese (JP)",
          type: "string",
          description: "Right pillar title in Japanese.",
          initialValue: "海外展開支援",
        }),
        defineField({
          name: "titleEn",
          title: "Title — English (EN)",
          type: "string",
          description: "Right pillar title in English.",
          initialValue: "Overseas Expansion Support",
        }),
        defineField({
          name: "itemsZh",
          title: "Items — Traditional Chinese (ZH)",
          type: "array",
          description: "List of up to 6 bullet items for the right pillar in Traditional Chinese.",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "itemsJp",
          title: "Items — Japanese (JP)",
          type: "array",
          description: "List of up to 6 bullet items for the right pillar in Japanese.",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "itemsEn",
          title: "Items — English (EN)",
          type: "array",
          description: "List of up to 6 bullet items for the right pillar in English.",
          of: [defineArrayMember({ type: "string" })],
        }),
      ],
    }),
  ],

  preview: {
    select: {
      media: "bgImage",
      heading: "headingEn", // Use English for preview title
    },
    prepare({ media, heading }) {
      return {
        title: heading || "Cross-Border Advisory Section",
        subtitle: "Twin-column service overview (Financial & Overseas)",
        media,
      };
    },
  },
});
