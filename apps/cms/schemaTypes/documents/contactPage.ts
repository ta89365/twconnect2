// File: apps/cms/schemaTypes/documents/contactPage.ts
import { defineField, defineType } from "sanity"

export default defineType({
  name: "contactPage",
  title: "Contact Form Settings",
  type: "document",
  groups: [
    { name: "hero", title: "Hero Section" },
    { name: "info", title: "Information Bar" },
    { name: "faq", title: "Common Topics" },
    { name: "form", title: "Form Settings" },
    { name: "success", title: "Submission Success and Auto Reply" },
    { name: "footer", title: "Company Information" },
  ],
  fields: [
    /* ===== Hero Section ===== */
    defineField({
      name: "heroTitle",
      title: "Hero Title",
      type: "localeString",
      group: "hero",
      description: "Localized field (ZH / JP / EN). Main title displayed at the top of the contact page.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "localeText",
      group: "hero",
      description: "Localized field (ZH / JP / EN). Subtitle text displayed below the main hero title.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "hero",
      description: "Background image for the hero section. Recommended to use a wide image and enable Hotspot.",
      options: { hotspot: true },
      fields: [{ name: "alt", title: "Alt Text (ZH / JP / EN)", type: "localeString" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "ctas",
      title: "CTA Buttons",
      type: "array",
      of: [{ type: "contactCta" }],
      group: "hero",
      description: "One to four CTA buttons displayed below the hero section.",
      validation: (Rule) => Rule.min(1).max(4),
    }),

    /* ===== Information Bar ===== */
    defineField({
      name: "languages",
      title: "Supported Languages",
      type: "localeString",
      group: "info",
      description: "Example: ZH, JP, EN. Displayed as supported language information.",
    }),
    defineField({
      name: "businessHours",
      title: "Business Hours",
      type: "localeString",
      group: "info",
      description: "Example: Weekdays 10:00 to 17:00 (Japan time).",
    }),
    defineField({
      name: "serviceAreas",
      title: "Service Areas",
      type: "localeString",
      group: "info",
      description: "Example: Japan, Taiwan, United States (online available).",
    }),

    /* ===== Common Inquiry Topics ===== */
    defineField({
      name: "commonTopics",
      title: "Common Inquiry Topics",
      type: "localeStringArray",
      group: "faq",
      description: "Short list of frequently asked topics displayed below the hero section.",
    }),

    /* ===== Form Settings ===== */
    defineField({
      name: "subjectOptions",
      title: "Subject Dropdown Options",
      type: "localeStringArray",
      group: "form",
      description: "Localized dropdown options for the inquiry subject field (ZH / JP / EN).",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "preferredContactOptions",
      title: "Preferred Contact Method Options",
      type: "localeStringArray",
      group: "form",
      description: "Example: LINE, Email, Online Meeting.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "summaryHint",
      title: "Summary Field Hint",
      type: "localeString",
      group: "form",
      description: "Example: Please write about 300 to 600 characters.",
    }),
    defineField({
      name: "datetimeHint",
      title: "Preferred Date and Time Hint",
      type: "localeString",
      group: "form",
      description: "Example: Provide first and second preferences and include time zone.",
    }),
    defineField({
      name: "attachmentHint",
      title: "Attachment Field Hint",
      type: "localeString",
      group: "form",
      description:
        "Example: PDF, Excel, or images up to 10 MB. The file size limit is enforced on the frontend.",
    }),
    defineField({
      name: "consentText",
      title: "Consent Text",
      type: "localeBlock",
      group: "form",
      description:
        "Localized text for user consent or privacy policy acknowledgment before submission.",
      validation: (Rule) => Rule.required(),
    }),

    /* ===== Submission Success and Auto Reply ===== */
    defineField({
      name: "submitSuccessMessage",
      title: "Submission Success Message",
      type: "localeBlock",
      group: "success",
      description: "Displayed on the website after the form is successfully submitted.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "autoReplySubject",
      title: "Auto Reply Email Subject",
      type: "localeString",
      group: "success",
      description: "Subject line of the automated reply email.",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "autoReplyBody",
      title: "Auto Reply Email Body",
      type: "localeBlock",
      group: "success",
      description:
        "Body content of the automated reply email. Available placeholders: {{subject}}, {{company}}, {{name}}, {{preferredContact}}, {{lineLink}}.",
      validation: (Rule) => Rule.required(),
    }),

    /* ===== Footer: Company Information ===== */
    defineField({
      name: "addresses",
      title: "Office Addresses",
      type: "array",
      of: [{ type: "contactAddress" }],
      group: "footer",
      description: "List of company office addresses displayed at the bottom of the contact page.",
      validation: (Rule) => Rule.min(1),
    }),
  ],

  preview: {
    prepare: () => ({ title: "Contact Form Settings" }),
  },
})
