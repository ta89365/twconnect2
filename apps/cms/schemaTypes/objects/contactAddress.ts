// File: apps/cms/schemaTypes/objects/contactAddress.ts
import { defineType } from "sanity"

export default defineType({
  name: "contactAddress", // Object type name (must not duplicate with contactPage)
  title: "Company Address",
  type: "object",
  fields: [
    {
      name: "label",
      title: "Location Label",
      type: "localeString",
      description: "Label or name for the office or branch location (e.g., Taipei Office, Tokyo Branch).",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "address",
      title: "Address Details",
      type: "localeText",
      description: "Full address information in each supported language.",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "note",
      title: "Notes",
      type: "localeString",
      description: "Optional remarks such as floor, landmark, or additional directions.",
    },
  ],
  preview: {
    select: { title: "label.zh", subtitle: "address.zh" },
  },
})
