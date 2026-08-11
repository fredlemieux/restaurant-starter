# restaurant-starter

Open-source scaffold for small-restaurant websites — a direct alternative to the WordPress + Elementor + LiteSpeed agency stack that produces fragile, cache-bound, £60K-quoted brochure sites.

> A restaurant site is ~95% static content + ~5% editable bits (menu, hours, what's-on). This repo solves both correctly, then deploys atomically with no cache to fight.

## What you get

| | |
|---|---|
| Site framework | **Astro 7** — zero JS by default, React islands where needed |
| Headless CMS | **Sanity Studio v6** — polished editor non-developers can drive |
| Styling | **Tailwind v4** — CSS-first, no Elementor bloat |
| Component library | **packages/ui** with **Storybook 10** + Vitest/RTL tests |
| Bookings | **OpenTable** widget (keep — it's the restaurant's reservation inventory) |
| Forms | **Resend** + serverless route + **Cloudflare Turnstile** |
| Hosting | **Cloudflare Pages** — atomic deploys, instant rollback, no purge button to forget |
| Infrastructure | **Terraform** — Cloudflare Pages + DNS + Turnstile + Sanity provisioned in one apply |
| CI | **GitHub Actions** — typecheck, lint, unit tests, integration tests, build, Lighthouse budget |
| Visual regression | **Playwright** `toHaveScreenshot()` baselines committed per route |
| Offline / demo mode | **Fixture layer** — `SANITY_OFFLINE=1` renders the entire site with zero network |

## Why not WordPress?

The two reference sites this repo was designed against ([jamavarrestaurants.com](https://jamavarrestaurants.com/), [mimimeifair.com](https://mimimeifair.com/)) both run an identical stack: WP 7.0 + Hub theme + Elementor Pro + LiteSpeed Cache + Fluent Forms. Same agency, billed as bespoke. Their developer struggles because:

- **Three caching layers** (LiteSpeed page + object + CSS-combine, then Cloudflare, then browser) with no atomic deploy boundary.
- **Content lives in opaque DB blobs** (Elementor JSON, Redux serialised PHP) — the fix surface for an outside dev is essentially closed.
- **Editing happens in production** with no preview, no rollback, no version control.

This repo solves it by putting content in either Git (devs) or Sanity (restaurant staff), building static output, and deploying atomically. Cache invalidation becomes a non-issue.

---

## Quick start (2 minutes, zero external services)

```bash
pnpm install
pnpm run setup:env          # copies .env.example → .env in web + studio
pnpm dev                    # web on :4321, studio on :3333, storybook on :6006 if opened
open http://localhost:4321
```

The scaffold ships with **`SANITY_OFFLINE=1` set by default** in `apps/web/.env.example` and a fixture layer at `apps/web/src/fixtures/*.ts` (the Bar Gaditano tapas bar in Málaga). The site renders end-to-end with **no Sanity account, no Resend key, no Turnstile key**. Everything works on a plane.

Connect real services when you're ready — see the two sections below.

---

## Connecting real Sanity (~5 minutes)

1. Create a project at [sanity.io/manage](https://sanity.io/manage) → **New project**, name it, dataset `production`.
2. Copy the **Project ID** from the URL bar.
3. Paste into both `apps/studio/.env` and `apps/web/.env` as `SANITY_PROJECT_ID=<id>`.
4. Same project → **API** tab → **Tokens** → **Add API token**:
   - `web-runtime` — **Viewer** — paste as `SANITY_READ_TOKEN` in `apps/web/.env`
   - `seed-and-migrate` — **Editor** — paste as `SANITY_WRITE_TOKEN` in `apps/web/.env`
5. Same **API** tab → **CORS origins** → **Add** `http://localhost:4321` and your production origin. Enable credentials.
6. Seed the dataset from the fixture data:

   ```bash
   pnpm seed
   ```

   Writes restaurant + menus + press + events in one idempotent transaction. Re-runs update in place.

7. Flip to real Sanity:

   ```bash
   # apps/web/.env
   SANITY_OFFLINE=0
   ```

   Restart `pnpm dev`. The site now reads from your Sanity dataset. Edit content at http://localhost:3333, refresh :4321, watch it change.

8. Hero image: upload one at http://localhost:3333 → Media Library → drag into Restaurant → Hero image. (The `heroImageUrl` string field on the Restaurant type is a fixture-mode escape hatch and is ignored when real `heroImage` is set.)

## Connecting Resend + Turnstile (optional, ~3 minutes)

Only needed for the contact form to actually send email + block spam.

- **Resend** — [resend.com](https://resend.com) → API Keys → Create → "Sending access" → paste as `RESEND_API_KEY` in `apps/web/.env`. Verify a domain at [resend.com/domains](https://resend.com/domains) then update `CONTACT_FROM_ADDRESS`.
- **Turnstile** — [dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile → Add site → paste site key as `PUBLIC_TURNSTILE_SITE_KEY` and secret as `TURNSTILE_SECRET_KEY` in `apps/web/.env`.

Leave both blank and the contact form silently skips the challenge — fine for local development.

---

## Common commands

| Command | What it does |
|---------|--------------|
| `pnpm dev` | Web + studio + any package dev servers in parallel |
| `pnpm --filter @restaurant/web dev` | Just the Astro site on :4321 |
| `pnpm storybook` | Component library preview on :6006 |
| `pnpm sanity` | Opens the Sanity project dashboard in the browser |
| `pnpm seed` | Seeds the connected Sanity dataset from fixture content |
| `pnpm test` | Unit tests across all packages (Vitest) |
| `pnpm test:e2e` | Playwright end-to-end + visual regression |
| `pnpm typecheck` | astro-check + tsc across the monorepo |
| `pnpm lint` | ESLint across the monorepo |
| `pnpm format` | Prettier auto-fix |
| `pnpm format:check` | Prettier check without writes (matches CI) |
| `pnpm build` | Production build of the web app for Cloudflare Pages |

## Visual regression tests

`apps/web/tests/e2e/visual.spec.ts` full-page-screenshots eight routes on every run and compares against baselines committed under `visual.spec.ts-snapshots/`. This is the safety net that catches "hero doesn't render / nav invisible / utility classes missing" bugs that pure behaviour tests slip past.

After intentional visual changes:

```bash
pnpm --filter @restaurant/web exec playwright test visual.spec.ts --update-snapshots
git add apps/web/tests/e2e/visual.spec.ts-snapshots
git commit -m "test(web): update visual baselines"
```

---

## Repo layout

```
apps/
  web/                   # Astro site (public-facing thing)
    src/fixtures/        # Bar Gaditano fixture — served when SANITY_OFFLINE=1
    scripts/seed-sanity.ts
    tests/e2e/           # Playwright: smoke, contact, visual regression
    public/media/        # Local image cache (gitignored, see SOURCES.md)
  studio/                # Sanity Studio (editor surface)
packages/
  ui/                    # React component library + Storybook + tests
    src/styles.css       # Tailwind entry + theme tokens + @source scan
  schemas/               # Sanity schemas + shared TypeScript types
  config/                # Shared ESLint + TS configs
infra/
  terraform/             # Cloudflare + Sanity provisioning
.github/workflows/       # CI + preview deploys + prod deploys + content webhook
```

## Docs

- [Architecture](./docs/architecture.md) — layer split, data flow, integrations
- [For developers](./docs/for-developers.md) — workflow, conventions, testing
- [For restaurant owners](./docs/for-restaurant-owners.md) — how to edit your site (no code)
- [Deployment](./docs/deployment.md) — Terraform + Cloudflare + Sanity setup

## License

[MIT](./LICENSE)
