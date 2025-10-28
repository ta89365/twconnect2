// apps/cms/schemaTypes/about.ts
import { defineType, defineField } from "sanity";
import { DocumentIcon, ImageIcon } from "@sanity/icons";

export default defineType({
  name: "aboutSection",
  title: "About Us / Company Introduction",
  type: "document",
  icon: DocumentIcon,
  fields: [
    // Titles (multi-language)
    defineField({ name: "titleZh", title: "Title (ZH)", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "titleJp", title: "Title (JP)", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "titleEn", title: "Title (EN)", type: "string", validation: (Rule) => Rule.required() }),

    // Logo
    defineField({
      name: "logo",
      title: "Logo Image",
      type: "image",
      options: { hotspot: false },
      validation: (Rule) => Rule.required(),
    }),

    // Main slogan (multi-language)
    defineField({ name: "sloganMainZh", title: "Main Slogan (ZH)", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "sloganMainJp", title: "Main Slogan (JP)", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "sloganMainEn", title: "Main Slogan (EN)", type: "string", validation: (Rule) => Rule.required() }),

    // Sub slogan (multi-language)
    defineField({ name: "sloganSubZh", title: "Sub Slogan (ZH)", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "sloganSubJp", title: "Sub Slogan (JP)", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "sloganSubEn", title: "Sub Slogan (EN)", type: "string", validation: (Rule) => Rule.required() }),

    // Introduction paragraphs (multi-language)
    defineField({
      name: "introZh",
      title: "Introduction (ZH, multiple paragraphs)",
      type: "array",
      of: [{ type: "text" }],
      description: "Input multiple short paragraphs. The frontend may display them with line breaks.",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "introJp",
      title: "Introduction (JP, multiple paragraphs)",
      type: "array",
      of: [{ type: "text" }],
      description: "Input multiple short paragraphs. The frontend may display them with line breaks.",
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "introEn",
      title: "Introduction (EN, multiple paragraphs)",
      type: "array",
      of: [{ type: "text" }],
      description: "Input multiple short paragraphs. The frontend may display them with line breaks.",
      validation: (Rule) => Rule.min(1),
    }),

    // CTA text and link
    defineField({ name: "ctaTextZh", title: "CTA Text (ZH)", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "ctaTextJp", title: "CTA Text (JP)", type: "string", validation: (Rule) => Rule.required() }),
    defineField({ name: "ctaTextEn", title: "CTA Text (EN)", type: "string", validation: (Rule) => Rule.required() }),
    defineField({
      name: "ctaHref",
      title: "CTA Link",
      type: "url",
      validation: (Rule) => Rule.uri({ allowRelative: true }).required(),
      description: "Accepts a relative path or a full URL. Example: /about or /ja/about",
    }),
  ],

  preview: {
    select: {
      titleEn: "titleEn",
      sloganEn: "sloganMainEn",
      media: "logo",
    },
    prepare({ titleEn, sloganEn, media }) {
      return {
        title: titleEn || "About Taiwan Connect",
        subtitle: sloganEn || "Title, Slogan, Intro, CTA",
        media: media || ImageIcon,
      };
    },
  },
});
