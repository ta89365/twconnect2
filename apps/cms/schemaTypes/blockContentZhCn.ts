// File: apps/cms/schemaTypes/blockContentZhCn.ts
import { defineType } from "sanity";

export default defineType({
  name: "blockContentZhCn",
  title: "Block Content (ZH-CN)",
  type: "array",
  description:
    "Rich text blocks in Simplified Chinese. Use for paragraphs, lists, and inline links.",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Code", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "External link",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                description:
                  "Full URL including protocol. Example: https://www.example.com",
                validation: (Rule) => Rule.uri({ allowRelative: false }),
              },
              {
                name: "openInNewTab",
                type: "boolean",
                title: "Open in new tab",
                initialValue: true,
              },
            ],
          },
        ],
      },
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
    },
    {
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt text (ZH-CN)",
          description:
            "Short description for accessibility. Keep it concise in Simplified Chinese.",
          validation: (Rule) => Rule.max(120),
        },
        {
          name: "caption",
          type: "string",
          title: "Caption (ZH-CN)",
          description: "Optional short caption in Simplified Chinese.",
          validation: (Rule) => Rule.max(160),
        },
      ],
    },
  ],
});
