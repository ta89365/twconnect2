import { defineType, defineField } from "sanity";

export default defineType({
  name: "cta",
  title: "CTA",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Button Label",
      type: "mlText",
      description: "Text displayed on the button (supports multiple languages).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "href",
      title: "Link (can be internal or external URL)",
      type: "string",
      description: "Enter either an internal path starting with '/' or a full external URL.",
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return "This field is required.";
          // Allow internal path starting with '/' or full http/https URL
          if (value.startsWith("/") || /^https?:\/\//.test(value)) return true;
          return "Please enter a valid internal path starting with '/' or a full URL.";
        }),
    }),
    defineField({
      name: "external",
      title: "Open in New Tab",
      type: "boolean",
      description: "If enabled, the link will open in a new browser tab.",
      initialValue: false,
    }),
  ],
  preview: {
    select: { label: "label.zh", href: "href" },
    prepare: ({ label, href }) => ({
      title: label || "CTA",
      subtitle: href,
    }),
  },
});
