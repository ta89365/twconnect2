// apps/cms/schemaTypes/twServiceDetail.ts
import { defineField, defineType, defineArrayMember } from "sanity";

/** ---------- Locale helpers ---------- */
const localeString = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "jp", title: "Japanese", type: "string" }),
      defineField({ name: "zh", title: "Chinese (Traditional)", type: "string" }),
      defineField({ name: "en", title: "English", type: "string" }),
    ],
  });

const localeText = (name: string, title: string, rows = 4) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "jp", title: "Japanese", type: "text", rows }),
      defineField({ name: "zh", title: "Chinese (Traditional)", type: "text", rows }),
      defineField({ name: "en", title: "English", type: "text", rows }),
    ],
  });

const localeStringArray = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "jp", title: "Japanese", type: "array", of: [defineArrayMember({ type: "string" })] }),
      defineField({ name: "zh", title: "Chinese (Traditional)", type: "array", of: [defineArrayMember({ type: "string" })] }),
      defineField({ name: "en", title: "English", type: "array", of: [defineArrayMember({ type: "string" })] }),
    ],
  });

/** ---------- Reusable row field sets ---------- */
const planRowFields = [
  localeString("plan", "Plan Name"),
  localeStringArray("services", "Service Content"),
  localeString("who", "Ideal For"),
  defineField({ name: "feeJpy", title: "Fee (JPY)", type: "string" }),
  localeText("notes", "Notes (Optional)", 3),
];

const commonRowFields = [
  localeString("name", "Row Title / Service Name"),
  localeStringArray("details", "Service Details / Items"),
  localeString("idealFor", "Ideal For / Target Customers"),
  defineField({ name: "feeJpy", title: "Fee (JPY)", type: "string" }),
  localeText("notes", "Notes (Optional)", 3),
];

