import {defineType, defineField} from 'sanity'
export default defineType({
  name: 'case',
  title: 'Case',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string'}),
    defineField({name: 'excerpt', title: 'Excerpt', type: 'text'}),
    defineField({name: 'thumb', title: 'Thumbnail', type: 'image', options: {hotspot: true}}),
    defineField({name: 'url', title: 'Link', type: 'url'}),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
  orderings: [{name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
})
