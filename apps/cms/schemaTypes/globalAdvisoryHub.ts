// apps/cms/schemaTypes/globalAdvisoryHub.ts
import { defineType, defineField, defineArrayMember } from "sanity";

/* ===================== Locale helpers ===================== */
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
    options: { collapsible: true, collapsed: false },
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
    options: { collapsible: true, collapsed: false },
  });

const localeStringArray = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({ name: "jp", title: "Japanese", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "zh", title: "Chinese (Traditional)", type: "array", of: [{ type: "string" }] }),
      defineField({ name: "en", title: "English", type: "array", of: [{ type: "string" }] }),
    ],
    options: { collapsible: true, collapsed: true },
  });

/* ===================== Document ===================== */
export default defineType({
  name: "globalAdvisoryHub",
  title: "Global Advisory Hub",
  type: "document",
  fields: [
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: (doc: any) => doc?.hero?.title?.en || "global-advisory-hub" },
      validation: (Rule) => Rule.required(),
    }),

    /* ---------- Hero ---------- */
    defineField({
      name: "hero",
      title: "Hero",
      type: "object",
      fields: [
        localeString("title", "Title"),
        localeText("subtitle", "Subtitle", 3),
        defineField({ name: "badge", title: "Trust Badge", type: "string", description: "e.g., TWCPA + USCPA" }),
        defineField({
          name: "bgImage",
          title: "Background Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
            defineField({ name: "objectPosition", title: "Object Position (CSS)", type: "string" }),
          ],
        }),
      ],
      options: { collapsible: true, collapsed: false },
    }),

    /* ---------- Introduction ---------- */
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "object",
      fields: [
        localeText("lead", "Lead Paragraph", 4),
        localeText("body", "Body Paragraph", 6),
        localeText("networkBlurb", "Network & On-ground Capability Blurb", 4),
        defineField({
          name: "stats",
          title: "Quantified Stats",
          type: "object",
          fields: [
            defineField({ name: "countriesCount", title: "Countries Supported", type: "string", description: "e.g., 10+" }),
            defineField({ name: "regions", title: "Regions List", type: "array", of: [{ type: "string" }] }),
          ],
        }),
      ],
      options: { collapsible: true, collapsed: false },
    }),

    /* ---------- Challenges ---------- */
    defineField({
      name: "challenges",
      title: "Challenges",
      type: "object",
      fields: [localeString("sectionTitle", "Section Title"), localeStringArray("items", "Bullet Items")],
      options: { collapsible: true, collapsed: true },
    }),

    /* ---------- Services / Dual Pillars ---------- */
    defineField({
      name: "services",
      title: "Core Services (Dual Pillars)",
      type: "object",
      fields: [
        localeText("intro", "Services Intro", 4),

        defineField({
          name: "financialAdvisory",
          title: "Financial & Accounting Advisory",
          type: "object",
          fields: [
            localeString("pillarTitle", "Pillar Title"),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    localeString("label", "Label"),
                    localeText("desc", "Description", 3),
                    defineField({
                      name: "icon",
                      title: "Icon",
                      type: "string",
                      description: "Lucide icon name or custom hint",
                    }),
                  ],
                  preview: {
                    select: { title: "label.en", subtitle: "icon" },
                    prepare({ title, subtitle }) {
                      return {
                        title: title || "Untitled item",
                        subtitle: subtitle ? `Icon: ${subtitle}` : undefined,
                      };
                    },
                  },
                }),
              ],
            }),
          ],
          options: { collapsible: true, collapsed: true },
        }),

        defineField({
          name: "overseasSupport",
          title: "Overseas Expansion Support",
          type: "object",
          fields: [
            localeString("pillarTitle", "Pillar Title"),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    localeString("label", "Label"),
                    localeText("desc", "Description", 3),
                    defineField({
                      name: "icon",
                      title: "Icon",
                      type: "string",
                      description: "Lucide icon name or custom hint",
                    }),
                  ],
                  preview: {
                    select: { title: "label.en", subtitle: "icon" },
                    prepare({ title, subtitle }) {
                      return {
                        title: title || "Untitled item",
                        subtitle: subtitle ? `Icon: ${subtitle}` : undefined,
                      };
                    },
                  },
                }),
              ],
            }),
          ],
          options: { collapsible: true, collapsed: true },
        }),
      ],
      options: { collapsible: true, collapsed: false },
    }),

    /* ---------- Service Flow ---------- */
    defineField({
      name: "serviceFlow",
      title: "Service Flow",
      type: "object",
      fields: [
        localeString("sectionTitle", "Section Title"),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "stepNo", title: "Step No.", type: "number" }),
                localeString("title", "Title"),
                localeText("desc", "Description", 3),
                defineField({ name: "icon", title: "Icon (optional)", type: "string" }),
              ],
            }),
          ],
        }),
      ],
      options: { collapsible: true, collapsed: true },
    }),

    /* ---------- Fees / Split into two groups ---------- */
    defineField({
      name: "feesFinancial",
      title: "Fees — Financial & Accounting Advisory",
      type: "object",
      fields: [
        localeString("sectionTitle", "Section Title"),
        localeText("disclaimer", "Project-based Disclaimer", 3),
        localeText("body", "Body Text", 4),
        defineField({
          name: "packages",
          title: "Packages",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [localeString("name", "Package Name"), defineField({ name: "priceNote", title: "Price Note", type: "string", description: "e.g., From JPY 100,000" }), localeStringArray("features", "Features")],
            }),
          ],
        }),
        defineField({ name: "showContactCta", title: "Show Contact CTA Button", type: "boolean", initialValue: true }),
      ],
      options: { collapsible: true, collapsed: true },
    }),

    defineField({
      name: "feesOverseas",
      title: "Fees — Overseas Expansion Support",
      type: "object",
      fields: [
        localeString("sectionTitle", "Section Title"),
        localeText("disclaimer", "Project-based Disclaimer", 3),
        localeText("body", "Body Text", 4),
        defineField({
          name: "packages",
          title: "Packages",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [localeString("name", "Package Name"), defineField({ name: "priceNote", title: "Price Note", type: "string", description: "e.g., Case-by-case quotation" }), localeStringArray("features", "Features")],
            }),
          ],
        }),
        defineField({ name: "showContactCta", title: "Show Contact CTA Button", type: "boolean", initialValue: true }),
      ],
      options: { collapsible: true, collapsed: true },
    }),

    /* ---------- CTA ---------- */
    defineField({
      name: "cta",
      title: "CTA",
      type: "object",
      fields: [localeString("title", "Title"), localeText("subtitle", "Subtitle", 3), localeString("buttonText", "Button Text"), defineField({ name: "buttonHref", title: "Button Href", type: "url" })],
      options: { collapsible: true, collapsed: true },
    }),

    /* ---------- SEO ---------- */
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        localeString("metaTitle", "Meta Title"),
        localeText("metaDescription", "Meta Description", 3),
        defineField({
          name: "ogImage",
          title: "Open Graph Image",
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "alt", title: "Alt", type: "string" }],
        }),
      ],
      options: { collapsible: true, collapsed: true },
    }),

    /* ---------- Toggles ---------- */
    defineField({ name: "enabled", title: "Enable Page", type: "boolean", initialValue: true }),
  ],
  preview: {
    select: { title: "hero.title.en", subtitle: "slug.current", media: "hero.bgImage" },
    prepare: (sel) => ({
      title: sel.title || "Global Advisory Hub",
      subtitle: `/${sel.subtitle || "global-advisory-hub"}`,
      media: sel.media,
    }),
  },
});
