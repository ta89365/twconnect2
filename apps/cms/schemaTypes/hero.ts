// apps/cms/schemaTypes/hero.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "hero",
  title: "Homepage Hero Banner",
  type: "document",
  fields: [
    defineField({
      name: "bgImage",
      title: "Background Image (Main)",
      type: "image",
      options: { hotspot: true },
    }),

    // Multi-language main heading
    defineField({ name: "headingZh", title: "Main Heading (ZH)", type: "string" }),
    defineField({ name: "headingEn", title: "Main Heading (EN)", type: "string" }),
    defineField({ name: "headingJp", title: "Main Heading (JP)", type: "string" }),

    // Multi-language subheading
    defineField({ name: "subheadingZh", title: "Subheading (ZH)", type: "text" }),
    defineField({ name: "subheadingEn", title: "Subheading (EN)", type: "text" }),
    defineField({ name: "subheadingJp", title: "Subheading (JP)", type: "text" }),

    // Multi-language subtitle
    defineField({ name: "subtitleZh", title: "Subtitle (ZH)", type: "string" }),
    defineField({ name: "subtitleEn", title: "Subtitle (EN)", type: "string" }),
    defineField({ name: "subtitleJp", title: "Subtitle (JP)", type: "string" }),

    // Multi-language CTA
    defineField({ name: "ctaTextZh", title: "CTA Text (ZH)", type: "string" }),
    defineField({ name: "ctaTextEn", title: "CTA Text (EN)", type: "string" }),
    defineField({ name: "ctaTextJp", title: "CTA Text (JP)", type: "string" }),
    defineField({ name: "ctaHref", title: "CTA Link", type: "string" }),

    // Language switch
    defineField({
      name: "languages",
      title: "Language Switch Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "label", title: "Display Label", type: "string" }),
            defineField({ name: "href", title: "Link URL", type: "string" }),
          ],
          preview: { select: { title: "label", subtitle: "href" } },
        },
      ],
    }),

    // Legacy fields (hidden)
    defineField({ name: "heading", title: "Legacy Heading", type: "string", hidden: true }),
    defineField({ name: "subheading", title: "Legacy Subheading", type: "text", hidden: true }),
    defineField({ name: "ctaText", title: "Legacy CTA Text", type: "string", hidden: true }),
    defineField({ name: "ribbonMain", title: "Legacy Ribbon Main", type: "string", hidden: true }),
    defineField({ name: "ribbonSub", title: "Legacy Ribbon Sub", type: "string", hidden: true }),
  ],
  preview: {
    prepare() {
      return { title: "Hero" };
    },
  },
});
