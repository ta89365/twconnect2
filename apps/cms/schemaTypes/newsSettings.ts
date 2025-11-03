// apps/cms/schemaTypes/newsSettings.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "newsSettings",
  title: "News Settings",
  type: "document",
  fields: [
    /* ✅ Hero Background Image */
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description:
        "Main visual background image displayed at the top of the news entrance page (recommended wide image; enable Hotspot to control the focus).",
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

    /* ===== Hero Texts ===== */
    defineField({ name: "heroTitleJp", title: "Hero Title (Japanese)", type: "string" }),
    defineField({ name: "heroTitleZh", title: "Hero Title (Chinese)", type: "string" }),
    defineField({ name: "heroTitleEn", title: "Hero Title (English)", type: "string" }),
    defineField({ name: "heroSubtitleJp", title: "Hero Subtitle (Japanese)", type: "text", rows: 3 }),
    defineField({ name: "heroSubtitleZh", title: "Hero Subtitle (Chinese)", type: "text", rows: 3 }),
    defineField({ name: "heroSubtitleEn", title: "Hero Subtitle (English)", type: "text", rows: 3 }),

    /* ===== Listing Strategy ===== */
    defineField({
      name: "listStrategy",
      title: "Listing Strategy",
      type: "string",
      description: "Select how the news posts should be displayed on the entrance page.",
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

    /* ===== Manual Order ===== */
    defineField({
      name: "manualOrder",
      title: "Manual Order",
      type: "array",
      description: "If 'Manual order' is selected above, choose the specific posts to display in order.",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      hidden: ({ parent }) => parent?.listStrategy !== "manual",
    }),

    /* ===== Featured Posts ===== */
    defineField({
      name: "featuredPosts",
      title: "Featured Posts",
      type: "array",
      description: "Manually select posts to feature at the top or highlight sections.",
      of: [{ type: "reference", to: [{ type: "post" }] }],
    }),

    /* ===== Quick Topics ===== */
    defineField({
      name: "quickTopics",
      title: "Quick Topics Chips",
      type: "array",
      description: "Select categories that appear as quick topic chips under the hero section.",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
  ],

  preview: {
    prepare() {
      return { title: "News Entrance Settings" };
    },
  },
});
