// File: apps/cms/schemaTypes/objects/localeString.ts
import {defineType} from 'sanity'

export default defineType({
  name: 'localeString',
  title: 'Localized String',
  type: 'object',
  fields: [
    {name: 'jp', title: '日本語', type: 'string'},
    {name: 'zh', title: '中文（繁）', type: 'string'},
    {name: 'en', title: 'English', type: 'string'},
  ],
})
