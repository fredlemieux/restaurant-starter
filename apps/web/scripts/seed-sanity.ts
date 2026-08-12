#!/usr/bin/env bun
/* eslint-disable no-console -- this is a CLI script; console is the point */
/**
 * Seeds the configured Sanity dataset with the Bar Gaditano fixture
 * content — the same restaurant/menus/press/events that offline mode
 * serves from `src/fixtures/`. Idempotent: uses createOrReplace with
 * stable, slug-derived IDs so re-runs update in place.
 *
 * Usage (from repo root):
 *
 *   pnpm seed
 *
 * Requires the following in apps/web/.env:
 *   SANITY_PROJECT_ID     — from sanity.io/manage
 *   SANITY_DATASET        — usually "production"
 *   SANITY_WRITE_TOKEN    — Editor-role token, sanity.io/manage → project → API → Tokens
 *
 * Note: heroImage is not seeded — that's a Sanity image reference which
 * requires an asset upload flow. Upload one via the Studio Media Library
 * after seeding, or extend `stageRestaurant` with client.assets.upload().
 */

import { createClient, type Transaction } from '@sanity/client';
import { restaurant, menus, events, press } from '../src/fixtures';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? 'production';
const apiVersion = process.env.SANITY_API_VERSION ?? '2026-01-01';
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId) {
  console.error('SANITY_PROJECT_ID missing. Populate apps/web/.env from .env.example.');
  process.exit(1);
}
if (!token) {
  console.error('SANITY_WRITE_TOKEN missing.');
  console.error(
    '  Create an Editor-role token: https://sanity.io/manage/personal/project/' +
      projectId +
      '/api → Tokens → Add API token → Editor',
  );
  console.error('  Then paste it as SANITY_WRITE_TOKEN=sk... in apps/web/.env');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function sanitySlug(current: string) {
  return { _type: 'slug' as const, current };
}

function stageRestaurant(tx: Transaction): void {
  const { _id: _rid, heroImageUrl: _hero, ...rest } = restaurant;
  tx.createOrReplace({ _id: 'restaurant-main', _type: 'restaurant', ...rest });
}

function stageMenus(tx: Transaction): void {
  for (const menu of menus) {
    const { _id: _mid, slug, ...rest } = menu;
    tx.createOrReplace({
      _id: `menu-${slug.current}`,
      _type: 'menu',
      ...rest,
      slug: sanitySlug(slug.current),
    });
  }
}

function stagePress(tx: Transaction): void {
  for (const p of press) {
    const { _id: _pid, ...rest } = p;
    tx.createOrReplace({
      _id: `press-${slugify(`${p.publication}-${p.publishedOn ?? ''}`)}`,
      _type: 'press',
      ...rest,
    });
  }
}

function stageEvents(tx: Transaction): void {
  for (const e of events) {
    const { _id: _eid, slug, ...rest } = e;
    const id = slug?.current ?? slugify(e.title);
    tx.createOrReplace({
      _id: `event-${id}`,
      _type: 'event',
      ...rest,
      ...(slug ? { slug: sanitySlug(slug.current) } : {}),
    });
  }
}

function logSuccess(count: number): void {
  console.log(`  ${count} documents written`);
  console.log(`    restaurant   restaurant-main`);
  console.log(`    menus        ${menus.length}`);
  console.log(`    press        ${press.length}`);
  console.log(`    events       ${events.length}`);
  console.log('');
  console.log('Next steps:');
  console.log(`  1. Studio:    pnpm --filter @restaurant/studio dev  →  http://localhost:3333`);
  console.log(`  2. Roundtrip: set SANITY_OFFLINE=0 in apps/web/.env, then pnpm dev`);
  console.log(`  3. Hero image: upload one via Studio → Media Library`);
}

async function seed(): Promise<void> {
  const tx = client.transaction();
  stageRestaurant(tx);
  stageMenus(tx);
  stagePress(tx);
  stageEvents(tx);

  console.log(`Seeding → ${projectId}/${dataset}`);
  const result = await tx.commit();
  logSuccess(result.results.length);
}

seed().catch((err: unknown) => {
  const e = err as { message?: string; statusCode?: number };
  console.error('Seed failed:', e.message ?? err);
  if (e.statusCode) console.error(`  HTTP ${e.statusCode}`);
  process.exit(1);
});
