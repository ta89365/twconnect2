// apps/cms/schemaTypes/crossBorderSection.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "crossBorderSection",
  title: "Cross-Border Advisory Section",
  type: "document",
  fields: [
    // Headings (multi-language)
    defineField({
      name: "headingZh",
      title: "Heading (ZH)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headingJp",
      title: "Heading (JP)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "headingEn",
      title: "Heading (EN)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    // Paragraphs (two only)
    defineField({ name: "para1Zh", title: "Paragraph 1 (ZH)", type: "text" }),
    defineField({ name: "para1Jp", title: "Paragraph 1 (JP)", type: "text" }),
    defineField({ name: "para1En", title: "Paragraph 1 (EN)", type: "text" }),

    defineField({ name: "para2Zh", title: "Paragraph 2 (ZH)", type: "text" }),
    defineField({ name: "para2Jp", title: "Paragraph 2 (JP)", type: "text" }),
    defineField({ name: "para2En", title: "Paragraph 2 (EN)", type: "text" }),

    // CTA
    defineField({
      name: "ctaTextZh",
      title: "CTA Text (ZH)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaTextJp",
      title: "CTA Text (JP)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaTextEn",
      title: "CTA Text (EN)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctaHref",
      title: "CTA Link",
      type: "url",
      validation: (Rule) => Rule.uri({ allowRelative: true }).required(),
    }),

    // Background image
    defineField({
      name: "bgImage",
      title: "Background Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
  ],

  preview: {
    select: {
      media: "bgImage",
    },
    prepare({ media }) {
      return {
        title: "Cross-Border Service Section",
        media,
      };
    },
  },
});
