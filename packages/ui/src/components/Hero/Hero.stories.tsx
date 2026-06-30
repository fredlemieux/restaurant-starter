import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero } from './Hero';
import { Button } from '../Button/Button';

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
    name: 'Jamavar',
    tagline: 'A celebration of regional Indian cooking on Mount Street.',
    imageUrl:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=2000&q=80&auto=format&fit=crop',
    imageAlt: 'A dimly-lit dining room with warm lighting',
    cta: <Button variant="primary">Reserve a table</Button>,
  },
};

export const NoImage: Story = {
  args: { name: 'Mimi Mei Fair', tagline: 'Modern Chinese in Mayfair.' },
};

export const NoTagline: Story = {
  args: { name: 'A new opening' },
};
