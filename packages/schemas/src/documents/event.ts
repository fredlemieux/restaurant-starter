import { defineType, defineField } from 'sanity';

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title' },
    }),
    defineField({
      name: 'startsAt',
      title: 'Starts at',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endsAt',
      title: 'Ends at',
      type: 'datetime',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bookingUrl',
      title: 'Booking URL',
      type: 'url',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'startsAt' },
  },
  orderings: [
    {
      title: 'Upcoming first',
      name: 'startsAtAsc',
      by: [{ field: 'startsAt', direction: 'asc' }],
    },
  ],
});
