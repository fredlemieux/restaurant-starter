import type { PressMention } from '@restaurant/schemas';

export const press: PressMention[] = [
  {
    _id: 'fixture-press-1',
    publication: 'Condé Nast Traveler',
    quote: 'The most confident twenty-two seats in Málaga.',
    author: 'Sarah Barrell',
    publishedOn: '2026-04-11',
    url: 'https://example.com/cn-traveler',
  },
  {
    _id: 'fixture-press-2',
    publication: 'El País Gastro',
    quote: 'Una carta corta, honesta, sin trampas — Andalucía servida como se comía en casa.',
    author: 'Ana Vega Pérez',
    publishedOn: '2026-02-22',
  },
  {
    _id: 'fixture-press-3',
    publication: 'Time Out Málaga',
    quote: 'Bookings should come with a warning: you will cancel your other plans.',
    publishedOn: '2026-01-08',
    url: 'https://example.com/timeout',
  },
];
