// schemas/companyStrengthsAndFAQ.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "companyStrengthsAndFAQ",
  title: "Our Strengths & FAQs",
  type: "document",

  fields: [
    /* ========== Hero Image ========== */
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description:
        "Background image at the top of the page. Use a wide image and enable Hotspot to control the focal point.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Alternative text for accessibility and SEO.",
        }),
      ],
    }),

    /* ========== Strengths ========== */
    defineField({
      name: "strengths",
      title: "Strength Items",
      type: "array",
      of: [
        defineField({
          name: "strengthItem",
          title: "Strength Item",
          type: "object",
          fields: [
            defineField({
              name: "order",
              title: "Display Order",
              type: "number",
              description: "Controls the display order of this item.",
            }),
            defineField({
              name: "icon",
              title: "Icon or Emoji",
              type: "string",
              description: "Optional. Use an emoji or a Lucide icon name.",
            }),

            /* ===== Multilingual Title ===== */
            defineField({
              name: "titleJp",
              title: "Title (Japanese)",
              type: "string",
            }),
            defineField({
              name: "titleZh",
              title: "Title (Chinese)",
              type: "string",
            }),
            defineField({
              name: "titleEn",
              title: "Title (English)",
              type: "string",
            }),

            /* ===== Multilingual Body ===== */
            defineField({
              name: "bodyJp",
              title: "Body (Japanese)",
              type: "text",
              rows: 5,
            }),
            defineField({
              name: "bodyZh",
              title: "Body (Chinese)",
              type: "text",
              rows: 5,
            }),
            defineField({
              name: "bodyEn",
              title: "Body (English)",
              type: "text",
              rows: 5,
            }),
          ],
          preview: {
            select: { title: "titleEn", subtitle: "order" },
            prepare({ title, subtitle }) {
              return { title: title || "(Untitled Strength)", subtitle: `#${subtitle ?? ""}` };
            },
          },
        }),
      ],
    }),

    /* ========== FAQ Section ========== */
    defineField({
      name: "faqTitle",
      title: "FAQ Section Title",
      type: "object",
      description: "Localized title displayed above the FAQ list.",
      fields: [
        defineField({ name: "jp", title: "Japanese", type: "string" }),
        defineField({ name: "zh", title: "Chinese", type: "string" }),
        defineField({ name: "en", title: "English", type: "string" }),
      ],
    }),

    defineField({
      name: "faqIntro",
      title: "FAQ Intro Paragraph",
      type: "object",
      description: "Short introductory text shown before the FAQ items.",
      fields: [
        defineField({ name: "jp", title: "Japanese", type: "text", rows: 3 }),
        defineField({ name: "zh", title: "Chinese", type: "text", rows: 3 }),
        defineField({ name: "en", title: "English", type: "text", rows: 3 }),
      ],
    }),

    defineField({
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      of: [
        defineField({
          name: "faqItem",
          title: "FAQ Item",
          type: "object",
          fields: [
            defineField({
              name: "order",
              title: "Display Order",
              type: "number",
              description: "Controls the display order of this FAQ.",
            }),

            /* ===== Multilingual Question ===== */
            defineField({
              name: "questionJp",
              title: "Question (Japanese)",
              type: "string",
            }),
            defineField({
              name: "questionZh",
              title: "Question (Chinese)",
              type: "string",
            }),
            defineField({
              name: "questionEn",
              title: "Question (English)",
              type: "string",
            }),

            /* ===== Multilingual Answer ===== */
            defineField({
              name: "answerJp",
              title: "Answer (Japanese)",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "answerZh",
              title: "Answer (Chinese)",
              type: "text",
              rows: 4,
            }),
            defineField({
              name: "answerEn",
              title: "Answer (English)",
              type: "text",
              rows: 4,
            }),
          ],
          preview: {
            select: { title: "questionEn", subtitle: "order" },
            prepare({ title, subtitle }) {
              return { title: title || "(Untitled FAQ)", subtitle: `#${subtitle ?? ""}` };
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    prepare() {
      return { title: "Our Strengths & FAQ" };
    },
  },
});
