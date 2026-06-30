import { defineType, defineField, defineArrayMember } from 'sanity';

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export const openingHours = defineType({
  name: 'openingHours',
  title: 'Opening hours',
  type: 'object',
  fields: [
    defineField({
      name: 'schedule',
      title: 'Schedule',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'daySchedule',
          fields: [
            defineField({
              name: 'day',
              type: 'string',
              options: {
                list: DAYS.map((d) => ({ title: d.toUpperCase(), value: d })),
                layout: 'dropdown',
              },
              validation: (r) => r.required(),
            }),
            defineField({ name: 'closed', type: 'boolean', initialValue: false }),
            defineField({
              name: 'open',
              type: 'string',
              description: 'HH:mm (24h)',
              hidden: ({ parent }) => Boolean(parent?.closed),
            }),
            defineField({
              name: 'close',
              type: 'string',
              description: 'HH:mm (24h)',
              hidden: ({ parent }) => Boolean(parent?.closed),
            }),
          ],
          preview: {
            select: { day: 'day', open: 'open', close: 'close', closed: 'closed' },
            prepare({ day, open, close, closed }) {
              return {
                title: String(day ?? '—').toUpperCase(),
                subtitle: closed ? 'Closed' : `${open ?? '—'} – ${close ?? '—'}`,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'note',
      title: 'Free-text note',
      type: 'string',
      description: 'e.g. "Kitchen closes 30 min before".',
    }),
  ],
});
