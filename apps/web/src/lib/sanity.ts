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

// The Proxy defers `createClient` until first use so a fresh clone
// can typecheck without SANITY_PROJECT_ID. Function values MUST be
// bound to the real client — Sanity Client v7 uses ES private class
// fields (#httpRequest), and those are looked up by instance identity,
// not by prototype. An unbound method invoked on the Proxy throws
// "Cannot read private member #httpRequest".
export const sanity = new Proxy({} as SanityClient, {
  get(_target, prop) {
    const client = getClient();
    const value = Reflect.get(client, prop);
    return typeof value === 'function' ? value.bind(client) : value;
  },
});

export function imageUrl(source: SanityImageSource): string {
  return createImageUrlBuilder(getClient()).image(source).auto('format').fit('max').url();
}
