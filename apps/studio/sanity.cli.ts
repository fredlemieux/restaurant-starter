import { defineCliConfig } from 'sanity/cli';
import * as process from 'node:process';

console.log('PROCESS_ENV_SANITY_PROJECT_ID:', process.env.SANITY_PROJECT_ID);

const projectId = process.env.SANITY_PROJECT_ID ?? '';
const dataset = process.env.SANITY_DATASET ?? 'production';

export default defineCliConfig({
  api: { projectId, dataset },
  autoUpdates: true,
});
