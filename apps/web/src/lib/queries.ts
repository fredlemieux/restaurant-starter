import type { Event, Menu, PressMention, Restaurant } from '@restaurant/schemas';
import { sanity } from './sanity';

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
  return sanity.fetch<Restaurant | null>(
    `*[_type == "restaurant"][0]{${RESTAURANT_PROJECTION}}`,
  );
}

export async function getMenus(): Promise<Menu[]> {
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
  return sanity.fetch<Event[]>(
    `*[_type == "event" && startsAt >= now()] | order(startsAt asc){
      _id, title, slug, startsAt, endsAt, description, image, bookingUrl
    }`,
  );
}

export async function getPress(): Promise<PressMention[]> {
  return sanity.fetch<PressMention[]>(
    `*[_type == "press"] | order(publishedOn desc){
      _id, publication, quote, author, publishedOn, url, logo
    }`,
  );
}
