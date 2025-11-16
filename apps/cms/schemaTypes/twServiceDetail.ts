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
      defineField({ name: "zh", title: "Chinese", type: "string" }),
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
      defineField({ name: "zh", title: "Chinese", type: "text", rows }),
      defineField({ name: "en", title: "English", type: "text", rows }),
    ],
  });

const localeStringArray = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({
        name: "jp",
        title: "Japanese",
        type: "array",
        of: [defineArrayMember({ type: "string" })],
      }),
      defineField({
        name: "zh",
        title: "Chinese",
        type: "array",
        of: [defineArrayMember({ type: "string" })],
      }),
      defineField({
        name: "en",
        title: "English",
        type: "array",
        of: [defineArrayMember({ type: "string" })],
      }),
    ],
  });

/** ---------- Reusable row field sets ---------- */
// I. Plans rows
const planRowFields = [
  localeString("plan", "Plan Name"),
  localeStringArray("services", "Service Content"),
  localeString("who", "Ideal For"),
  // 多語系 Fee (JP/ZH/EN)
  localeString("fee", "Fee"),
  // 原本 feeJpy → 預估時間，改為多語系 Estimated Time
  localeString("feeJpy", "Estimated Time"),
  localeText("notes", "Notes (Optional)", 3),
];

// II–V 共用 rows
const commonRowFields = [
  localeString("name", "Row Title / Service Name"),
  localeStringArray("details", "Service Details / Items"),
  localeString("idealFor", "Ideal For / Target Customers"),
  // 多語系 Fee (JP/ZH/EN)
  localeString("fee", "Fee"),
  // 原本 feeJpy → 預估時間，改為多語系 Estimated Time
  localeString("feeJpy", "Estimated Time"),
  localeText("notes", "Notes (Optional)", 3),
];

/** ---------- Service flow step fields (title + description) ---------- */
const flowStepFields = [
  defineField({
    name: "title",
    title: "Step Title (First Line)",
    type: "string",
  }),
  defineField({
    name: "description",
    title: "Step Description (Second Line)",
    type: "text",
    rows: 3,
  }),
];

