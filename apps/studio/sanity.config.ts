import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from '@restaurant/schemas';
import { structure } from './src/structure';

// Sanity Studio only loads env vars prefixed `SANITY_STUDIO_` from
// .env files — this is a Studio convention, distinct from the web
// app's SANITY_PROJECT_ID. Keep the prefix or Studio boots with an
// empty projectId and throws "Configuration must contain `projectId`".
const projectId = process.env.SANITY_STUDIO_PROJECT_ID ?? '';
const dataset = process.env.SANITY_STUDIO_DATASET ?? 'production';

export default defineConfig({
  name: 'restaurant-studio',
  title: 'Restaurant',
  projectId,
  dataset,
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
});
