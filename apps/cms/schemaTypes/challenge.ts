// apps/cms/schemaTypes/challenge.ts
import React from 'react'
import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export default defineType({
  name: 'challenge',
  title: 'Client Challenges Section',
  type: 'document',
  icon: DocumentIcon,

  fields: [
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (Rule) => Rule.min(0).integer(),
    }),

    // Icon selection (outline icon key)
    defineField({
      name: 'iconKey',
      title: 'Icon (Outline)',
      type: 'string',
      description: 'Select an outline icon key (rendered with lucide-react).',
      options: {
        list: [
          { title: 'Building / Setup Process', value: 'building-2' },
          { title: 'Landmark / Banking & Funding', value: 'landmark' },
          { title: 'Scale / Tax & Accounting Differences', value: 'scale' },
          { title: 'Badge Check / Compliance & Contracts', value: 'badge-check' },
          { title: 'Globe 2 / Cross-border Collaboration & Data', value: 'globe-2' },
          { title: 'Sparkles / Others', value: 'sparkles' },
        ],
        layout: 'radio',
      },
    }),

    // Optional custom image version
    defineField({
      name: 'iconImage',
      title: 'Icon Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional custom icon image (recommended 256×256 PNG with transparent background).',
    }),

    // Legacy emoji field
    defineField({
      name: 'iconEmoji',
      title: 'Icon Emoji (Legacy or Fallback)',
      type: 'string',
      description: 'For legacy data, e.g., 🔍. Can be left empty if an icon or image is selected.',
      validation: (Rule) => Rule.max(8),
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
      iconImage: 'iconImage',
      iconEmoji: 'iconEmoji',
    },
    prepare({ titleEn, iconImage, iconEmoji }) {
      const title = titleEn || 'Challenge'
      const media =
        iconImage ||
        (iconEmoji
          ? () =>
              React.createElement(
                'span',
                { style: { fontSize: '1.5rem', lineHeight: 1 } },
                iconEmoji
              )
          : undefined)
      return { title, media }
    },
  },
})
