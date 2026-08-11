import type { Event } from '@restaurant/schemas';

export const events: Event[] = [
  {
    _id: 'fixture-event-sherry',
    title: 'Sherry & Manzanilla night with Bodegas Colosía',
    slug: { current: 'sherry-colosia' },
    startsAt: '2026-09-18T19:30:00+02:00',
    endsAt: '2026-09-18T23:00:00+02:00',
    bookingUrl: 'https://opentable.co.uk/restaurant/example',
    description: [
      {
        _type: 'block',
        _key: 'e1',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'e1s1',
            text: 'A guided walk-through of five sherries paired with five small plates, hosted by third-generation bodeguera Rocío Colosía from El Puerto de Santa María. €55 per person, limited to twenty seats.',
          },
        ],
      },
    ],
  },
  {
    _id: 'fixture-event-atun',
    title: 'Almadraba tuna dinner',
    slug: { current: 'almadraba' },
    startsAt: '2026-10-05T20:00:00+02:00',
    description: [
      {
        _type: 'block',
        _key: 'e2',
        style: 'normal',
        children: [
          {
            _type: 'span',
            _key: 'e2s1',
            text: 'A five-course dinner celebrating the almadraba tuna catch from Zahara de los Atunes — ventresca, morrillo, tarantelo, all served the way the fishermen actually eat them.',
          },
        ],
      },
    ],
  },
];
