// File: apps/cms/schemaTypes/objects/localeBlock.ts
import {defineType} from 'sanity'

export default defineType({
  name: 'localeBlock',
  title: 'Localized Portable Text',
  type: 'object',
  fields: [
    {name: 'jp', title: '日本語', type: 'array', of: [{type: 'block'}]},
    {name: 'zh', title: '中文（繁）', type: 'array', of: [{type: 'block'}]},
    {name: 'en', title: 'English', type: 'array', of: [{type: 'block'}]},
  ],
})
