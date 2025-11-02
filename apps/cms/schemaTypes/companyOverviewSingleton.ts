// File: apps/cms/schemaTypes/companyOverviewSingleton.ts
import { defineType, defineField } from "sanity"

/** Value Item */
const valueItem = defineType({
  name: "valueItem",
  title: "Value Item",
  type: "object",
  fields: [
    defineField({ name: "order", type: "number", title: "Order", validation: (r) => r.required() }),
    defineField({
      name: "key",
      type: "string",
      title: "Key (e.g., local-expertise, grow-with-clients)",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "iconKey",
      type: "string",
      title: "Icon Key (mapped to lucide/custom icon)",
      description: "Examples: building-2, handshake, globe-2.",
    }),
    defineField({
      name: "title",
      type: "localeString", // ← 使用共用型別
      title: "Title (localized)",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descLong",
      type: "localeString",
      title: "Description Long (localized)",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descShort",
      type: "localeString",
      title: "Description Short (localized, used in 4-column icon section)",
      validation: (r) => r.required(),
    }),
  ],
})

/** Founder Profile */
const founderProfile = defineType({
  name: "founderProfile",
  title: "Founder",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Name (localized)",
      type: "localeString",
      description: "Example: jp=洪 靖文 / zh=洪靖文 / en=Winny Hung",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Title (localized)",
      type: "localeString",
      description: "Example: Representative Director / Managing Director.",
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt Text" }],
    }),
    defineField({
      name: "credentials",
      title: "Credentials (free text, multiple)",
      type: "array",
      of: [{ type: "string" }],
      description: "Example: USCPA, Taiwan CPA, Big4 audit, cross-border advisory.",
    }),
    defineField({
      name: "bioLong",
      title: "Biography Long (localized)",
      type: "localeBlock", // ← 使用共用型別
      validation: (r) => r.required(),
    }),
    defineField({
      name: "bioShort",
      title: "Biography Short (localized)",
      type: "localeString",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "social",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "email", type: "string", title: "Email" }),
        defineField({ name: "linkedin", type: "url", title: "LinkedIn" }),
        defineField({ name: "website", type: "url", title: "Website" }),
      ],
    }),
  ],
})

const companyOverviewSingleton = defineType({
  name: "companyOverviewSingleton",
  title: "Company Overview",
  type: "document",
  fields: [
    // ===== Global Branding =====
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          validation: (r) => r.min(2),
        }),
      ],
      description: "Upload the brand logo. The frontend may use it in Navigation / Footer.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "logoText",
      type: "string",
      title: "Logo Text (display name beside the logo)",
      description: "Example: Taiwan Connect Inc.",
      validation: (r) => r.required(),
    }),

    // ===== Heading / Tagline / Top Image =====
    defineField({
      name: "heading",
      title: "Heading (localized)",
      type: "localeString",
      description: "Example: Mission and Company Profile.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "headingTaglines",
      title: "Heading Taglines (localized, multiple lines)",
      type: "localeStringArray",
    }),
    defineField({
      name: "topImage",
      title: "Top Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt Text" }),
      ],
      description: "Hero/banner image at the top of the overview page.",
      validation: (r) => r.required(),
    }),

    // ===== Mission & Vision =====
    defineField({ name: "mission", title: "Mission (localized)", type: "localeBlock", validation: (r) => r.required() }),
    defineField({ name: "vision", title: "Vision (localized)", type: "localeBlock", validation: (r) => r.required() }),
    defineField({
      name: "visionShort",
      title: "Vision Short Cards (localized, multiple lines per language)",
      type: "localeStringArray",
      description: "Used for card-style short lines; if empty, the frontend may fall back to the vision block.",
    }),

    // ===== Values =====
    defineField({
      name: "values",
      title: "Values",
      type: "array",
      of: [{ type: "valueItem" }],
      validation: (r) => r.min(4).max(12),
    }),

    // ===== Founder / Co-Founder =====
    defineField({ name: "founder", title: "About the Founder", type: "founderProfile", validation: (r) => r.required() }),
    defineField({ name: "coFounder", title: "Co-Founder", type: "founderProfile" }),

    // ===== Representative Message =====
    defineField({ name: "repMessageLong", title: "Representative Message (Long, localized)", type: "localeBlock", validation: (r) => r.required() }),
    defineField({ name: "repMessageShort", title: "Representative Message (Short, localized)", type: "localeString", validation: (r) => r.required() }),

    // ===== Company Info =====
    defineField({
      name: "companyInfo",
      title: "Company Profile (localized)",
      type: "object",
      fields: [
        defineField({
          name: "jp",
          title: "Japanese",
          type: "object",
          fields: [
            defineField({ name: "companyName", type: "string", title: "Company Name" }),
            defineField({ name: "representative", type: "string", title: "Representative" }),
            defineField({ name: "activities", type: "array", title: "Business Activities", of: [{ type: "string" }] }),
            defineField({ name: "addressJapan", type: "string", title: "Address Japan" }),
            defineField({ name: "addressTaiwan", type: "string", title: "Address Taiwan" }),
          ],
        }),
        defineField({
          name: "zh",
          title: "Chinese",
          type: "object",
          fields: [
            defineField({ name: "companyName", type: "string", title: "Company Name" }),
            defineField({ name: "representative", type: "string", title: "Representative" }),
            defineField({ name: "activities", type: "array", title: "Business Activities", of: [{ type: "string" }] }),
            defineField({ name: "addressJapan", type: "string", title: "Address Japan" }),
            defineField({ name: "addressTaiwan", type: "string", title: "Address Taiwan" }),
          ],
        }),
        defineField({
          name: "en",
          title: "English",
          type: "object",
          fields: [
            defineField({ name: "companyName", type: "string", title: "Company Name" }),
            defineField({ name: "representative", type: "string", title: "Representative" }),
            defineField({ name: "activities", type: "array", title: "Business Activities", of: [{ type: "string" }] }),
            defineField({ name: "addressJapan", type: "string", title: "Address Japan" }),
            defineField({ name: "addressTaiwan", type: "string", title: "Address Taiwan" }),
          ],
        }),
      ],
    }),

    // ===== Contact CTA =====
    defineField({
      name: "contactCta",
      title: "Contact CTA (localized)",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "localeString", title: "Heading" }),
        defineField({ name: "subtext", type: "localeString", title: "Subtext" }),
        defineField({ name: "buttonText", type: "localeString", title: "Button Text" }),
        defineField({ name: "href", type: "string", title: "Link", description: "Example: /contact", initialValue: "/contact" }),
      ],
    }),
  ],
  preview: {
    select: { media: "logo" },
    prepare({ media }) {
      return { title: "Company Overview", media }
    },
  },
})

export default companyOverviewSingleton

// 只匯出本檔自有子型別，避免把共用 locale* 再次註冊
export const companyOverviewTypes = [
  valueItem,
  founderProfile,
]
