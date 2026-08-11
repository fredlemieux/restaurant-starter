import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@chromatic-com/storybook',
  ],
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },
  // Storybook's Vite instance is separate from the astro app's — we need to
  // register the @tailwindcss/vite plugin here too so the tokens + utility
  // classes referenced in stories actually get compiled. Without this,
  // preview.ts imports styles.css as plain CSS with no @source scan and
  // stories render with default UA fonts / no utilities.
  viteFinal: async (config) => {
    config.plugins = [...(config.plugins ?? []), tailwindcss()];
    return config;
  },
};

export default config;
