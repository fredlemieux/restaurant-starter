import { defineType, defineField, defineArrayMember } from 'sanity';

export const menu = defineType({
  name: 'menu',
  title: 'Menu',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Dinner", "Tasting", "Brunch".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'available',
      title: 'Availability note',
      type: 'string',
      description: 'e.g. "Served Tuesday–Saturday 6pm–10pm".',
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'section',
          title: 'Section',
          fields: [
            defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', type: 'text', rows: 2 }),
            defineField({
              name: 'items',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'menuItem',
                  title: 'Menu item',
                  fields: [
                    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
                    defineField({ name: 'description', type: 'text', rows: 2 }),
                    defineField({ name: 'price', type: 'string' }),
                    defineField({
                      name: 'allergens',
                      type: 'array',
                      of: [defineArrayMember({ type: 'allergen' })],
                    }),
                  ],
                  preview: { select: { title: 'name', subtitle: 'price' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'available' },
  },
});
