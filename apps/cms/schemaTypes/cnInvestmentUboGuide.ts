// File: C:\Users\ta893\twconnect2\apps\cms\schemaTypes\cnInvestmentUboGuide.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "cnInvestmentUboGuide",
  title: "CN Investment UBO Guide (Simplified Chinese)",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "content", title: "Content" },
    { name: "examples", title: "Examples" },
    { name: "advice", title: "Practical Advice" },
    { name: "contact", title: "Contact" },
    { name: "meta", title: "Meta" },
  ],
  fields: [
    /* ===================== Hero & Basic ===================== */
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "hero",
      description:
        "URL slug. Use ASCII lowercase words with hyphens. Example: cn-investment-ubo-guide",
      options: { source: "heroTitleZhCn", maxLength: 80 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroTitleZhCn",
      title: "Hero Title (ZH-CN)",
      type: "string",
      group: "hero",
      description:
        "Main headline in Simplified Chinese. Example: 如何判断是否属于陆资？实质受益人（UBO）判定指南",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubtitleZhCn",
      title: "Hero Subtitle (ZH-CN)",
      type: "text",
      rows: 3,
      group: "hero",
      description:
        "Short subtitle in Simplified Chinese that clarifies the scope. Keep it concise.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "hero",
      description:
        "Hero background image. Enable hotspot for responsive crops. Provide alt text.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text (EN)",
          type: "string",
          description: "Describe the image for accessibility and SEO in English.",
          validation: (Rule) => Rule.required().warning("Alt text is recommended."),
        }),
      ],
    }),

    /* ===================== Section: Why It Matters ===================== */
    defineField({
      name: "importanceZhCn",
      title: "Why It Matters (ZH-CN)",
      type: "array",
      group: "content",
      description:
        "Portable Text for the section explaining why CN-investor identification is critical under Taiwan regulations.",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),

    /* ===================== Section: Legal Basis ===================== */
    defineField({
      name: "legalBasisZhCn",
      title: "Legal Basis (ZH-CN)",
      type: "array",
      group: "content",
      description:
        "Portable Text referencing the key articles such as the Regulations Governing Permission for People from Mainland China to Invest in Taiwan (e.g., Article 3).",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),

    /* ===================== Section: Two Core Standards ===================== */
    defineField({
      name: "ownershipThresholdZhCn",
      title: "Shareholding Threshold Explanation (ZH-CN)",
      type: "array",
      group: "content",
      description:
        "Explain the 30% direct or indirect shareholding criterion. Use bullet points if needed.",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "controlCriteriaZhCn",
      title: "Control Criteria (ZH-CN)",
      type: "array",
      group: "content",
      description:
        "List control abilities that trigger CN-investor status even if the shareholding is below threshold, aligned with IFRS/ROC GAAP control concepts.",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),

    /* ===================== Section: Layered Calculation ===================== */
    defineField({
      name: "layeredCalculationZhCn",
      title: "Layered Calculation Method (ZH-CN)",
      type: "array",
      group: "content",
      description:
        "Explain stepwise tracing from UBO through each holding layer. Include examples of percentage multiplication and recognition logic.",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),

    /* ===================== Section: UBO Focus ===================== */
    defineField({
      name: "uboFocusZhCn",
      title: "UBO Recognition Focus (ZH-CN)",
      type: "array",
      group: "content",
      description:
        "Portable Text describing UBO definition and typical situations that indicate CN-investor attributes.",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),

    /* ===================== Section: Examples ===================== */
    defineField({
      name: "examples",
      title: "Common Determination Examples",
      type: "array",
      group: "examples",
      description:
        "Structured examples to illustrate how CN-investor status is determined in practice.",
      of: [
        defineField({
          name: "example",
          title: "Example",
          type: "object",
          fields: [
            defineField({
              name: "titleZhCn",
              title: "Example Title (ZH-CN)",
              type: "string",
              description: "Short title. Example: 股东甲乙合计持股超过30%",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "scenarioZhCn",
              title: "Scenario (ZH-CN)",
              type: "array",
              of: [{ type: "block" }],
              description:
                "Describe the factual pattern in Simplified Chinese. Use lists for clarity.",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "conclusionZhCn",
              title: "Conclusion (ZH-CN)",
              type: "array",
              of: [{ type: "block" }],
              description:
                "Explain the regulatory conclusion, such as being recognized as CN-investor or not, and why.",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "titleZhCn" },
            prepare: ({ title }) => ({ title: title || "Example" }),
          },
        }),
      ],
    }),

    /* ===================== Section: Practical Advice ===================== */
    defineField({
      name: "practicalAdvice",
      title: "Practical Advice Items",
      type: "array",
      group: "advice",
      description:
        "Actionable items for applicants before filing, such as structure disclosure, pre-assessment, documentation, and nominee risk.",
      of: [
        defineField({
          name: "adviceItem",
          title: "Advice Item",
          type: "object",
          fields: [
            defineField({
              name: "labelZhCn",
              title: "Label (ZH-CN)",
              type: "string",
              description: "Short label in Simplified Chinese. Example: 完整揭露股权结构",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "bodyZhCn",
              title: "Body (ZH-CN)",
              type: "array",
              of: [{ type: "block" }],
              description:
                "Portable Text elaborating the advice in Simplified Chinese.",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "labelZhCn" },
            prepare: ({ title }) => ({ title: title || "Advice" }),
          },
        }),
      ],
    }),

    /* ===================== Section: Conclusion ===================== */
    defineField({
      name: "conclusionZhCn",
      title: "Conclusion (ZH-CN)",
      type: "array",
      group: "content",
      description:
        "Final takeaway for applicants and the value proposition of Taiwan Connect in Simplified Chinese.",
      of: [{ type: "block" }],
      validation: (Rule) => Rule.required(),
    }),

    /* ===================== Contact ===================== */
    defineField({
      name: "contact",
      title: "Contact",
      type: "object",
      group: "contact",
      fields: [
        defineField({
          name: "email",
          title: "Email",
          type: "string",
          description:
            "Public contact email. Example: info@twconnects.com",
          validation: (Rule) => Rule.email().warning(),
        }),
        defineField({
          name: "lineId",
          title: "LINE ID",
          type: "string",
          description: "Public LINE ID. Example: @030qreji",
        }),
        defineField({
          name: "contactNoteZhCn",
          title: "Contact Note (ZH-CN)",
          type: "array",
          of: [{ type: "block" }],
          description:
            "Any extra contact note in Simplified Chinese. Optional.",
        }),
      ],
      preview: {
        select: { subtitle: "email" },
        prepare: ({ subtitle }) => ({
          title: "Contact",
          subtitle: subtitle || "",
        }),
      },
    }),

    /* ===================== Meta ===================== */
    defineField({
      name: "lastUpdatedAt",
      title: "Last Updated At",
      type: "datetime",
      group: "meta",
      description:
        "Manual timestamp for editorial tracking. You may automate this with webhooks if needed.",
    }),
    defineField({
      name: "meta",
      title: "Meta",
      type: "object",
      group: "meta",
      fields: [
        defineField({
          name: "isDraft",
          title: "Is Draft?",
          type: "boolean",
          description:
            "If true, this document will be excluded from public queries.",
          initialValue: false,
        }),
        defineField({
          name: "seoDescription",
          title: "SEO Description (EN or ZH-CN)",
          type: "text",
          rows: 3,
          description:
            "Short meta description for search engines. Keep within ~160 characters.",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heroTitleZhCn",
      subtitle: "slug.current",
      media: "heroImage",
    },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "CN Investment UBO Guide",
      subtitle: subtitle ? `/${subtitle}` : "",
      media,
    }),
  },
});
