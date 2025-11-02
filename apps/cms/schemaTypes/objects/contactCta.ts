// File: apps/cms/schemaTypes/objects/contactCta.ts
import { defineType } from 'sanity'

export default defineType({
  name: 'contactCta',
  title: 'CTA',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: 'Button Label (ZH / JP / EN)',
      type: 'localeString',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'kind',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'LINE', value: 'line' },
          { title: 'Email', value: 'email' },
          { title: 'Booking', value: 'booking' },
          { title: 'Custom Link', value: 'link' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'href',
      title: 'Link or mailto',
      type: 'string', // ← 改成 string，避免 URL 欄位的內建協定檢查
      description:
        'Allowed: http, https, mailto, tel, or a relative path starting with /. Booking can be empty.',
      hidden: ({ parent }: any) => parent?.kind === 'booking',
      validation: (Rule) =>
        Rule.custom((val: unknown, context: any) => {
          const kind: string | undefined = context?.parent?.kind
          if (kind === 'booking') return true // booking 允許空值
          if (typeof val !== 'string' || val.trim().length === 0) {
            return 'Please enter a link or mailto'
          }
          const v = val.trim()
          const ok = v.startsWith('/') || /^(https?:|mailto:|tel:)/i.test(v)
          return ok ? true : 'Invalid link format'
        }),
    },
    {
      name: 'recommended',
      title: 'Recommended Badge',
      type: 'boolean',
      initialValue: false,
    },
  ],
  preview: {
    select: { title: 'label.zh', subtitle: 'kind' },
  },
})
