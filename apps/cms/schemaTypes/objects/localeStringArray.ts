// apps/cms/schemaTypes/objects/localeStringArray.ts
import {defineType} from 'sanity'

export default defineType({
  name: 'localeStringArray',
  title: 'Localized String Array',
  type: 'object',
  fields: [
    { name: 'jp', title: '日本語', type: 'array', of: [{ type: 'string' }] },
    { name: 'zh', title: '中文（繁）', type: 'array', of: [{ type: 'string' }] },
    { name: 'en', title: 'English', type: 'array', of: [{ type: 'string' }] },
  ],
})
