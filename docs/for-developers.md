# For developers

## Prerequisites

- Node 24+ (`nvm install` / `fnm use` in this repo picks it up from `.nvmrc`)
- pnpm 10+ (`corepack enable && corepack prepare pnpm@10 --activate`)
- Docker (only needed for the local mail catcher)
- A Sanity account + project ID (free tier is fine)
- A Cloudflare account (for Pages + Turnstile)
- A Resend account (for contact-form email)

## First run

```bash
pnpm install
cp .env.example .env                  # fill in values
cd apps/studio && pnpm sanity init    # one-time: connect to a Sanity project
cd ../..
pnpm dev                              # web on :4321, studio on :3333
```

In another terminal (optional, for contact-form testing):
```bash
pnpm --filter @restaurant/web dev:stack   # starts Mailpit on :8025
```

## Daily loop

| | |
|---|---|
| `pnpm dev` | Web + Studio in parallel, live reload |
| `pnpm storybook` | Component lab on :6006 |
| `pnpm test` | Unit + UI tests (Vitest) across all packages |
| `pnpm test:e2e` | Playwright against a fresh build of the web app |
| `pnpm typecheck` | Astro check + `tsc --noEmit` across packages |
| `pnpm lint` | ESLint flat config across packages |
| `pnpm format` | Prettier write-through |
| `pnpm build` | Production build of every package |

## Conventions

- **Components.** Every UI component lives in `packages/ui/src/components/<Name>/` with `<Name>.tsx`, `<Name>.stories.tsx`, `<Name>.test.tsx`, `index.ts`. No exceptions.
- **No domain in UI.** `packages/ui` may not `import` from `@sanity/client`. It may import *types* from `@restaurant/schemas` only.
- **Sanity queries.** All GROQ lives in `apps/web/src/lib/queries.ts`. Pages never call `sanity.fetch` directly.
- **Server vs client.** Astro components render at request/build time. Interactive React goes inside a `client:*` directive. Default to `client:visible` unless the component is above-the-fold critical.
- **Forms.** Validate twice — Zod on the server in `pages/api/contact.ts`, browser-native in the React component. Server is the source of truth.
- **Env access.** Always via `import.meta.env`. Never `process.env` in app code. The Cloudflare adapter exposes both.

## Adding a new page

1. Add an Astro file in `apps/web/src/pages/`.
2. If it needs CMS content, add a query function in `apps/web/src/lib/queries.ts`.
3. If it needs a new content shape, add a document to `packages/schemas/src/documents/`.
4. If it needs a new visual unit, add a component to `packages/ui/src/components/` *with* a story and a test.
5. Add the new page to `Nav.astro` if it should appear in the global nav.

## Adding a new schema document

1. Define it in `packages/schemas/src/documents/<name>.ts` using `defineType`.
2. Add a matching TS interface in `packages/schemas/src/types.ts`.
3. Export from `packages/schemas/src/index.ts` (already barrelled — just adding to `schemaTypes`).
4. Add to Studio's structure list in `apps/studio/src/structure.ts` if it deserves a top-level slot.
5. Add a Vitest assertion in `packages/schemas/tests/schemas.test.ts`.

## Deploy

- Preview: open a PR → `deploy-preview.yml` puts a build at `https://<branch>.<project>.pages.dev`.
- Production: merge to `main` → `deploy-prod.yml` ships, then runs Lighthouse with the budget in `.github/lighthouse-budget.json`.
- Sanity Studio: deploy via `pnpm --filter @restaurant/studio deploy` (one-time, then on schema changes).

## Rollback

Cloudflare Pages → Deployments → "Rollback" on the prior known-good build. No DB to migrate; no cache to purge. Done in 30 seconds.
