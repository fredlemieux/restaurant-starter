import type { Menu } from '@restaurant/schemas';

export const menus: Menu[] = [
  {
    _id: 'fixture-menu-tapas',
    title: 'Tapas',
    slug: { current: 'tapas' },
    available: 'Served all evening from 6pm.',
    sections: [
      {
        title: 'From the sea',
        items: [
          {
            name: 'Boquerones en vinagre',
            description: 'Cured anchovies, garlic, parsley, Priego olive oil.',
            price: '€6',
            allergens: ['fish'],
          },
          {
            name: 'Almejas al Palo Cortado',
            description: 'Clams steamed in Palo Cortado sherry, jamón fat.',
            price: '€14',
            allergens: ['molluscs', 'sulphites'],
          },
          {
            name: 'Tartar de atún rojo',
            description: 'Barbate red tuna, soy, sesame, avocado.',
            price: '€16',
            allergens: ['fish', 'soy', 'sesame'],
          },
        ],
      },
      {
        title: 'From the land',
        items: [
          { name: 'Aceitunas gordal', price: '€4' },
          {
            name: 'Croquetas de rabo de toro',
            description: 'Slow-braised oxtail, sherry béchamel.',
            price: '€9',
            allergens: ['milk', 'gluten', 'eggs'],
          },
          {
            name: 'Pimientos de Padrón',
            description: 'Fried, sea salt.',
            price: '€7',
          },
        ],
      },
      {
        title: 'To finish',
        items: [
          {
            name: 'Torta de aceite',
            description: 'Olive oil biscuit, whipped honey, Pedro Ximénez raisins.',
            price: '€6',
            allergens: ['gluten', 'milk'],
          },
        ],
      },
    ],
  },
  {
    _id: 'fixture-menu-menu-del-dia',
    title: 'Menú del día',
    slug: { current: 'menu-del-dia' },
    available: 'Tuesday–Friday, 1pm–4pm. €18 including a glass.',
    sections: [
      {
        title: 'Primeros',
        items: [{ name: 'Gazpacho' }, { name: 'Ensalada de tomate rosa, atún, cebolleta' }],
      },
      {
        title: 'Segundos',
        items: [
          { name: 'Merluza a la plancha, ali oli de perejil' },
          { name: 'Solomillo ibérico, patatas al pobre' },
        ],
      },
      {
        title: 'Postres',
        items: [{ name: 'Flan de la casa' }, { name: 'Fruta de temporada' }],
      },
    ],
  },
];
