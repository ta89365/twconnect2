// apps/cms/schemaTypes/contactSection.ts
import { defineType, defineField } from "sanity";

export default defineType({
  name: "contactSection",
  title: "Contact & Inquiry Section",
  type: "document",
  fields: [
    // Headings (multi-language)
    defineField({ name: "headingZh", type: "string", title: "Heading (ZH)" }),
    defineField({ name: "headingJp", type: "string", title: "Heading (JP)" }),
    defineField({ name: "headingEn", type: "string", title: "Heading (EN)" }),

    // Body (multi-language)
    defineField({ name: "bodyZh", type: "text", title: "Body (ZH)" }),
    defineField({ name: "bodyJp", type: "text", title: "Body (JP)" }),
    defineField({ name: "bodyEn", type: "text", title: "Body (EN)" }),

    // Contact info
    defineField({
      name: "lineId",
      type: "string",
      title: "LINE ID",
      initialValue: "@030qreji",
      description: "Official LINE ID for inquiries.",
    }),
    defineField({
      name: "email",
      type: "string",
      title: "Email",
      initialValue: "info@twconnects.com",
      description: "Contact email address for inquiries.",
    }),

    // QR image
    defineField({
      name: "qrImage",
      type: "image",
      title: "LINE QR Image",
      options: { hotspot: true },
      description: "Upload the official LINE QR code image.",
    }),
  ],

  preview: {
    select: {
      media: "qrImage",
    },
    prepare({ media }) {
      return {
        title: "Contact Section",
        media,
      };
    },
  },
});
