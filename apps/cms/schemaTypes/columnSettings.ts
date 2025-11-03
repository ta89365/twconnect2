// apps/cms/schemaTypes/columnSettings.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "columnSettings",
  title: "Column Settings",
  type: "document",
  fields: [
    // Hero Background Image
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description:
        "Background image for the top section of the Column landing page. It is recommended to use a wide image and enable the Hotspot option.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Alternative text for accessibility and SEO purposes.",
        }),
      ],
    }),

    // Hero Texts
    defineField({
      name: "heroTitleJp",
      title: "Hero Title (Japanese)",
      type: "string",
      description: "Main title displayed in the hero section (Japanese).",
    }),
    defineField({
      name: "heroTitleZh",
      title: "Hero Title (Chinese)",
      type: "string",
      description: "Main title displayed in the hero section (Chinese).",
    }),
    defineField({
      name: "heroTitleEn",
      title: "Hero Title (English)",
      type: "string",
      description: "Main title displayed in the hero section (English).",
    }),
    defineField({
      name: "heroSubtitleJp",
      title: "Hero Subtitle (Japanese)",
      type: "text",
      rows: 3,
      description: "Subtitle text displayed below the hero title (Japanese).",
    }),
    defineField({
      name: "heroSubtitleZh",
      title: "Hero Subtitle (Chinese)",
      type: "text",
      rows: 3,
      description: "Subtitle text displayed below the hero title (Chinese).",
    }),
    defineField({
      name: "heroSubtitleEn",
      title: "Hero Subtitle (English)",
      type: "text",
      rows: 3,
      description: "Subtitle text displayed below the hero title (English).",
    }),

    // Listing Strategy
    defineField({
      name: "listStrategy",
      title: "Listing Strategy",
      type: "string",
      description: "Choose how the post list on the entrance page should be sorted.",
      options: {
        list: [
          { title: "Newest", value: "newest" },
          { title: "Featured first, then newest", value: "featuredThenNewest" },
          { title: "Pinned first, then featured, then newest", value: "pinnedFeaturedNewest" },
          { title: "Manual order", value: "manual" },
        ],
        layout: "radio",
      },
      initialValue: "pinnedFeaturedNewest",
    }),

    // Manual Order
    defineField({
      name: "manualOrder",
      title: "Manual Order",
      type: "array",
      description: "When 'Manual order' is selected above, posts will be displayed in this order.",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      hidden: ({ parent }) => parent?.listStrategy !== "manual",
    }),

    // Featured Posts
    defineField({
      name: "featuredPosts",
      title: "Featured Posts",
      type: "array",
      description: "Highlighted or recommended posts shown on the entrance page.",
      of: [{ type: "reference", to: [{ type: "post" }] }],
    }),

    // Quick Topics
    defineField({
      name: "quickTopics",
      title: "Quick Topic Chips",
      type: "array",
      description: "Quick topic tags displayed below the hero section.",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
  ],

  preview: {
    prepare() {
      return { title: "Column Entrance Settings" };
    },
  },
});
