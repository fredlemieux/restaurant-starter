import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero } from './Hero';

const meta = {
  title: 'Sections/Hero',
  component: Hero,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    eyebrow: 'Mount Street · Est. 2017',
    name: 'Jamavar',
    tagline: 'A celebration of regional Indian cooking on Mount Street.',
    imageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=2000&q=80&auto=format&fit=crop',
    imageAlt: 'A dimly-lit dining room with warm lighting',
    ctaLabel: 'Reserve a table',
    ctaHref: '#',
  },
};

export const NoImage: Story = {
  args: {
    eyebrow: 'Coming Soon',
    name: 'Mimi Mei Fair',
    tagline: 'Modern Chinese in Mayfair.',
    ctaLabel: 'Join the waitlist',
    ctaHref: '#',
  },
};

export const Centered: Story = {
  args: {
    align: 'center',
    eyebrow: 'A new opening',
    name: 'Bar Gaditano',
    tagline: 'Andalusian small plates in the old town of Málaga.',
    imageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=2000&q=80&auto=format&fit=crop',
    imageAlt: '',
    ctaLabel: 'Reserve a table',
    ctaHref: '#',
  },
};

export const NoTagline: Story = {
  args: { name: 'A new opening' },
};
