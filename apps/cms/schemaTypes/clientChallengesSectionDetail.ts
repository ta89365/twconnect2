// apps/cms/schemaTypes/clientChallengesSectionDetail.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "clientChallengesSectionDetail",
  title: "Client Challenges SectionDetail",
  type: "document",

  fields: [
    /* ========== Hero Texts ========== */
    defineField({ name: "heroTitleJp", title: "Hero Title (Japanese)", type: "string" }),
    defineField({ name: "heroTitleZh", title: "Hero Title (Chinese)", type: "string" }),
    defineField({ name: "heroTitleEn", title: "Hero Title (English)", type: "string" }),

    defineField({ name: "heroSubtitleJp", title: "Hero Subtitle (Japanese)", type: "string" }),
    defineField({ name: "heroSubtitleZh", title: "Hero Subtitle (Chinese)", type: "string" }),
    defineField({ name: "heroSubtitleEn", title: "Hero Subtitle (English)", type: "string" }),

    /* ========== Hero Image ========== */
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description: "Background image at the top of the page. Use a wide image and enable Hotspot.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "altJp", title: "Alt Text (Japanese)", type: "string" }),
        defineField({ name: "altZh", title: "Alt Text (Chinese)", type: "string" }),
        defineField({ name: "altEn", title: "Alt Text (English)", type: "string" }),
        defineField({
          name: "remoteUrl",
          title: "Remote Image URL",
          type: "url",
          description: "Optional. Use an external image URL when not uploading an asset.",
        }),
      ],
    }),

    /* ========== Introduction (Portable Text) ========== */
    defineField({
      name: "introJp",
      title: "Introduction (Japanese)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "introZh",
      title: "Introduction (Chinese)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "introEn",
      title: "Introduction (English)",
      type: "array",
      of: [{ type: "block" }],
    }),

    /* ========== Optional Media Gallery (array of images) ========== */
    defineField({
      name: "mediaGallery",
      title: "Media Gallery",
      type: "array",
      of: [
        defineField({
          name: "galleryItem",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "altJp", title: "Alt Text (Japanese)", type: "string" }),
            defineField({ name: "altZh", title: "Alt Text (Chinese)", type: "string" }),
            defineField({ name: "altEn", title: "Alt Text (English)", type: "string" }),
            defineField({
              name: "remoteUrl",
              title: "Remote Image URL",
              type: "url",
              description: "Optional external image URL.",
            }),
          ],
        }),
      ],
      description: "Optional strip of images shown near the intro card.",
    }),

    /* ========== Challenges ========== */
    defineField({
      name: "challenges",
      title: "Challenges",
      type: "array",
      description: "The five main challenges with multilingual title, content, and key advice.",
      of: [
        defineField({
          name: "challenge",
          title: "Challenge",
          type: "object",
          fields: [
            defineField({
              name: "order",
              title: "Display Order",
              type: "number",
              validation: (r) => r.min(1).max(20),
              description: "Controls the display order on the page.",
            }),

            // Titles
            defineField({ name: "titleJp", title: "Title (Japanese)", type: "string" }),
            defineField({ name: "titleZh", title: "Title (Chinese)", type: "string" }),
            defineField({ name: "titleEn", title: "Title (English)", type: "string" }),

            // Contents (Portable Text)
            defineField({
              name: "contentJp",
              title: "Description (Japanese)",
              type: "array",
              of: [{ type: "block" }],
            }),
            defineField({
              name: "contentZh",
              title: "Description (Chinese)",
              type: "array",
              of: [{ type: "block" }],
            }),
            defineField({
              name: "contentEn",
              title: "Description (English)",
              type: "array",
              of: [{ type: "block" }],
            }),

            // Tips（維持 text，避免舊資料型別衝突）
            defineField({ name: "tipJp", title: "Tip / Advice (Japanese)", type: "text", rows: 3 }),
            defineField({ name: "tipZh", title: "Tip / Advice (Chinese)", type: "text", rows: 3 }),
            defineField({ name: "tipEn", title: "Tip / Advice (English)", type: "text", rows: 3 }),

            // Optional image per challenge
            defineField({
              name: "image",
              title: "Challenge Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({ name: "altJp", title: "Alt Text (Japanese)", type: "string" }),
                defineField({ name: "altZh", title: "Alt Text (Chinese)", type: "string" }),
                defineField({ name: "altEn", title: "Alt Text (English)", type: "string" }),
                defineField({
                  name: "remoteUrl",
                  title: "Remote Image URL",
                  type: "url",
                  description: "Optional external image URL.",
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "titleEn", subtitle: "order", media: "image" },
            prepare({ title, subtitle, media }) {
              return { title: title || "(Untitled Challenge)", subtitle: `#${subtitle ?? ""}`, media };
            },
          },
        }),
      ],
    }),

    /* ========== Conclusion (Portable Text) ========== */
    defineField({
      name: "conclusionJp",
      title: "Conclusion (Japanese)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "conclusionZh",
      title: "Conclusion (Chinese)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "conclusionEn",
      title: "Conclusion (English)",
      type: "array",
      of: [{ type: "block" }],
    }),

    /* ========== Company Intro (Portable Text) ========== */
    defineField({
      name: "companyIntroJp",
      title: "Taiwan Connect Introduction (Japanese)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "companyIntroZh",
      title: "Taiwan Connect Introduction (Chinese)",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "companyIntroEn",
      title: "Taiwan Connect Introduction (English)",
      type: "array",
      of: [{ type: "block" }],
    }),

    /* ========== Features ========== */
    defineField({
      name: "features",
      title: "Key Features",
      type: "array",
      of: [
        defineField({
          name: "feature",
          title: "Feature",
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon or Emoji",
              type: "string",
              description: "Optional. Use an emoji or a Lucide icon name.",
            }),
            defineField({ name: "titleJp", title: "Feature Title (Japanese)", type: "string" }),
            defineField({ name: "titleZh", title: "Feature Title (Chinese)", type: "string" }),
            defineField({ name: "titleEn", title: "Feature Title (English)", type: "string" }),

            // 保留 text，避免舊資料遷移
            defineField({
              name: "descriptionJp",
              title: "Feature Description (Japanese)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "descriptionZh",
              title: "Feature Description (Chinese)",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "descriptionEn",
              title: "Feature Description (English)",
              type: "text",
              rows: 3,
            }),

            // Optional image per feature
            defineField({
              name: "image",
              title: "Feature Image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({ name: "altJp", title: "Alt Text (Japanese)", type: "string" }),
                defineField({ name: "altZh", title: "Alt Text (Chinese)", type: "string" }),
                defineField({ name: "altEn", title: "Alt Text (English)", type: "string" }),
                defineField({
                  name: "remoteUrl",
                  title: "Remote Image URL",
                  type: "url",
                  description: "Optional external image URL.",
                }),
              ],
            }),
          ],
          preview: {
            select: { title: "titleEn", media: "image" },
            prepare({ title, media }) {
              return { title: title || "(Untitled Feature)", media };
            },
          },
        }),
      ],
    }),

    /* ========== Contact Section ========== */
    defineField({
      name: "contactSection",
      title: "Contact Section",
      type: "object",
      fields: [
        defineField({
          name: "linkedin",
          title: "LinkedIn URL",
          type: "url",
          description: "Link to Taiwan Connect LinkedIn page.",
        }),
        defineField({
          name: "line",
          title: "LINE ID",
          type: "string",
          description: "LINE contact ID or link, for example @030qreji.",
        }),
        defineField({ name: "noteJp", title: "Contact Note (Japanese)", type: "text", rows: 3 }),
        defineField({ name: "noteZh", title: "Contact Note (Chinese)", type: "text", rows: 3 }),
        defineField({ name: "noteEn", title: "Contact Note (English)", type: "text", rows: 3 }),
      ],
    }),
  ],

  preview: {
    select: { title: "heroTitleEn", subtitle: "heroSubtitleEn", media: "heroImage" },
    prepare({ title, subtitle, media }) {
      return { title: title || "Client Challenges SectionDetail", subtitle, media };
    },
  },
});
