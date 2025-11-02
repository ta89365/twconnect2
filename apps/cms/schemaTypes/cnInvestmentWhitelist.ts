// File: apps/cms/schemaTypes/cnInvestmentWhitelist.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "cnInvestmentWhitelist",
  title: "CN Investment Whitelist Article (ZH-CN)",
  type: "document",
  groups: [
    { name: "hero", title: "Hero" },
    { name: "content", title: "Content" },
    { name: "categories", title: "Categories" },
    { name: "review", title: "Review Focus" },
    { name: "pitfalls", title: "Common Pitfalls" },
    { name: "meta", title: "Meta & Contact" },
  ],
  fields: [
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      description:
        "URL slug for this article. Keep it short, lowercase, hyphen-separated.",
      group: "hero",
      options: { source: "heroTitleZhCn", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroTitleZhCn",
      type: "string",
      title: "Hero Title (ZH-CN)",
      description:
        "Main headline in Simplified Chinese. Example: 陆资来台投资的「正面表列」行业有哪些？",
      group: "hero",
      validation: (Rule) => Rule.required().min(6).max(80),
    }),
    defineField({
      name: "heroSubtitleZhCn",
      type: "string",
      title: "Hero Subtitle (ZH-CN)",
      description:
        "Short subheadline in Simplified Chinese. Example: 掌握最新政策方向，确保投资合规顺利落地",
      group: "hero",
      validation: (Rule) => Rule.max(140),
    }),
    defineField({
      name: "heroImage",
      type: "image",
      title: "Hero Image",
      description:
        "Hero background image. Upload a wide image, enable hotspot for smart cropping.",
      group: "hero",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text (ZH-CN)",
          description:
            "Short description in Simplified Chinese for accessibility and SEO.",
          validation: (Rule) => Rule.max(120),
        },
      ],
    }),

    // Intro and policy background
    defineField({
      name: "introZhCn",
      type: "blockContentZhCn",
      title: "Intro (ZH-CN)",
      description:
        "Article introduction in Simplified Chinese. Summarize why whitelist matters and overall approach.",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "policyBackgroundZhCn",
      type: "blockContentZhCn",
      title: "Policy Background (ZH-CN)",
      description:
        "制度背景段落。Reference legal basis and management approach in Simplified Chinese.",
      group: "content",
    }),

    // Categories: Manufacturing, Services, Public Infrastructure
    defineField({
      name: "categories",
      type: "array",
      title: "Open Categories",
      description:
        "Three top-level categories. Each item contains intro, allowed examples, and restrictions.",
      group: "categories",
      of: [
        {
          type: "object",
          name: "category",
          fields: [
{
  name: "key",
  type: "string",
  title: "Key",
  description:
    "Fixed identifier. Choose one of: manufacturing, services, public_infrastructure.",
  options: {
    list: [
      { title: "Manufacturing", value: "manufacturing" },
      { title: "Services", value: "services" },
      { title: "Public infrastructure", value: "public_infrastructure" },
    ],
    layout: "radio", // 想用下拉可改成 "dropdown"
  },
  initialValue: "manufacturing",
  validation: (Rule) => Rule.required(),
}, // ← 這個逗號是關鍵

{
  name: "introZhCn",
  type: "blockContentZhCn",
  title: "Category Intro (ZH-CN)",
  description:
    "Short intro explaining the scope and opening principles in Simplified Chinese.",
},

            {
              name: "allowedExamplesZhCn",
              type: "array",
              title: "Allowed Examples (ZH-CN)",
              description:
                "Bullet list of representative allowed items in Simplified Chinese.",
              of: [{ type: "string" }],
            },
            {
              name: "restrictionsZhCn",
              type: "blockContentZhCn",
              title: "Restrictions / Notes (ZH-CN)",
              description:
                "Restrictions, national security considerations, or approval caveats in Simplified Chinese.",
            },
          ],
          preview: {
            select: { title: "titleZhCn", subtitle: "key" },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),

    // Review focus items
    defineField({
      name: "reviewFocus",
      type: "array",
      title: "Review Focus",
      description:
        "Key approval focus areas in order. Each item should be concise and practical.",
      group: "review",
      of: [
        {
          type: "object",
          name: "focus",
          fields: [
            {
              name: "order",
              type: "number",
              title: "Order",
              description: "Display order. Use 1, 2, 3…",
              validation: (Rule) => Rule.required().integer().min(1),
            },
            {
              name: "titleZhCn",
              type: "string",
              title: "Title (ZH-CN)",
              description:
                "Short title in Simplified Chinese. Example: 股权结构与最终受益人认定",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "bodyZhCn",
              type: "blockContentZhCn",
              title: "Body (ZH-CN)",
              description:
                "Detailed explanation in Simplified Chinese. Keep it actionable and clear.",
            },
          ],
          preview: {
            select: { title: "titleZhCn", subtitle: "order" },
            prepare({ title, subtitle }) {
              return { title, subtitle: `#${subtitle}` };
            },
          },
        },
      ],
      validation: (Rule) => Rule.min(1),
    }),

    // Common pitfalls with advice
    defineField({
      name: "pitfalls",
      type: "array",
      title: "Common Pitfalls",
      description:
        "Frequent mistakes and suggestions. Each item is a pitfall with practical advice.",
      group: "pitfalls",
      of: [
        {
          type: "object",
          name: "pitfall",
          fields: [
            {
              name: "titleZhCn",
              type: "string",
              title: "Pitfall Title (ZH-CN)",
              description:
                "Short pitfall name in Simplified Chinese. Example: 以为第三地公司即可规避陆资身份",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "adviceZhCn",
              type: "blockContentZhCn",
              title: "Advice (ZH-CN)",
              description: "What to do instead. Provide clear, specific steps in Simplified Chinese.",
            },
          ],
          preview: { select: { title: "titleZhCn" } },
        },
      ],
    }),

    // Summary and CTA
    defineField({
      name: "summaryZhCn",
      type: "blockContentZhCn",
      title: "Summary & Recommendations (ZH-CN)",
      description:
        "Closing section in Simplified Chinese with key takeaways and next-step recommendations.",
      group: "content",
    }),

    // Contact
    defineField({
      name: "contact",
      type: "object",
      title: "Contact",
      description:
        "Contact info for Taiwan Connect in Simplified Chinese context.",
      group: "meta",
      fields: [
        {
          name: "email",
          type: "string",
          title: "Contact Email",
          description: "Primary contact email. Example: info@twconnects.com",
          validation: (Rule) =>
            Rule.regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
              name: "email",
              invert: false,
            }).warning("Please enter a valid email address."),
        },
        {
          name: "lineId",
          type: "string",
          title: "LINE ID",
          description: "LINE ID in text form. Example: @030qreji",
        },
        {
          name: "lineUrl",
          type: "url",
          title: "LINE URL",
          description:
            "Optional LINE link. Example: https://line.me/R/ti/p/@030qreji",
        },
        {
          name: "noteZhCn",
          type: "blockContentZhCn",
          title: "Contact Note (ZH-CN)",
          description:
            "Optional note or disclaimer in Simplified Chinese. Keep it short.",
        },
      ],
    }),

    // Meta
    defineField({
      name: "meta",
      type: "object",
      title: "Meta",
      group: "meta",
      fields: [
        {
          name: "updatedAt",
          type: "datetime",
          title: "Updated At",
          description:
            "Last content update datetime. Use when you want to display freshness to readers.",
        },
        {
          name: "sourceUrl",
          type: "url",
          title: "Source URL",
          description:
            "Optional reference or official source for the policy background.",
        },
        {
          name: "isDraft",
          type: "boolean",
          title: "Is Draft",
          description: "Toggle to hide this article from production.",
          initialValue: false,
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "heroTitleZhCn",
      subtitle: "slug.current",
      media: "heroImage",
    },
  },
});
