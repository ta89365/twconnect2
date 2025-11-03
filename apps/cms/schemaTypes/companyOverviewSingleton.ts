// File: apps/cms/schemaTypes/companyOverviewSingleton.ts
import { defineType, defineField } from "sanity"

/** Value Item */
const valueItem = defineType({
  name: "valueItem",
  title: "Value Item",
  type: "object",
  fields: [
    defineField({
      name: "order",
      type: "number",
      title: "Order",
      description: "Display order of this value item.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "key",
      type: "string",
      title: "Key (e.g., local-expertise, grow-with-clients)",
      description: "Unique key used for reference or translation mapping.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "iconKey",
      type: "string",
      title: "Icon Key (linked to Lucide/custom icons)",
      description: "Examples: building-2, handshake, globe-2.",
    }),
    defineField({
      name: "title",
      type: "localeString",
      title: "Title (localized)",
      description: "Value title for each supported language.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descLong",
      type: "localeString",
      title: "Long Description (localized)",
      description: "Detailed description for this value item.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "descShort",
      type: "localeString",
      title: "Short Description (localized, used in 4-column icon section)",
      description: "A concise version of the value description displayed in the overview icon section.",
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
      description: "Example: Representative Director or Managing Director.",
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      description: "Portrait photo of the founder.",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt Text", description: "Alternative text for accessibility and SEO." }],
    }),
    defineField({
      name: "credentials",
      title: "Credentials (multiple entries allowed)",
      type: "array",
      of: [{ type: "string" }],
      description: "Example: USCPA, Taiwan CPA, Big4 audit, cross-border advisory.",
    }),
    defineField({
      name: "bioLong",
      title: "Long Biography (localized)",
      type: "localeBlock",
      description: "Detailed introduction of the founder, used for the full profile section.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "bioShort",
      title: "Short Biography (localized)",
      type: "localeString",
      description: "Condensed version of the founder biography.",
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

/** Company Overview Singleton */
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
      description: "Upload the company logo. The frontend may display it in the navigation or footer.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          description: "Alternative text for accessibility and SEO.",
          validation: (r) => r.min(2),
        }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "logoText",
      type: "string",
      title: "Logo Text (display name beside logo)",
      description: "Example: Taiwan Connect Inc.",
      validation: (r) => r.required(),
    }),

    // ===== Heading / Tagline / Top Image =====
    defineField({
      name: "heading",
      title: "Heading (localized)",
      type: "localeString",
      description: "Main heading text, such as 'Mission and Company Profile'.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "headingTaglines",
      title: "Heading Taglines (localized, multiple lines)",
      type: "localeStringArray",
      description: "Multiple tagline lines displayed below the main heading.",
    }),
    defineField({
      name: "topImage",
      title: "Top Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", type: "string", title: "Alt Text", description: "Alternative text for accessibility and SEO." }),
      ],
      description: "Hero or banner image at the top of the company overview page.",
      validation: (r) => r.required(),
    }),

    // ===== Mission & Vision =====
    defineField({
      name: "mission",
      title: "Mission (localized)",
      type: "localeBlock",
      description: "Company mission statement.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "vision",
      title: "Vision (localized)",
      type: "localeBlock",
      description: "Company vision statement.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "visionShort",
      title: "Short Vision Cards (localized, multiple lines per language)",
      type: "localeStringArray",
      description: "Used for short card-style statements; if empty, the frontend may use the vision block as fallback.",
    }),

    // ===== Values =====
    defineField({
      name: "values",
      title: "Core Values",
      type: "array",
      of: [{ type: "valueItem" }],
      description: "Key values that represent the company’s mission and principles.",
      validation: (r) => r.min(4).max(12),
    }),

    // ===== Founder / Co-Founder =====
    defineField({
      name: "founder",
      title: "Founder Profile",
      type: "founderProfile",
      description: "Main founder profile information.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "coFounder",
      title: "Co-Founder Profile",
      type: "founderProfile",
      description: "Optional co-founder profile information.",
    }),

    // ===== Representative Message =====
    defineField({
      name: "repMessageLong",
      title: "Representative Message (Long, localized)",
      type: "localeBlock",
      description: "Full message or greeting from the company representative.",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "repMessageShort",
      title: "Representative Message (Short, localized)",
      type: "localeString",
      description: "Brief version of the representative message used in summaries.",
      validation: (r) => r.required(),
    }),

    // ===== Company Info =====
    defineField({
      name: "companyInfo",
      title: "Company Information (localized)",
      type: "object",
      description: "Basic company information displayed per language.",
      fields: [
        defineField({
          name: "jp",
          title: "Japanese",
          type: "object",
          fields: [
            defineField({ name: "companyName", type: "string", title: "Company Name" }),
            defineField({ name: "representative", type: "string", title: "Representative" }),
            defineField({ name: "activities", type: "array", title: "Business Activities", of: [{ type: "string" }] }),
            defineField({ name: "addressJapan", type: "string", title: "Address (Japan)" }),
            defineField({ name: "addressTaiwan", type: "string", title: "Address (Taiwan)" }),
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
            defineField({ name: "addressJapan", type: "string", title: "Address (Japan)" }),
            defineField({ name: "addressTaiwan", type: "string", title: "Address (Taiwan)" }),
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
            defineField({ name: "addressJapan", type: "string", title: "Address (Japan)" }),
            defineField({ name: "addressTaiwan", type: "string", title: "Address (Taiwan)" }),
          ],
        }),
      ],
    }),

    // ===== Contact CTA =====
    defineField({
      name: "contactCta",
      title: "Contact Call-to-Action (localized)",
      type: "object",
      description: "Localized text and link settings for the contact call-to-action section.",
      fields: [
        defineField({ name: "heading", type: "localeString", title: "Heading" }),
        defineField({ name: "subtext", type: "localeString", title: "Subtext" }),
        defineField({ name: "buttonText", type: "localeString", title: "Button Text" }),
        defineField({
          name: "href",
          type: "string",
          title: "Link URL",
          description: "Example: /contact",
          initialValue: "/contact",
        }),
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

// Export only locally defined subtypes to avoid duplicate registration
export const companyOverviewTypes = [valueItem, founderProfile]
