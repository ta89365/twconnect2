// File: apps/cms/schemaTypes/objects/localeText.ts
import {defineType} from 'sanity'

export default defineType({
  name: 'localeText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    {name: 'jp', title: '日本語', type: 'text'},
    {name: 'zh', title: '中文（繁）', type: 'text'},
    {name: 'en', title: 'English', type: 'text'},
  ],
})
