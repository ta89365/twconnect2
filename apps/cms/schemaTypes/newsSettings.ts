// apps/cms/schemaTypes/newsSettings.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "newsSettings",
  title: "News Settings / 入口頁設定",
  type: "document",
  fields: [
    /* ✅ 新增：Hero 背景圖欄位 */
    defineField({
      name: "heroImage",
      title: "Hero Image / 背景圖",
      type: "image",
      description: "顯示於新聞入口頁頂端的主視覺背景圖（建議寬幅圖，啟用 Hotspot 以便控制焦點）",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text / 圖片說明文字",
          type: "string",
          description: "圖片替代文字（用於 SEO 與無障礙設計）",
        }),
      ],
    }),

    defineField({ name: "heroTitleJp", title: "Hero Title JP", type: "string" }),
    defineField({ name: "heroTitleZh", title: "Hero Title ZH", type: "string" }),
    defineField({ name: "heroTitleEn", title: "Hero Title EN", type: "string" }),
    defineField({ name: "heroSubtitleJp", title: "Hero Subtitle JP", type: "text", rows: 3 }),
    defineField({ name: "heroSubtitleZh", title: "Hero Subtitle ZH", type: "text", rows: 3 }),
    defineField({ name: "heroSubtitleEn", title: "Hero Subtitle EN", type: "text", rows: 3 }),

    defineField({
      name: "listStrategy",
      title: "Listing Strategy",
      type: "string",
      options: {
        list: [
          { title: "Newest", value: "newest" },
          { title: "Featured first then newest", value: "featuredThenNewest" },
          { title: "Pinned first then featured then newest", value: "pinnedFeaturedNewest" },
          { title: "Manual order", value: "manual" },
        ],
        layout: "radio",
      },
      initialValue: "pinnedFeaturedNewest",
    }),

    defineField({
      name: "manualOrder",
      title: "Manual Order",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      hidden: ({ parent }) => parent?.listStrategy !== "manual",
    }),

    defineField({
      name: "featuredPosts",
      title: "Featured Posts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
    }),

    defineField({
      name: "quickTopics",
      title: "Quick Topics Chips",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    }),
  ],

  preview: {
    prepare() {
      return { title: "News Entrance Settings" };
    },
  },
});
