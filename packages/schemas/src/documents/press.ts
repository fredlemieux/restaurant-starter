import { defineType, defineField } from 'sanity';

export const press = defineType({
  name: 'press',
  title: 'Press mention',
  type: 'document',
  fields: [
    defineField({
      name: 'publication',
      title: 'Publication',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'quote',
      title: 'Pull quote',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'author',
      title: 'Author / critic',
      type: 'string',
    }),
    defineField({
      name: 'publishedOn',
      title: 'Published on',
      type: 'date',
    }),
    defineField({
      name: 'url',
      title: 'Article URL',
      type: 'url',
    }),
    defineField({
      name: 'logo',
      title: 'Publication logo',
      type: 'image',
    }),
  ],
  preview: {
    select: { title: 'publication', subtitle: 'quote' },
  },
  orderings: [
    {
      title: 'Newest first',
      name: 'publishedDesc',
      by: [{ field: 'publishedOn', direction: 'desc' }],
    },
  ],
});
