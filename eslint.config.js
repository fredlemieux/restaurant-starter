import base from './packages/config/eslint/base.js';
import react from './packages/config/eslint/react.js';
import astro from './packages/config/eslint/astro.js';

export default [
  ...base,
  ...react,
  ...astro,
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.astro/**',
      '**/storybook-static/**',
      '**/coverage/**',
      '**/playwright-report/**',
      '**/test-results/**',
    ],
  },
];
