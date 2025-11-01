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
        "Column 入口頁頂部背景圖。建議使用寬圖並啟用 Hotspot。",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "無障礙與 SEO 的替代文字。",
        }),
      ],
    }),

    // Hero Texts
    defineField({ name: "heroTitleJp", title: "Hero Title (Japanese)", type: "string" }),
    defineField({ name: "heroTitleZh", title: "Hero Title (Chinese)", type: "string" }),
    defineField({ name: "heroTitleEn", title: "Hero Title (English)", type: "string" }),
    defineField({ name: "heroSubtitleJp", title: "Hero Subtitle (Japanese)", type: "text", rows: 3 }),
    defineField({ name: "heroSubtitleZh", title: "Hero Subtitle (Chinese)", type: "text", rows: 3 }),
    defineField({ name: "heroSubtitleEn", title: "Hero Subtitle (English)", type: "text", rows: 3 }),

    // Listing Strategy
    defineField({
      name: "listStrategy",
      title: "Listing Strategy",
      type: "string",
      description: "選擇入口清單的排序方式。",
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
      description: "當上方選 Manual 時，依此順序顯示文章。",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      hidden: ({ parent }) => parent?.listStrategy !== "manual",
    }),

    // Featured Posts
    defineField({
      name: "featuredPosts",
      title: "Featured Posts",
      type: "array",
      description: "入口重點推薦文章清單。",
      of: [{ type: "reference", to: [{ type: "post" }] }],
    }),

    // Quick Topics
    defineField({
      name: "quickTopics",
      title: "Quick Topics Chips",
      type: "array",
      description: "Hero 下方快速主題籤。",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
  ],

  preview: {
    prepare() {
      return { title: "Column Entrance Settings" };
    },
  },
});