/** ---------- Document ---------- */
export default defineType({
  name: "twServiceDetail",
  title: "Taiwan Market Entry Detail",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Service Title",
      type: "string",
      description: "English title used on page and to generate the slug.",
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 100 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alt Text", type: "string" })],
    }),

    /** ---------- Section heading: 料金（参考） / 費用（參考） / Fees (Reference) ---------- */
    localeString("feesSectionTitle", "Fees Section Title"),

    /** ---------- Originals kept ---------- */
    localeText("background", "Background", 4),

    defineField({
      name: "challenges",
      title: "Challenges",
      type: "object",
      fields: [
        defineField({ name: "jp", title: "Japanese", type: "array", of: [defineArrayMember({ type: "string" })] }),
        defineField({ name: "zh", title: "Chinese (Traditional)", type: "array", of: [defineArrayMember({ type: "string" })] }),
        defineField({ name: "en", title: "English", type: "array", of: [defineArrayMember({ type: "string" })] }),
      ],
    }),

    defineField({
      name: "services",
      title: "Service Items",
      type: "object",
      fields: [
        defineField({ name: "jp", title: "Japanese", type: "array", of: [defineArrayMember({ type: "string" })] }),
        defineField({ name: "zh", title: "Chinese (Traditional)", type: "array", of: [defineArrayMember({ type: "string" })] }),
        defineField({ name: "en", title: "English", type: "array", of: [defineArrayMember({ type: "string" })] }),
        defineField({
          name: "keywords",
          title: "Keywords",
          type: "object",
          fields: [
            defineField({ name: "jp", title: "Japanese", type: "array", of: [defineArrayMember({ type: "string" })] }),
            defineField({ name: "zh", title: "Chinese (Traditional)", type: "array", of: [defineArrayMember({ type: "string" })] }),
            defineField({ name: "en", title: "English", type: "array", of: [defineArrayMember({ type: "string" })] }),
          ],
        }),
      ],
    }),

    defineField({
      name: "serviceFlow",
      title: "Service Flow",
      type: "object",
      fields: [
        defineField({ name: "jp", title: "Japanese", type: "array", of: [defineArrayMember({ type: "string" })] }),
        defineField({ name: "zh", title: "Chinese (Traditional)", type: "array", of: [defineArrayMember({ type: "string" })] }),
        defineField({ name: "en", title: "English", type: "array", of: [defineArrayMember({ type: "string" })] }),
      ],
    }),

    defineField({
      name: "scheduleExample",
      title: "Schedule Example",
      type: "object",
      fields: [
        defineField({
          name: "jp",
          title: "Japanese",
          type: "array",
          of: [defineArrayMember({ type: "object", name: "jpScheduleBlock", fields: [
            defineField({ name: "title", type: "string", title: "Title" }),
            defineField({ name: "items", type: "array", title: "Items", of: [defineArrayMember({ type: "string" })] }),
          ]})],
        }),
        defineField({
          name: "zh",
          title: "Chinese (Traditional)",
          type: "array",
          of: [defineArrayMember({ type: "object", name: "zhScheduleBlock", fields: [
            defineField({ name: "title", type: "string", title: "Title" }),
            defineField({ name: "items", type: "array", title: "Items", of: [defineArrayMember({ type: "string" })] }),
          ]})],
        }),
        defineField({
          name: "en",
          title: "English",
          type: "array",
          of: [defineArrayMember({ type: "object", name: "enScheduleBlock", fields: [
            defineField({ name: "title", type: "string", title: "Title" }),
            defineField({ name: "items", type: "array", title: "Items", of: [defineArrayMember({ type: "string" })] }),
          ]})],
        }),
      ],
    }),

    /** ---------- New Fees Tables (structured by sections) ---------- */

    // I. Subsidiary plans (Light / Standard / Premium)
    defineField({
      name: "subsidiaryPlans",
      title: "I. Subsidiary Establishment Support – Plans",
      type: "array",
      of: [defineArrayMember({ type: "object", name: "planRow", title: "Plan Row", fields: planRowFields,
        preview: { select: { jp: "plan.jp", zh: "plan.zh", en: "plan.en" }, prepare: ({ jp, zh, en }) => ({ title: jp || zh || en || "(Unnamed Plan)" }) },
      })],
    }),

    // II. Branch Office Establishment Support (rows)
    defineField({
      name: "branchSupport",
      title: "II. Branch Office Establishment Support",
      type: "array",
      of: [defineArrayMember({ type: "object", name: "branchRow", title: "Branch Row", fields: commonRowFields,
        preview: { select: { jp: "name.jp", zh: "name.zh", en: "name.en" }, prepare: ({ jp, zh, en }) => ({ title: jp || zh || en || "(Branch Row)" }) },
      })],
    }),

    // III. Representative Office Establishment Support (rows)
    defineField({
      name: "repOfficeSupport",
      title: "III. Representative Office Establishment Support",
      type: "array",
      of: [defineArrayMember({ type: "object", name: "repOfficeRow", title: "Representative Office Row", fields: commonRowFields,
        preview: { select: { jp: "name.jp", zh: "name.zh", en: "name.en" }, prepare: ({ jp, zh, en }) => ({ title: jp || zh || en || "(Rep Office Row)" }) },
      })],
    }),

    // IV. Accounting & Tax Support (rows)
    defineField({
      name: "accountingTaxSupport",
      title: "IV. Accounting & Tax Support",
      type: "array",
      of: [defineArrayMember({ type: "object", name: "accountingTaxRow", title: "Accounting / Tax Row", fields: commonRowFields,
        preview: { select: { jp: "name.jp", zh: "name.zh", en: "name.en" }, prepare: ({ jp, zh, en }) => ({ title: jp || zh || en || "(Accounting/Tax Row)" }) },
      })],
    }),

    // V. Value-Added Services (rows)
    defineField({
      name: "valueAddedServices",
      title: "V. Value-Added Services (Optional)",
      type: "array",
      of: [defineArrayMember({ type: "object", name: "valueAddedRow", title: "Value-Added Row", fields: commonRowFields,
        preview: { select: { jp: "name.jp", zh: "name.zh", en: "name.en" }, prepare: ({ jp, zh, en }) => ({ title: jp || zh || en || "(Value-Added Row)" }) },
      })],
    }),

    /** ---------- CTA ---------- */
    localeString("ctaLabel", "CTA Button Label"),
    defineField({ name: "ctaLink", title: "CTA Link", type: "url" }),
  ],

  preview: {
    select: { title: "title", media: "coverImage" },
    prepare({ title, media }) {
      return { title: title || "(Untitled Service)", media };
    },
  },
});
