import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'mlText',
  title: 'Multilingual Text',
  type: 'object',
  fields: [
    defineField({ name: 'zh', title: '繁中', type: 'text' }),
    defineField({ name: 'ja', title: '日文', type: 'text' }),
    defineField({ name: 'en', title: '英文', type: 'text' }),
  ],
  options: { columns: 3 },
});
