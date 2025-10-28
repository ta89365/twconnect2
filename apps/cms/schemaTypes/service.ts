// apps/cms/schemaTypes/service.ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'service',
  title: 'Core Services Overview',
  type: 'document',
  fields: [
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'href',
      title: 'Link Href',
      type: 'url',
      validation: (Rule) => Rule.uri({ allowRelative: true }),
    }),

    // Multi-language titles
    defineField({ name: 'titleZh', title: 'Title (ZH)', type: 'string' }),
    defineField({ name: 'titleEn', title: 'Title (EN)', type: 'string' }),
    defineField({ name: 'titleJp', title: 'Title (JP)', type: 'string' }),

    // Multi-language descriptions
    defineField({ name: 'descZh', title: 'Description (ZH)', type: 'text' }),
    defineField({ name: 'descEn', title: 'Description (EN)', type: 'text' }),
    defineField({ name: 'descJp', title: 'Description (JP)', type: 'text' }),
  ],
  preview: {
    select: {
      titleEn: 'titleEn',
      media: 'image',
    },
    prepare({ titleEn, media }) {
      return { title: titleEn || 'Service', media };
    },
  },
});
