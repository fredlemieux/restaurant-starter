import { defineCliConfig } from 'sanity/cli';

const projectId = process.env.SANITY_PROJECT_ID ?? '';
const dataset = process.env.SANITY_DATASET ?? 'production';

export default defineCliConfig({
  api: { projectId, dataset },
  autoUpdates: true,
});
