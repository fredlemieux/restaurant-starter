// Minimal Portable Text block type — kept here so consumers of @restaurant/schemas
// don't have to depend on `sanity`. Matches the shape of @sanity/types' PortableTextBlock.
export interface PortableTextBlock {
  _type: string;
  _key?: string;
  children?: Array<{ _type: string; _key?: string; text?: string; marks?: string[] }>;
  markDefs?: Array<{ _type: string; _key: string; [key: string]: unknown }>;
  style?: string;
  listItem?: 'bullet' | 'number';
  level?: number;
}

export type Allergen =
  | 'gluten'
  | 'crustaceans'
  | 'eggs'
  | 'fish'
  | 'peanuts'
  | 'soy'
  | 'milk'
  | 'nuts'
  | 'celery'
  | 'mustard'
  | 'sesame'
  | 'sulphites'
  | 'lupin'
  | 'molluscs';

export type Day = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export interface DaySchedule {
  day: Day;
  closed: boolean;
  open?: string;
  close?: string;
}

export interface OpeningHours {
  schedule: DaySchedule[];
  note?: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  postcode: string;
  country: string;
  mapsUrl?: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  x?: string;
  youtube?: string;
}

export interface Seo {
  title?: string;
  description?: string;
  ogImage?: { asset: { _ref: string } };
  noIndex?: boolean;
}

export interface MenuItem {
  name: string;
  description?: string;
  price?: string;
  allergens?: Allergen[];
}

export interface MenuSection {
  title: string;
  description?: string;
  items: MenuItem[];
}

export interface Menu {
  _id: string;
  title: string;
  slug: { current: string };
  available?: string;
  sections: MenuSection[];
}

export interface Restaurant {
  _id: string;
  name: string;
  tagline?: string;
  heroImage?: { asset: { _ref: string } };
  about?: PortableTextBlock[];
  address?: Address;
  phone?: string;
  email?: string;
  openingHours?: OpeningHours;
  social?: SocialLinks;
  openTableRid?: string;
  seo?: Seo;
}

export interface PressMention {
  _id: string;
  publication: string;
  quote?: string;
  author?: string;
  publishedOn?: string;
  url?: string;
  logo?: { asset: { _ref: string } };
}

export interface Event {
  _id: string;
  title: string;
  slug?: { current: string };
  startsAt: string;
  endsAt?: string;
  description?: PortableTextBlock[];
  image?: { asset: { _ref: string } };
  bookingUrl?: string;
}
