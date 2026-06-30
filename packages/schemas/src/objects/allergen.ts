import { defineType } from 'sanity';

export const ALLERGENS = [
  'gluten',
  'crustaceans',
  'eggs',
  'fish',
  'peanuts',
  'soy',
  'milk',
  'nuts',
  'celery',
  'mustard',
  'sesame',
  'sulphites',
  'lupin',
  'molluscs',
] as const;

export const allergen = defineType({
  name: 'allergen',
  title: 'Allergen',
  type: 'string',
  options: {
    list: ALLERGENS.map((a) => ({ title: a, value: a })),
  },
});
