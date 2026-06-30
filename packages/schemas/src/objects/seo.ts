import { defineType, defineField } from 'sanity';

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: '50–60 characters recommended.',
      validation: (r) => r.max(70),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 2,
      description: '150–160 characters recommended.',
      validation: (r) => r.max(200),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image',
      type: 'image',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});
