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
cp .env.example .env               # fill in Sanity + Resend + Turnstile keys
pnpm --filter @restaurant/studio sanity init   # one-time: create Sanity project
pnpm dev                           # web on :4321, studio on :3333
```

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
