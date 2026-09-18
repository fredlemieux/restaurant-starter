# restaurant-starter

Open-source scaffold for small-restaurant websites — a modern alternative to the typical WordPress + page-builder agency stack, built around static-first rendering, a headless CMS, and atomic deploys.

**🔗 Live demo:** [my-restaurant.pages.dev](https://my-restaurant.pages.dev) — the Bar Gaditano fixture running on Cloudflare Pages, editable from a hosted Sanity Studio.

[![Live demo](https://img.shields.io/badge/Live%20demo-my--restaurant.pages.dev-1a73e8?style=flat-square&logo=cloudflare&logoColor=white)](https://my-restaurant.pages.dev)
[![Buy me a beer](https://img.shields.io/badge/Buy%20me%20a%20beer-%F0%9F%8D%BA-00457C?style=flat-square&logo=paypal&logoColor=white)](https://paypal.me/frederiquelemieux1)

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

## Why static + headless?

The common stack for small-restaurant sites is WordPress + a page-builder (Elementor / Divi / WPBakery) + a caching plugin (LiteSpeed / WP Rocket) + a forms plugin. It works, but it tends to lock in a few structural problems for anyone who inherits the site later:

- **Multiple overlapping caching layers** (page + object + CSS-combine, then a CDN, then browser) with no atomic deploy boundary.
- **Content lives in opaque database blobs** (page-builder JSON, serialised PHP) — the surface for an outside developer to make surgical edits is essentially closed.
- **Editing happens directly in production** with no preview, no rollback, no version control on the content itself.

This repo takes the other route: content lives in either Git (developers) or Sanity (restaurant staff), the site builds to static output, and each deploy is atomic. Cache invalidation stops being something to worry about.

> **Deployment model — revisit later.** Current mode is pure SSG (`output: 'static'` in `astro.config.mjs`). A Sanity content edit does not appear until a rebuild fires. The chain today: Sanity webhook → GitHub `repository_dispatch` (auth: PAT, not a shared secret) → `content-webhook.yml` builds + uploads via wrangler. Two things worth revisiting: (a) whether some routes should switch to SSR / ISR for faster content freshness, and (b) whether to add a direct HMAC-verified `apps/web/src/pages/api/webhooks/sanity.ts` endpoint so Sanity can trigger rebuilds without GitHub on the critical path. Not urgent until content edit → live latency actually becomes a problem for a client.

## Running costs

Approximate monthly cost for a small restaurant site (own domain, low-to-moderate traffic, 1–3 editors). Prices in GBP; convert as needed.

| Item | Cost | Notes |
|---|---|---|
| Custom domain | **~£10/yr** | Registrar fee. Cloudflare Registrar sells at-cost. |
| Cloudflare Pages hosting | **£0/mo** | Free tier: unlimited requests + bandwidth, 500 builds/month. |
| Sanity (CMS) | **£0/mo** | Free tier: 3 users, 500k API CDN requests/mo, 10GB assets, 2 datasets. Jumps to **~£80/mo** (Growth, $99) if you exceed request limits or need more editors. |
| Cloudflare Turnstile (anti-spam) | **£0** | Free, no cap. |
| Resend (contact-form email) | **£0/mo** | Free tier: 3,000 emails/month, 100/day. Pro ~£16/mo ($20) for 50k. |
| OpenTable widget | **£0** | Free to embed — OpenTable monetises on the booking side. |
| GitHub Actions (CI/CD) | **£0** | Unlimited minutes on a public repo. Private repo: 2,000 min/mo free. |
| Sanity Studio hosting | **£0** | `<slug>.sanity.studio` subdomain included. Custom Studio domain needs a paid Sanity plan. |

**Realistic total for a small restaurant on defaults: ~£10/year** (just the domain — everything else fits inside free tiers).

**When costs grow:** the first bill you're likely to see is Sanity Growth (~£80/mo) if you add more than 3 editors or your site becomes popular enough to blow past the 500k CDN request cap. Turnstile, Pages, and Actions will realistically stay at £0 even at meaningful scale.

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

Only needed for the contact form to actually send email + block spam. Leave both blank and the contact form silently skips the challenge — fine for pure local development.

### Cloudflare Turnstile

Turnstile is a privacy-respecting CAPTCHA alternative. The scaffold's contact form uses it to gate submissions.

**Local dev — Cloudflare test keys (no account needed)**

Cloudflare publishes public test keys that always pass, always fail, or always challenge. The scaffold's `apps/web/.env.example` **defaults to the always-challenge pair** so a fresh `pnpm run setup:env` boots with the interactive widget visible — you see Turnstile actually rendering without registering anything.

- `1x…AA` pair — **always passes** (silent, no interaction)
- `2x…AB` / `2x…AA` pair — always fails (test the rejection path)
- `3x…FF` / `3x…AA` pair — **always challenges** (interactive widget — the default in `.env.example`)

Swap in a different pair to test rejection / silent-pass paths. Full reference: [developers.cloudflare.com/turnstile/troubleshooting/testing](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).

**Prod — real Turnstile site (~2 minutes)**

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Turnstile** (left sidebar) → **Add site**
2. Site name: `restaurant-<slug>` (or whatever fits your project naming)
3. **Hostnames:** add all of `localhost`, `127.0.0.1`, and your production domain (comma-separated)
4. **Widget mode:** Managed (recommended default)
5. **Pre-clearance:** No
6. Save, then copy the **site key** and **secret key** from the widget detail page
7. Paste into `apps/web/.env`:

   ```env
   PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAAAAAAAAAAAAAAAA
   TURNSTILE_SECRET_KEY=0x4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
   ```

Restart the dev server after any `.env` change — Vite only reads env at boot.

### Resend

- Sign up at [resend.com](https://resend.com) → **API Keys** → **Create** → "Sending access"
- Paste the `re_…` value as `RESEND_API_KEY` in `apps/web/.env`
- Verify a sender domain at [resend.com/domains](https://resend.com/domains), then set `CONTACT_FROM_ADDRESS` to a `you@your-verified-domain` address
- For pure local dev with no email actually sent, leave the key blank — the API route logs the payload instead

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
