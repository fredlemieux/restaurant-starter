import base from './base.js';
import astro from 'eslint-plugin-astro';

export default [
  ...base,
  ...astro.configs.recommended,
];
