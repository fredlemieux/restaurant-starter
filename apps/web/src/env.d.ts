/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_SITE_URL: string;
  readonly SANITY_PROJECT_ID: string;
  readonly SANITY_DATASET: string;
  readonly SANITY_API_VERSION: string;
  readonly SANITY_READ_TOKEN?: string;
  readonly SANITY_WEBHOOK_SECRET?: string;
  readonly RESEND_API_KEY?: string;
  readonly CONTACT_TO_ADDRESS?: string;
  readonly CONTACT_FROM_ADDRESS?: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
  readonly TURNSTILE_SECRET_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
