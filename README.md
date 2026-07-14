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
| Local dev | `pnpm dev` brings up web + studio + local mail catcher in one command |

## Why not WordPress?

The two reference sites this repo was designed against ([jamavarrestaurants.com](https://jamavarrestaurants.com/), [mimimeifair.com](https://mimimeifair.com/)) both run an identical stack: WP 7.0 + Hub theme + Elementor Pro + LiteSpeed Cache + Fluent Forms. Same agency, billed as bespoke. Their developer struggles because:

- **Three caching layers** (LiteSpeed page + object + CSS-combine, then Cloudflare, then browser) with no atomic deploy boundary.
- **Content lives in opaque DB blobs** (Elementor JSON, Redux serialised PHP) — the fix surface for an outside dev is essentially closed.
- **Editing happens in production** with no preview, no rollback, no version control.

This repo solves it by putting content in either Git (devs) or Sanity (restaurant staff), building static output, and deploying atomically. Cache invalidation becomes a non-issue.

## Quick start

```bash
pnpm install                       # install everything
pnpm run setup:env                 # copy .env.example → .env in studio + web (idempotent)
# Edit apps/studio/.env and apps/web/.env — add SANITY_PROJECT_ID (see below)
pnpm dev                           # web on :4321, studio on :3333
```

### Credentials

The scaffold reads from three third-party services. **Sanity is required to boot.** Resend and Turnstile are only needed for the contact form to actually send / block spam — leave blank for local development.

**1. Sanity — project + read token** (~2 min, browser only)

1. [sanity.io/manage](https://sanity.io/manage) → **New project** → name it, dataset `production`.
2. Copy the **project ID** (visible in the URL and the dashboard).
   → Paste into `SANITY_PROJECT_ID` in **both** `apps/studio/.env` and `apps/web/.env`.
3. Same project → **API** tab → **Tokens** → **Add API token**.
   - Name: `web-runtime`
   - Permissions: **Viewer** (least privilege — read-only)
   - Copy the token immediately, it's shown once.
   → Paste into `SANITY_READ_TOKEN` in `apps/web/.env`.
4. Same **API** tab → **CORS origins** → **Add** `http://localhost:4321` (dev) and `https://<your-domain>` (prod). Enable credentials.

Anytime after: `pnpm run sanity` opens the project's dashboard.

**2. Resend — contact form email** (~2 min)

1. [resend.com](https://resend.com) → sign up → **API Keys** → **Create API Key**.
   - Permissions: **Sending access** (write-only)
   - Copy immediately.
   → Paste into `RESEND_API_KEY` in `apps/web/.env`.
2. [resend.com/domains](https://resend.com/domains) → **Add domain** → follow the DNS records (SPF, DKIM, MX).
   Verification usually takes a few minutes. Without a verified domain you can only send from `onboarding@resend.dev` (fine for local testing).
3. Set `CONTACT_TO_ADDRESS` (where enquiries land) and `CONTACT_FROM_ADDRESS` (must match your verified sending domain).

**3. Cloudflare Turnstile — anti-spam** (~1 min, optional)

1. [dash.cloudflare.com](https://dash.cloudflare.com) → **Turnstile** → **Add site**.
   - Domain: your prod domain + `localhost` for testing.
   - Widget mode: `Managed`.
2. Copy the **Site key** → `PUBLIC_TURNSTILE_SITE_KEY` in `apps/web/.env`.
3. Copy the **Secret key** → `TURNSTILE_SECRET_KEY` in `apps/web/.env`.

Leave both blank and the contact form skips the challenge entirely.

## Repo layout

```
apps/
  web/             # Astro site (the public-facing thing)
  studio/          # Sanity Studio (the editor surface)
packages/
  ui/              # React component library + Storybook + tests
  schemas/         # Sanity schemas, shared between web and studio
  config/          # Shared ESLint + TS configs
infra/
  terraform/       # Cloudflare + Sanity provisioning
docs/              # for-developers, for-restaurant-owners, architecture
.github/workflows/ # CI + preview deploys + prod deploys + content webhook
```

## Docs

- [Architecture](./docs/architecture.md) — layer split, data flow, integrations
- [For developers](./docs/for-developers.md) — workflow, conventions, testing
- [For restaurant owners](./docs/for-restaurant-owners.md) — how to edit your site (no code)
- [Deployment](./docs/deployment.md) — Terraform + Cloudflare + Sanity setup

## License

[MIT](./LICENSE)
