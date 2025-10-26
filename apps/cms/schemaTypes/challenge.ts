// apps/cms/schemaTypes/challenge.ts
import React from 'react'
import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export default defineType({
  name: 'challenge',
  title: 'Challenge',
  type: 'document',
  icon: DocumentIcon,

  fields: [
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      validation: (Rule) => Rule.min(0).integer(),
    }),

    // 新增：選擇用哪個 outline icon（僅存 key，前端渲染真正的 SVG）
    defineField({
      name: 'iconKey',
      title: 'Icon (Outline)',
      type: 'string',
      description: '挑選一個代表此痛點的線條圖示（前端用 lucide-react 渲染）',
      options: {
        list: [
          { title: 'Building / 設立流程', value: 'building-2' },
          { title: 'Landmark / 銀行與資金', value: 'landmark' },
          { title: 'Scale / 稅務會計差異', value: 'scale' },
          { title: 'Badge Check / 合規與契約', value: 'badge-check' },
          { title: 'Globe 2 / 跨境協同與數據', value: 'globe-2' },
          { title: 'Sparkles / 其他', value: 'sparkles' },
        ],
        layout: 'radio',
      },
    }),

    // 圖片版本（可選）
    defineField({
      name: 'iconImage',
      title: 'Icon Image',
      type: 'image',
      options: { hotspot: true },
      description: '若要自備圖片，建議 256×256 PNG 透明背景；否則使用上面的 Outline Icon',
    }),

    // 舊資料相容：emoji 字串
    defineField({
      name: 'iconEmoji',
      title: 'Icon Emoji (legacy or fallback)',
      type: 'string',
      description: '保留舊資料用，如 🔍；若已上傳圖片或選擇 outline icon 可不填',
      validation: (Rule) => Rule.max(8),
    }),

    // 多語標題
    defineField({ name: 'titleZh', title: 'Title (ZH)', type: 'string' }),
    defineField({ name: 'titleEn', title: 'Title (EN)', type: 'string' }),
    defineField({ name: 'titleJp', title: 'Title (JP)', type: 'string' }),

    // 多語說明
    defineField({ name: 'descZh', title: 'Description (ZH)', type: 'text' }),
    defineField({ name: 'descEn', title: 'Description (EN)', type: 'text' }),
    defineField({ name: 'descJp', title: 'Description (JP)', type: 'text' }),
  ],

  preview: {
    select: {
      titleZh: 'titleZh',
      titleEn: 'titleEn',
      iconImage: 'iconImage',
      iconEmoji: 'iconEmoji',
    },
    prepare({ titleZh, titleEn, iconImage, iconEmoji }) {
      const title = titleZh || titleEn || 'Challenge'
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
