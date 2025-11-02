// File: apps/cms/schemaTypes/documents/contactPage.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'contactPage',
  title: 'Contact Form Settings',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero' },
    { name: 'info', title: 'Info Bar' },
    { name: 'faq', title: 'Common Topics' },
    { name: 'form', title: 'Form Settings' },
    { name: 'success', title: 'Submit Success and Auto Reply' },
    { name: 'footer', title: 'Company Info' },
  ],
  fields: [
    /* ===== Hero ===== */
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'localeString',
      group: 'hero',
      description: 'Localized field (ZH / JP / EN)',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero Subtitle',
      type: 'localeText',
      group: 'hero',
      description: 'Localized field (ZH / JP / EN)',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
      fields: [{ name: 'alt', title: 'Alt Text (ZH / JP / EN)', type: 'localeString' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'ctas',
      title: 'CTA Buttons',
      type: 'array',
      of: [{ type: 'contactCta' }],
      group: 'hero',
      validation: Rule => Rule.min(1).max(4),
    }),

    /* ===== Info bar ===== */
    defineField({
      name: 'languages',
      title: 'Supported Languages (ZH / JP / EN)',
      type: 'localeString',
      group: 'info',
      description: 'Example: ZH JP EN',
    }),
    defineField({
      name: 'businessHours',
      title: 'Business Hours (ZH / JP / EN)',
      type: 'localeString',
      group: 'info',
      description: 'Example: Weekdays 10 00 to 17 00 Japan time',
    }),
    defineField({
      name: 'serviceAreas',
      title: 'Service Areas (ZH / JP / EN)',
      type: 'localeString',
      group: 'info',
      description: 'Example: Japan Taiwan United States online available',
    }),

    /* ===== FAQ topics short list ===== */
    defineField({
      name: 'commonTopics',
      title: 'Common Inquiry Topics (ZH / JP / EN)',
      type: 'localeStringArray',
      group: 'faq',
      description: 'Displayed below the hero section as a short list',
    }),

    /* ===== Form settings ===== */
    defineField({
      name: 'subjectOptions',
      title: 'Dropdown Options for Subject (ZH / JP / EN)',
      type: 'localeStringArray',
      group: 'form',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'preferredContactOptions',
      title: 'Preferred Contact Method Options (ZH / JP / EN)',
      type: 'localeStringArray',
      group: 'form',
      description: 'Example: LINE Email Online meeting',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'summaryHint',
      title: 'Summary Hint (ZH / JP / EN)',
      type: 'localeString',
      group: 'form',
      description: 'Example: Please write about 300 to 600 characters',
    }),
    defineField({
      name: 'datetimeHint',
      title: 'Preferred Date and Time Hint (ZH / JP / EN)',
      type: 'localeString',
      group: 'form',
      description: 'Example: First and second preference include time zone',
    }),
    defineField({
      name: 'attachmentHint',
      title: 'Attachment Hint (ZH / JP / EN)',
      type: 'localeString',
      group: 'form',
      description: 'Example: PDF Excel or images up to 10 MB the size limit is enforced on the frontend',
    }),
    defineField({
      name: 'consentText',
      title: 'Consent Text (ZH / JP / EN)',
      type: 'localeBlock',
      group: 'form',
      validation: Rule => Rule.required(),
    }),

    /* ===== Submit success and auto reply ===== */
    defineField({
      name: 'submitSuccessMessage',
      title: 'Submit Success Message (ZH / JP / EN)',
      type: 'localeBlock',
      group: 'success',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'autoReplySubject',
      title: 'Auto Reply Email Subject (ZH / JP / EN)',
      type: 'localeString',
      group: 'success',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'autoReplyBody',
      title: 'Auto Reply Email Body (ZH / JP / EN)',
      type: 'localeBlock',
      group: 'success',
      description: 'Placeholders available: {{subject}} {{company}} {{name}} {{preferredContact}} {{lineLink}}',
      validation: Rule => Rule.required(),
    }),

    /* ===== Footer company info ===== */
    defineField({
      name: 'addresses',
      title: 'Office Addresses (ZH / JP / EN)',
      type: 'array',
      of: [{ type: 'contactAddress' }],
      group: 'footer',
      validation: Rule => Rule.min(1),
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Contact Form Settings' }),
  },
})