export default defineType({
  name: "twServiceDetail",
  title: "Taiwan Market Entry Detail",
  type: "document",
  fields: [
    // Label 改為 Title (EN)
    defineField({
      name: "title",
      title: "Title (EN)",
      type: "string",
      description:
        "Legacy English title used for slug. New multi-language fields below are preferred.",
      validation: (Rule) => Rule.required().min(2),
    }),
    defineField({ name: "titleJp", title: "Title (JP)", type: "string" }),
    defineField({ name: "titleZh", title: "Title (ZH)", type: "string" }),
    defineField({ name: "titleEn", title: "Title (EN)", type: "string" }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: (doc: any) =>
          doc.titleEn || doc.titleZh || doc.titleJp || doc.title || "service",
        maxLength: 100,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "coverImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),

    // ===== Meta / intro =====
    localeString("feesSectionTitle", "Fees Section Title"),
    localeText("background", "Background", 4),

    // ===== Flow / content =====
    defineField({
      name: "challenges",
      title: "Challenges",
      type: "object",
      fields: [
        defineField({
          name: "jp",
          title: "Japanese",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "zh",
          title: "Chinese",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "en",
          title: "English",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
      ],
    }),

    defineField({
      name: "services",
      title: "Service Items",
      type: "object",
      fields: [
        defineField({
          name: "jp",
          title: "Japanese",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "zh",
          title: "Chinese",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "en",
          title: "English",
          type: "array",
          of: [defineArrayMember({ type: "string" })],
        }),
        defineField({
          name: "keywords",
          title: "Keywords",
          type: "object",
          fields: [
            defineField({
              name: "jp",
              title: "Japanese",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({
              name: "zh",
              title: "Chinese",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
            defineField({
              name: "en",
              title: "English",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
        }),
      ],
    }),

    // ===== Service Flow with two lines per step =====
    defineField({
      name: "serviceFlow",
      title: "Service Flow",
      type: "object",
      fields: [
        defineField({
          name: "jp",
          title: "Japanese",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "jpFlowStep",
              title: "Step",
              fields: flowStepFields,
            }),
          ],
        }),
        defineField({
          name: "zh",
          title: "Chinese",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "zhFlowStep",
              title: "Step",
              fields: flowStepFields,
            }),
          ],
        }),
        defineField({
          name: "en",
          title: "English",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "enFlowStep",
              title: "Step",
              fields: flowStepFields,
            }),
          ],
        }),
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
          of: [
            defineArrayMember({
              type: "object",
              name: "jpScheduleBlock",
              fields: [
                defineField({ name: "title", type: "string", title: "Title" }),
                defineField({
                  name: "items",
                  type: "array",
                  title: "Items",
                  of: [defineArrayMember({ type: "string" })],
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "zh",
          title: "Chinese",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "zhScheduleBlock",
              fields: [
                defineField({ name: "title", type: "string", title: "Title" }),
                defineField({
                  name: "items",
                  type: "array",
                  title: "Items",
                  of: [defineArrayMember({ type: "string" })],
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "en",
          title: "English",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "enScheduleBlock",
              fields: [
                defineField({ name: "title", type: "string", title: "Title" }),
                defineField({
                  name: "items",
                  type: "array",
                  title: "Items",
                  of: [defineArrayMember({ type: "string" })],
                }),
              ],
            }),
          ],
        }),
      ],
    }),

    // ====== New multilingual table titles ======
    localeString("subsidiaryTitle", "Table Title – Subsidiary"),
    localeString("branchTitle", "Table Title – Branch"),
    localeString("repOfficeTitle", "Table Title – Representative Office"),
    localeString("accountingTaxTitle", "Table Title – Accounting & Tax"),
    localeString("valueAddedTitle", "Table Title – Value-Added Services"),

    // ====== New column titles for 5 tables ======
    defineField({
      name: "subsidiaryColumns",
      title: "Subsidiary Table – Column Titles (4 columns)",
      type: "object",
      fields: [
        localeString("col1", "Column 1 Title"),
        localeString("col2", "Column 2 Title"),
        localeString("col3", "Column 3 Title"),
        localeString("col4", "Column 4 Title"),
      ],
    }),
    defineField({
      name: "branchColumns",
      title: "Branch Table – Column Titles (3 columns)",
      type: "object",
      fields: [
        localeString("col1", "Column 1 Title"),
        localeString("col2", "Column 2 Title"),
        localeString("col3", "Column 3 Title"),
      ],
    }),
    defineField({
      name: "repOfficeColumns",
      title: "Representative Office Table – Column Titles (3 columns)",
      type: "object",
      fields: [
        localeString("col1", "Column 1 Title"),
        localeString("col2", "Column 2 Title"),
        localeString("col3", "Column 3 Title"),
      ],
    }),
    defineField({
      name: "accountingTaxColumns",
      title: "Accounting & Tax Table – Column Titles (3 columns)",
      type: "object",
      fields: [
        localeString("col1", "Column 1 Title"),
        localeString("col2", "Column 2 Title"),
        localeString("col3", "Column 3 Title"),
      ],
    }),
    defineField({
      name: "valueAddedColumns",
      title: "Value-Added Services Table – Column Titles (3 columns)",
      type: "object",
      fields: [
        localeString("col1", "Column 1 Title"),
        localeString("col2", "Column 2 Title"),
        localeString("col3", "Column 3 Title"),
      ],
    }),

    // ====== Table data ======
    defineField({
      name: "subsidiaryPlans",
      title: "I. Subsidiary Establishment Support – Plans",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "planRow",
          title: "Plan Row",
          fields: planRowFields,
          // 預覽顯示 plan.en
          preview: {
            select: {
              titleEn: "plan.en",
            },
            prepare({ titleEn }) {
              return { title: titleEn || "Untitled" };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "branchSupport",
      title: "II. Branch Office Establishment Support",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "branchRow",
          title: "Branch Row",
          fields: commonRowFields,
          // 預覽顯示 name.en
          preview: {
            select: {
              titleEn: "name.en",
            },
            prepare({ titleEn }) {
              return { title: titleEn || "Untitled" };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "repOfficeSupport",
      title: "III. Representative Office Establishment Support",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "repOfficeRow",
          title: "Representative Office Row",
          fields: commonRowFields,
          // 預覽顯示 name.en
          preview: {
            select: {
              titleEn: "name.en",
            },
            prepare({ titleEn }) {
              return { title: titleEn || "Untitled" };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "accountingTaxSupport",
      title: "IV. Accounting & Tax Support",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "accountingTaxRow",
          title: "Accounting / Tax Row",
          fields: commonRowFields,
          // 預覽顯示 name.en
          preview: {
            select: {
              titleEn: "name.en",
            },
            prepare({ titleEn }) {
              return { title: titleEn || "Untitled" };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "valueAddedServices",
      title: "V. Value-Added Services (Optional)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "valueAddedRow",
          title: "Value-Added Row",
          fields: commonRowFields,
          // 預覽顯示 name.en
          preview: {
            select: {
              titleEn: "name.en",
            },
            prepare({ titleEn }) {
              return { title: titleEn || "Untitled" };
            },
          },
        }),
      ],
    }),

    // CTA
    localeString("ctaLabel", "CTA Button Label"),
    defineField({ name: "ctaLink", title: "CTA Link", type: "url" }),
  ],

  // Document list 預覽：優先 titleEn，其次 legacy title
  preview: {
    select: {
      titleEn: "titleEn",
      titleLegacy: "title",
      media: "coverImage",
    },
    prepare({ titleEn, titleLegacy, media }) {
      const title = titleEn || titleLegacy;
      return { title: title || "(Untitled Service)", media };
    },
  },
});
