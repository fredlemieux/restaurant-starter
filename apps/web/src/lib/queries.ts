import type { Event, Menu, PressMention, Restaurant } from '@restaurant/schemas';
import { sanity } from './sanity';
import * as fixtures from '../fixtures';

// Offline mode: return local fixture data instead of calling Sanity.
// Enable with SANITY_OFFLINE=1 in the .env file. Useful for planes,
// demos without a Sanity project, and the e2e test suite.
const OFFLINE = import.meta.env.SANITY_OFFLINE === '1' || import.meta.env.SANITY_OFFLINE === 'true';

const RESTAURANT_PROJECTION = `
  _id,
  name,
  tagline,
  heroImage,
  about,
  address,
  phone,
  email,
  openingHours,
  social,
  openTableRid,
  seo
`;

export async function getRestaurant(): Promise<Restaurant | null> {
  if (OFFLINE) return fixtures.restaurant;
  return sanity.fetch<Restaurant | null>(`*[_type == "restaurant"][0]{${RESTAURANT_PROJECTION}}`);
}

export async function getMenus(): Promise<Menu[]> {
  if (OFFLINE) return fixtures.menus;
  return sanity.fetch<Menu[]>(
    `*[_type == "menu"] | order(title asc){
      _id, title, slug, available,
      sections[]{
        title, description,
        items[]{ name, description, price, allergens }
      }
    }`,
  );
}

export async function getMenuBySlug(slug: string): Promise<Menu | null> {
  if (OFFLINE) return fixtures.menus.find((m) => m.slug.current === slug) ?? null;
  return sanity.fetch<Menu | null>(
    `*[_type == "menu" && slug.current == $slug][0]{
      _id, title, slug, available,
      sections[]{
        title, description,
        items[]{ name, description, price, allergens }
      }
    }`,
    { slug },
  );
}

export async function getUpcomingEvents(): Promise<Event[]> {
  if (OFFLINE) {
    const now = Date.now();
    return fixtures.events.filter((e) => Date.parse(e.startsAt) >= now);
  }
  return sanity.fetch<Event[]>(
    `*[_type == "event" && startsAt >= now()] | order(startsAt asc){
      _id, title, slug, startsAt, endsAt, description, image, bookingUrl
    }`,
  );
}

export async function getPress(): Promise<PressMention[]> {
  if (OFFLINE) return fixtures.press;
  return sanity.fetch<PressMention[]>(
    `*[_type == "press"] | order(publishedOn desc){
      _id, publication, quote, author, publishedOn, url, logo
    }`,
  );
}
