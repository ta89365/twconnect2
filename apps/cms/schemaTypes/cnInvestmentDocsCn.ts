// File: apps/cms/schemaTypes/cnInvestmentDocsCn.ts
import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

export default defineType({
  name: "cnInvestmentDocsCn",
  title: "CN Investment | Document Prep & Rejection Reasons (ZH-CN)",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "meta", title: "Meta" },
    { name: "hero", title: "Hero" },
    { name: "content", title: "Content" },
    { name: "contact", title: "Contact" },
  ],
  fields: [
    /* ========================== Meta / Basic ========================== */
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      description: "URL slug. Use ASCII only and keep it stable.",
      group: "meta",
      options: { source: "heroTitleZhCn", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "meta",
      title: "Meta",
      type: "object",
      group: "meta",
      fields: [
        defineField({
          name: "isDraft",
          title: "Is Draft",
          type: "boolean",
          description:
            "If true, this document will be treated as draft and may be filtered out in production.",
          initialValue: false,
        }),
        defineField({
          name: "lastReviewedAt",
          title: "Last Reviewed At",
          type: "datetime",
          description: "Internal tracking for last content review timestamp.",
        }),
      ],
    }),

    /* ========================== Hero ========================== */
    defineField({
      name: "heroTitleZhCn",
      title: "Hero Title (ZH-CN)",
      type: "string",
      description:
        "Main page title in Simplified Chinese. Keep it concise and SEO friendly.",
      group: "hero",
      validation: (Rule) => Rule.required().min(4).max(60),
    }),
    defineField({
      name: "heroSubtitleZhCn",
      title: "Hero Subtitle (ZH-CN)",
      type: "text",
      rows: 3,
      description:
        "Subtitle in Simplified Chinese. One to two short sentences that summarize the value proposition.",
      group: "hero",
    }),

    /* ========================== Section 1: Introduction ========================== */
    defineField({
      name: "introZhCn",
      title: "Introduction (ZH-CN)",
      type: "array",
      group: "content",
      description:
        "Intro paragraphs in Simplified Chinese. Use short paragraphs to describe purpose and context.",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required().min(1),
    }),

    /* ========================== Section 2: Required Documents ========================== */
    defineField({
      name: "requiredFiles",
      title: "Required Documents",
      type: "array",
      group: "content",
      description:
        "Each item describes one mandatory document type. Content must be written in Simplified Chinese.",
      of: [
        defineField({
          name: "docItem",
          title: "Document Item",
          type: "object",
          fields: [
            defineField({
              name: "order",
              title: "Order",
              type: "number",
              description:
                "Display order starting from 1. Lower numbers appear first.",
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "key",
              title: "Key",
              type: "string",
              description:
                "Stable key for code references, e.g., 'applicationForm', 'articlesOfAssociation', 'idProof', 'poa', 'bizScopePreCheck', 'structureAndFunds', 'otherSupporting'.",
              validation: (Rule) =>
                Rule.required().regex(/^[a-zA-Z0-9_-]+$/),
            }),
            defineField({
              name: "titleZhCn",
              title: "Document Title (ZH-CN)",
              type: "string",
              description: "Document title in Simplified Chinese.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "summaryZhCn",
              title: "Summary (ZH-CN)",
              type: "text",
              rows: 3,
              description:
                "One or two sentences to summarize what this document is and why it is needed.",
            }),
            defineField({
              name: "detailsZhCn",
              title: "Required Contents / Key Points (ZH-CN)",
              type: "array",
              description:
                "Detailed requirements or bullet points in Simplified Chinese. Use Portable Text for structure.",
              of: [{ type: "block" }],
            }),
            defineField({
              name: "notesZhCn",
              title: "Notes (ZH-CN)",
              type: "array",
              description:
                "Optional notes, examples, or operational tips in Simplified Chinese.",
              of: [{ type: "block" }],
            }),
          ],
          preview: {
            select: { title: "titleZhCn", subtitle: "key", order: "order" },
            prepare: ({ title, subtitle, order }) => ({
              title: `${order ?? 0}. ${title ?? "(Untitled)"}`,
              subtitle,
            }),
          },
        }),
      ],
      options: { sortable: true },
      validation: (Rule) => Rule.required().min(3),
    }),

    /* ========================== Section 3: Common Rejections ========================== */
    defineField({
      name: "commonRejections",
      title: "Common Rejections & Remediation (ZH-CN)",
      type: "array",
      group: "content",
      description:
        "Top rejection reasons and how to address them. Write in Simplified Chinese.",
      of: [
        defineField({
          name: "reasonItem",
          title: "Reason Item",
          type: "object",
          fields: [
            defineField({
              name: "order",
              title: "Order",
              type: "number",
              description: "Display order for UI.",
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "titleZhCn",
              title: "Reason Title (ZH-CN)",
              type: "string",
              description:
                "Concise headline of the rejection reason in Simplified Chinese.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "problemZhCn",
              title: "Problem Description (ZH-CN)",
              type: "array",
              description:
                "Describe what typically goes wrong. Use short bullet paragraphs.",
              of: [{ type: "block" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "recommendationZhCn",
              title: "Recommendation (ZH-CN)",
              type: "array",
              description:
                "Actionable guidance to prevent or fix the issue, in Simplified Chinese.",
              of: [{ type: "block" }],
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "legalNotesZhCn",
              title: "Legal or Practice Notes (ZH-CN, Optional)",
              type: "array",
              description:
                "Optional legal references or practice notes. Keep concise.",
              of: [{ type: "block" }],
            }),
          ],
          preview: {
            select: { title: "titleZhCn", order: "order" },
            prepare: ({ title, order }) => ({
              title: `${order ?? 0}. ${title ?? "(Untitled)"}`,
            }),
          },
        }),
      ],
      options: { sortable: true },
      validation: (Rule) => Rule.required().min(3),
    }),

    /* ========================== Section 4: Practical Tips ========================== */
    defineField({
      name: "practicalTips",
      title: "Practical Tips (ZH-CN)",
      type: "array",
      group: "content",
      description:
        "Best practices before submission. Split each tip as a separate item.",
      of: [
        defineField({
          name: "tipItem",
          title: "Tip",
          type: "object",
          fields: [
            defineField({
              name: "order",
              title: "Order",
              type: "number",
              description: "Display order for UI.",
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "titleZhCn",
              title: "Tip Title (ZH-CN)",
              type: "string",
              description: "Short headline for the advice item.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "bodyZhCn",
              title: "Tip Body (ZH-CN)",
              type: "array",
              description:
                "Detail the suggestion and explain the rationale in Simplified Chinese.",
              of: [{ type: "block" }],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "titleZhCn", order: "order" },
            prepare: ({ title, order }) => ({
              title: `${order ?? 0}. ${title ?? "(Untitled)"}`,
            }),
          },
        }),
      ],
      options: { sortable: true },
      validation: (Rule) => Rule.required().min(2),
    }),

    /* ========================== Section 5: Conclusion ========================== */
    defineField({
      name: "conclusionZhCn",
      title: "Conclusion (ZH-CN)",
      type: "array",
      group: "content",
      description:
        "Closing paragraphs in Simplified Chinese. Summarize key points and call to action.",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required().min(1),
    }),

    /* ========================== Contact ========================== */
    defineField({
      name: "contact",
      title: "Contact Information",
      type: "object",
      group: "contact",
      fields: [
        defineField({
          name: "email",
          title: "Email",
          type: "string",
          description: "Public contact email. Example: info@twconnects.com",
          validation: (Rule) => Rule.required().email(),
        }),
        defineField({
          name: "lineId",
          title: "LINE ID",
          type: "string",
          description:
            "Public LINE contact, e.g., '@030qreji'. Include the leading @ if applicable.",
        }),
      ],
      options: { collapsible: true, collapsed: false },
    }),
  ],

  preview: {
    select: {
      title: "heroTitleZhCn",
      subtitle: "slug.current",
      isDraft: "meta.isDraft",
    },
    prepare: ({ title, subtitle, isDraft }) => ({
      title: title || "CN Investment | Document Prep & Rejection Reasons",
      subtitle: `${subtitle ? `/${subtitle}` : ""}${isDraft ? "  • DRAFT" : ""}`,
    }),
  },
});
