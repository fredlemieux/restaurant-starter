import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';

let cachedClient: SanityClient | undefined;

function getClient(): SanityClient {
  if (cachedClient) return cachedClient;

  const projectId = import.meta.env.SANITY_PROJECT_ID;
  if (!projectId) {
    throw new Error(
      'SANITY_PROJECT_ID is not set. Copy .env.example to .env and fill it in before running queries.',
    );
  }

  const token = import.meta.env.SANITY_READ_TOKEN;
  cachedClient = createClient({
    projectId,
    dataset: import.meta.env.SANITY_DATASET ?? 'production',
    apiVersion: import.meta.env.SANITY_API_VERSION ?? '2026-01-01',
    useCdn: !token,
    ...(token ? { token } : {}),
    perspective: 'published',
  });

  return cachedClient;
}

export const sanity = new Proxy({} as SanityClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getClient(), prop, receiver);
  },
});

export function imageUrl(source: SanityImageSource): string {
  return createImageUrlBuilder(getClient()).image(source).auto('format').fit('max').url();
}
