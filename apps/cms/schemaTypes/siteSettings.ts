// apps/cms/schemaTypes/siteSettings.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Global Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),

    // ---- 舊版相容（保留舊值；在 Studio 隱藏） ----
    defineField({ name: "title", title: "Legacy Title", type: "string", hidden: true }),
    defineField({ name: "description", title: "Legacy Description", type: "text", hidden: true }),

    // ---- 導覽（多語）----
    defineField({
      name: "navigation",
      title: "Navigation",
      type: "array",
      of: [
        defineField({
          name: "navItem",
          title: "Nav Item",
          type: "object",
          fields: [
            { name: "labelZh", title: "Label (ZH)", type: "string" },
            { name: "labelEn", title: "Label (EN)", type: "string" },
            { name: "labelJp", title: "Label (JP)", type: "string" },
            { name: "href", title: "Href", type: "string" },
            { name: "external", title: "Open in new tab?", type: "boolean", initialValue: false },
            { name: "order", title: "Order", type: "number" },
          ],
          preview: {
            select: { zh: "labelZh", en: "labelEn", jp: "labelJp", href: "href" },
            prepare({ zh, en, jp, href }) {
              return { title: zh || en || jp || "(no label)", subtitle: href || "" };
            },
          },
        }),
      ],
      options: { sortable: true },
    }),

    // ---- 社群連結 ----
    defineField({
      name: "social",
      title: "Social",
      type: "object",
      fields: [
        { name: "facebook", type: "url" },
        { name: "instagram", type: "url" },
        { name: "linkedin", type: "url" },
        { name: "github", type: "url" },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
