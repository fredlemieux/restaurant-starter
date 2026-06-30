import { defineType, defineField } from 'sanity';

export const restaurant = defineType({
  name: 'restaurant',
  title: 'Restaurant',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Restaurant name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'One-line description shown in the hero and meta tags.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'about',
      title: 'About / story',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'address',
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
    }),
    defineField({
      name: 'openingHours',
      title: 'Opening hours',
      type: 'openingHours',
    }),
    defineField({
      name: 'social',
      title: 'Social links',
      type: 'socialLinks',
    }),
    defineField({
      name: 'openTableRid',
      title: 'OpenTable restaurant ID',
      type: 'string',
      description: 'The numeric `rid` from your OpenTable widget URL.',
    }),
    defineField({
      name: 'seo',
      title: 'Default SEO',
      type: 'seo',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'tagline' },
  },
});
