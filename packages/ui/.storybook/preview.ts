import type { Preview } from '@storybook/react-vite';
import '../src/styles.css';

// Inject Google Fonts <link> into the preview iframe head so stories render
// with the real Cormorant Garamond / Inter typography rather than falling
// back to Georgia / system-ui.
if (typeof document !== 'undefined') {
  const fontHref =
    'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Inter:wght@300;400;500;600;700&display=swap';
  if (!document.head.querySelector(`link[href="${fontHref}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontHref;
    document.head.appendChild(link);
  }
}

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
