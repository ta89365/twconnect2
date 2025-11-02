// File: apps/cms/schemaTypes/mainlandInvestmentGuide.ts
import { defineType, defineField, defineArrayMember } from "sanity";

export default defineType({
  name: "mainlandInvestmentGuide",
  title: "Mainland China Investment Article",
  type: "document",
  fields: [
    // ===== Meta =====
    defineField({
      name: "title",
      title: "Main Title",
      type: "string",
      description: "Main article title in Simplified Chinese.",
      validation: (Rule) => Rule.required().min(5).max(120),
    }),

    // ===== Subtitle & Hero =====
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 3,
      description: "Short subtitle in Simplified Chinese.",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alternative Text", type: "string" }),
        defineField({ name: "attribution", title: "Image Attribution / Source", type: "string" }),
      ],
      description: "Main hero image for the article.",
    }),

    // ===== Introduction =====
    defineField({
      name: "intro",
      title: "Intro Paragraph",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      description: "Intro paragraph in Simplified Chinese.",
    }),

    // ===== Sections =====
    defineField({
      name: "sections",
      title: "Article Sections",
      type: "array",
      description: "Each section is a numbered topic or practical tip.",
      of: [
        defineArrayMember({
          type: "object",
          name: "section",
          title: "Section Block",
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              description: "Section title in Simplified Chinese.",
            }),
            defineField({
              name: "content",
              title: "Content",
              type: "array",
              of: [defineArrayMember({ type: "block" })],
              description: "Main content paragraphs and lists in Simplified Chinese.",
            }),
            defineField({
              name: "tips",
              title: "Practical Tips",
              type: "array",
              of: [defineArrayMember({ type: "block" })],
              description: "Highlighted practical tips or reminders.",
            }),
          ],
        }),
      ],
    }),

    // ===== Conclusion / Contact =====
    defineField({
      name: "conclusion",
      title: "Conclusion / Call to Action",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      description: "Final summary or contact invitation.",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      initialValue: "info@twconnects.com",
    }),
    defineField({
      name: "contactLine",
      title: "LINE ID or QR Code",
      type: "string",
      description: "LINE ID or QR link, e.g., @030qreji.",
    }),

    // ===== Metadata =====
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      description: "Used to generate the page URL in Next.js routes.",
    }),
    defineField({
      name: "publishDate",
      title: "Publish Date",
      type: "datetime",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "publishDate", media: "heroImage" },
    prepare({ title, subtitle, media }) {
      return {
        title: title || "Untitled Mainland Investment Article",
        subtitle: subtitle
          ? `Published on ${new Date(subtitle).toLocaleDateString()}`
          : "Draft",
        media,
      };
    },
  },
});
