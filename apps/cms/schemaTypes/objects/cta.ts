import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'cta',
  title: 'CTA',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: '按鈕文字',
      type: 'mlText',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: '連結（可為內部或外部網址）',
      type: 'string',
      validation: (Rule) =>
        Rule.required().custom((value) => {
          if (!value) return '必填';
          // 允許 / 開頭的內部路徑或 http/https 完整網址
          if (value.startsWith('/') || /^https?:\/\//.test(value)) return true;
          return '請輸入以 / 開頭的內部路徑或完整網址';
        }),
    }),
    defineField({
      name: 'external',
      title: '在新分頁開啟',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: { label: 'label.zh', href: 'href' },
    prepare: ({ label, href }) => ({
      title: label || 'CTA',
      subtitle: href,
    }),
  },
});
