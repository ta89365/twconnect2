import {defineType, defineField} from 'sanity'
export default defineType({
  name: 'team',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string'}),
    defineField({name: 'title', title: 'Title/Role', type: 'string'}),
    defineField({name: 'avatar', title: 'Avatar', type: 'image', options: {hotspot: true}}),
    defineField({name: 'bio', title: 'Bio', type: 'text'}),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
  orderings: [{name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
})
