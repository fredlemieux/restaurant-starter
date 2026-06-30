import { defineType, defineField } from 'sanity';

export const address = defineType({
  name: 'address',
  title: 'Address',
  type: 'object',
  fields: [
    defineField({ name: 'line1', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'line2', type: 'string' }),
    defineField({ name: 'city', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'postcode', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'country', type: 'string', initialValue: 'United Kingdom' }),
    defineField({
      name: 'mapsUrl',
      title: 'Map URL',
      type: 'url',
      description: 'Link used by the "Get directions" CTA.',
    }),
  ],
});
