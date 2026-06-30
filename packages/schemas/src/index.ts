import { restaurant } from './documents/restaurant';
import { menu } from './documents/menu';
import { page } from './documents/page';
import { event } from './documents/event';
import { press } from './documents/press';
import { openingHours } from './objects/openingHours';
import { allergen } from './objects/allergen';
import { seo } from './objects/seo';
import { address } from './objects/address';
import { socialLinks } from './objects/socialLinks';

export const schemaTypes = [
  restaurant,
  menu,
  page,
  event,
  press,
  openingHours,
  allergen,
  seo,
  address,
  socialLinks,
];

export * from './types';
