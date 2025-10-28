// schemas/twServiceDetail.ts
import { defineField, defineType } from "sanity";

export default defineType({
  name: "twServiceDetail",
  title: "Taiwan Market Entry Detail",
  type: "document",

  fields: [
    /* ========== Basic Info ========== */
    defineField({
      name: "title",
      title: "Service Title",
      type: "string",
      description: "Enter the English title shown on the page and used to generate the slug.",
      validation: (Rule) => Rule.required().min(2),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL friendly identifier generated from the English Service Title.",
      options: { source: "title", maxLength: 100 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "coverImage",
      title: "Hero Image",
      type: "image",
      description: "Top hero image. Use a wide image and enable Hotspot to control the focal point.",
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

    /* ========== Background ========== */
    defineField({
      name: "background",
      title: "Background",
      type: "object",
      description: "Short background description for this service in three languages.",
      fields: [
        { name: "zh", type: "text", title: "Chinese", rows: 4 },
        { name: "jp", type: "text", title: "Japanese", rows: 4 },
        { name: "en", type: "text", title: "English", rows: 4 },
      ],
    }),

    /* ========== Challenges ========== */
    defineField({
      name: "challenges",
      title: "Challenges",
      type: "object",
      description: "Key challenges that clients typically face.",
      fields: [
        { name: "zh", type: "array", of: [{ type: "string" }], title: "Chinese" },
        { name: "jp", type: "array", of: [{ type: "string" }], title: "Japanese" },
        { name: "en", type: "array", of: [{ type: "string" }], title: "English" },
      ],
    }),

    /* ========== Service Items ========== */
    defineField({
      name: "services",
      title: "Service Items",
      type: "object",
      description: "What is included in this service and related keywords.",
      fields: [
        { name: "zh", type: "array", of: [{ type: "string" }], title: "Chinese" },
        { name: "jp", type: "array", of: [{ type: "string" }], title: "Japanese" },
        { name: "en", type: "array", of: [{ type: "string" }], title: "English" },
        defineField({
          name: "keywords",
          title: "Keywords",
          type: "object",
          description: "Search and tagging keywords per language.",
          fields: [
            { name: "zh", type: "array", of: [{ type: "string" }], title: "Chinese" },
            { name: "jp", type: "array", of: [{ type: "string" }], title: "Japanese" },
            { name: "en", type: "array", of: [{ type: "string" }], title: "English" },
          ],
        }),
      ],
    }),

    /* ========== Service Flow ========== */
    defineField({
      name: "serviceFlow",
      title: "Service Flow",
      type: "object",
      description: "Step by step flow or checklist that clients will follow.",
      fields: [
        { name: "zh", type: "array", of: [{ type: "string" }], title: "Chinese" },
        { name: "jp", type: "array", of: [{ type: "string" }], title: "Japanese" },
        { name: "en", type: "array", of: [{ type: "string" }], title: "English" },
      ],
    }),

    /* ========== Schedule Example ========== */
    defineField({
      name: "scheduleExample",
      title: "Schedule Example",
      type: "object",
      description: "Example timeline blocks with a title and bullet items for each language.",
      fields: [
        {
          name: "zh",
          title: "Chinese",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "title", type: "string", title: "Title" },
                { name: "items", type: "array", of: [{ type: "string" }], title: "Items" },
              ],
            },
          ],
        },
        {
          name: "jp",
          title: "Japanese",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "title", type: "string", title: "Title" },
                { name: "items", type: "array", of: [{ type: "string" }], title: "Items" },
              ],
            },
          ],
        },
        {
          name: "en",
          title: "English",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                { name: "title", type: "string", title: "Title" },
                { name: "items", type: "array", of: [{ type: "string" }], title: "Items" },
              ],
            },
          ],
        },
      ],
    }),

    /* ========== Fees ========== */
    defineField({
      name: "fees",
      title: "Fees Reference",
      type: "array",
      description: "Reference pricing grouped by category.",
      of: [
        defineField({
          name: "feeGroup",
          title: "Fee Group",
          type: "object",
          fields: [
            { name: "category", type: "string", title: "Category" },
            {
              name: "entries",
              title: "Fee Entries",
              type: "array",
              of: [
                defineField({
                  name: "feeEntry",
                  title: "Fee Entry",
                  type: "object",
                  fields: [
                    {
                      name: "serviceName",
                      title: "Service Name",
                      type: "object",
                      description: "Display name for the fee entry in three languages.",
                      fields: [
                        { name: "zh", type: "string", title: "Chinese" },
                        { name: "jp", type: "string", title: "Japanese" },
                        { name: "en", type: "string", title: "English" },
                      ],
                    },
                    { name: "fee", type: "string", title: "Fee JPY" },
                    {
                      name: "notes",
                      title: "Notes",
                      type: "object",
                      description: "Optional notes in three languages.",
                      fields: [
                        { name: "zh", type: "string", title: "Chinese" },
                        { name: "jp", type: "string", title: "Japanese" },
                        { name: "en", type: "string", title: "English" },
                      ],
                    },
                  ],
                }),
              ],
            },
          ],
        }),
      ],
    }),

    /* ========== CTA ========== */
    defineField({
      name: "ctaLabel",
      title: "CTA Button Label",
      type: "object",
      description: "Text on the call to action button in three languages.",
      fields: [
        { name: "zh", type: "string", title: "Chinese" },
        { name: "jp", type: "string", title: "Japanese" },
        { name: "en", type: "string", title: "English" },
      ],
    }),

    defineField({
      name: "ctaLink",
      title: "CTA Link",
      type: "url",
      description: "Target URL for the call to action button such as contact page.",
    }),
  ],

  preview: {
    select: { title: "title", media: "coverImage" },
    prepare({ title, media }) {
      return { title: title || "(Untitled Service)", media };
    },
  },
});
