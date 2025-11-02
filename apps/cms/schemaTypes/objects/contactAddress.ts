// File: apps/cms/schemaTypes/objects/contactAddress.ts
import {defineType} from 'sanity'

export default defineType({
  name: 'contactAddress', // ← 物件型別名稱，請勿與 contactPage 重複
  title: '公司地址',
  type: 'object',
  fields: [
    {
      name: 'label',
      title: '據點標籤',
      type: 'localeString',
      validation: Rule => Rule.required(),
    },
    {
      name: 'address',
      title: '地址內容',
      type: 'localeText',
      validation: Rule => Rule.required(),
    },
    {
      name: 'note',
      title: '備註',
      type: 'localeString',
    },
  ],
  preview: {
    select: {title: 'label.zh', subtitle: 'address.zh'},
  },
})
