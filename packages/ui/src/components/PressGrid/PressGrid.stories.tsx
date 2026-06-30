import type { Meta, StoryObj } from '@storybook/react-vite';
import { PressGrid } from './PressGrid';

const meta = {
  title: 'Sections/PressGrid',
  component: PressGrid,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof PressGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Three: Story = {
  args: {
    items: [
      {
        _id: '1',
        publication: 'The Guardian',
        quote: 'Quietly one of the best new openings in years.',
        author: 'Grace Dent',
        publishedOn: '2026-02-12',
        url: 'https://example.com',
      },
      {
        _id: '2',
        publication: 'Time Out',
        quote: 'A confident, restrained kitchen with a serious sense of place.',
        author: 'Tania Ballantine',
        publishedOn: '2026-03-04',
      },
      {
        _id: '3',
        publication: 'Eater London',
        quote: 'Sauce work alone is worth the trip.',
        publishedOn: '2026-04-22',
      },
    ],
  },
};
