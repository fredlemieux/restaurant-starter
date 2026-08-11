# Media sources

This directory holds locally-cached images for offline / demo mode. The
**contents are gitignored** — assets are referenced by URL below so anyone
can re-fetch. This keeps the repo lean while making the source of every
image explicit.

## Current behaviour

The Bar Gaditano fixture (`apps/web/src/fixtures/restaurant.ts`) references
Unsplash CDN URLs directly. **No download step is required for online dev.**
The `pnpm media:download` script (TODO) will pull all URLs listed here into
this folder for fully-offline use.

## Assets

| Local filename         | URL                                                                                          | Source   | License                             | Used for                       |
|------------------------|----------------------------------------------------------------------------------------------|----------|-------------------------------------|--------------------------------|
| `hero-dining-room.jpg` | https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=2400&q=80&auto=format&fit=crop | Unsplash | [Unsplash License][unsplash-lic]    | Homepage hero — dim dining room |

## Notes for real deployments

Replace these placeholder images with photography of the actual restaurant
you're building for. Hero images should be at least 2400px wide, JPEG or
WebP, aggressively compressed (target ≤400 KB per image).

For hosted image transformation with CDN caching, upload to Sanity's asset
pipeline (Studio → Media Library) and reference the `heroImage` field
instead of `heroImageUrl`. The `heroImageUrl` field on the Restaurant type
is an escape hatch for fixture / offline mode only.

[unsplash-lic]: https://unsplash.com/license
