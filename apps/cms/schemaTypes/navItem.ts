import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'navItem',
  title: '導覽按鈕',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: '顯示文字（繁中）',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: '連結（/開頭或完整網址）',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'external',
      title: '是否外部連結',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      title: '排序（小在前）',
      type: 'number',
      initialValue: 0,
    }),
  ],
})
