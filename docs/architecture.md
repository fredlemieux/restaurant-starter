# Architecture

## Layer split

```
┌─────────────────────────────────────────────────────────────┐
│  apps/web   ← composition root: wires data + UI + delivery │
│  apps/studio ← Sanity Studio editor surface                 │
└───────────┬──────────────────────────┬──────────────────────┘
            │                          │
   ┌────────▼────────┐         ┌───────▼────────┐
   │ packages/ui     │         │ packages/schemas │
   │ presentation    │         │  domain          │
   │ (props in only) │         │  (Sanity-coupled) │
   └─────────────────┘         └────────────────┘
```

- `packages/ui` is **pure presentation**: every component takes plain props, has a Storybook story, has a Vitest+RTL test. It must never import from `@sanity/client`. This is what makes Chromatic snapshots stable and Storybook-driven development work.
- `packages/schemas` is the **single source of truth** for content shape. Both Studio and the web app import from it.
- `apps/web` is the **composition root** — it fetches via Sanity, transforms to props, and hands off to UI. The only place network code lives.
- `apps/studio` is a thin shell — Studio config + structure + the shared schemas.

## Data flow

```
                ┌──────────────┐
                │   editor     │ (restaurant manager)
                └──────┬───────┘
                       │  edits content
                ┌──────▼───────────┐
                │  Sanity Studio   │ (apps/studio)
                └──────┬───────────┘
                       │  publishes (mutation)
                ┌──────▼───────────┐
                │   Sanity API     │
                └──────┬───────────┘
                       │  webhook signed
                ┌──────▼────────────────────────┐
                │ GitHub repository_dispatch    │
                └──────┬────────────────────────┘
                       │  triggers
                ┌──────▼───────────────────────────┐
                │ deploy-prod workflow             │
                │  → pnpm --filter web build       │
                │  → wrangler pages deploy         │
                └──────┬───────────────────────────┘
                       │
                ┌──────▼───────────────────────┐
                │  Cloudflare Pages (atomic)   │
                └──────────────────────────────┘
```

## Why this kills WordPress's cache problem

There is no "purge button" because there is **no shared mutable cache between the editor and the runtime**:

- Editor writes go to Sanity (content store).
- Build pulls from Sanity at build time.
- Output is immutable per deployment, content-hashed, served from CF edge.
- A bad change rolls back instantly (revert the deployment in Cloudflare dashboard).

Whereas a typical LiteSpeed+Cloudflare+Browser WordPress stack has the editor *writing into the same MySQL the page cache is reading from*, which is why so many "purge the cache" sessions end in incident retros.

## Integrations

| Service | Layer | Why |
|---|---|---|
| Sanity | Headless CMS | Editor surface matters more than self-hosting at this scale |
| Cloudflare Pages | Hosting | Atomic deploys + free preview branches + edge cache by default |
| Cloudflare Turnstile | Anti-spam | Better DX than reCAPTCHA, single platform |
| Resend | Transactional email | Clean API; no template platform needed for one form |
| OpenTable | Bookings | The restaurant already has inventory there; widget is iframe-only |

## What's intentionally NOT here

- **No "page builder"** — pages are Astro files in Git. The CMS holds *content*, not layout.
- **No admin auth** — Sanity is the admin surface.
- **No DB / Postgres** — the contact form is the only write path and it's a single email.
- **No CI for Studio** — Studio is deployed via `sanity deploy`, not from CI; restaurant doesn't need the workflow noise.
