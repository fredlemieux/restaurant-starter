import type { Restaurant } from '@restaurant/schemas';

export const restaurant: Restaurant = {
  _id: 'fixture-restaurant',
  name: 'Bar Gaditano',
  tagline: 'Andalusian small plates in the old town.',
  heroImageUrl:
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=2400&q=80&auto=format&fit=crop',
  address: {
    line1: 'Calle Álamos 12',
    city: 'Málaga',
    postcode: '29012',
    country: 'Spain',
    mapsUrl: 'https://maps.google.com/?q=Calle+Álamos+12,+Málaga',
  },
  phone: '+34 952 00 00 00',
  email: 'hola@bargaditano.example',
  openingHours: {
    note: 'Kitchen closes 30 minutes before.',
    schedule: [
      { day: 'mon', closed: true },
      { day: 'tue', closed: false, open: '18:00', close: '23:00' },
      { day: 'wed', closed: false, open: '18:00', close: '23:00' },
      { day: 'thu', closed: false, open: '18:00', close: '23:00' },
      { day: 'fri', closed: false, open: '18:00', close: '00:00' },
      { day: 'sat', closed: false, open: '12:30', close: '00:00' },
      { day: 'sun', closed: false, open: '12:30', close: '17:00' },
    ],
  },
  social: {
    instagram: 'https://instagram.com/bargaditano',
  },
  openTableRid: '123456',
  about: [
    {
      _type: 'block',
      _key: 'a1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'a1s1',
          text: 'Bar Gaditano opened in 2019 in a former tobacconist on Calle Álamos. The room seats twenty-two; the kitchen is roughly the size of a walk-in wardrobe. What comes out of it is a short menu of Andalusian small plates that changes with the market — tuna from Barbate, oil from the family grove near Priego de Córdoba, whatever the boats brought in that morning at La Merced.',
        },
      ],
    },
    {
      _type: 'block',
      _key: 'a2',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'a2s1',
          text: 'We are not a tapas bar in the tourist sense. There is no free plate with your drink, no chalkboard specials, no complicated wine list. There is a room, a short menu, a fridge of sherry and biodynamic wine from small Andalusian growers, and — if you are lucky and the harbour was kind — a plate of something the owner is still slightly excited about.',
        },
      ],
    },
  ],
};
