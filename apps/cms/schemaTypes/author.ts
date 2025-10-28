// apps/cms/schemaTypes/author.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "author",
  title: "Article Authors",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: r => r.required() }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt text", type: "string" }],
    }),
    defineField({ name: "title", title: "Title", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "array", of: [{ type: "block" }] }),
    defineField({ name: "email", title: "Email", type: "string" }),
    defineField({ name: "linkedin", title: "LinkedIn", type: "url" }),
  ],
  preview: {
    select: { title: "name", media: "avatar" },
    prepare: ({ title, media }) => ({ title, media }),
  },
});
