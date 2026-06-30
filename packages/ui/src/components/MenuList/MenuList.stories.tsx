import type { Meta, StoryObj } from '@storybook/react-vite';
import { MenuList } from './MenuList';

const meta = {
  title: 'Sections/MenuList',
  component: MenuList,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
} satisfies Meta<typeof MenuList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dinner: Story = {
  args: {
    menu: {
      _id: 'menu-1',
      title: 'Dinner',
      slug: { current: 'dinner' },
      available: 'Served Tuesday–Saturday, 6pm–10pm',
      sections: [
        {
          title: 'Small plates',
          items: [
            {
              name: 'Burrata, peach, basil',
              description: 'Heritage tomatoes, Andalusian olive oil.',
              price: '£14',
              allergens: ['milk'],
            },
            { name: 'Padrón peppers', price: '£8' },
          ],
        },
        {
          title: 'Mains',
          description: 'All mains served with the sourdough of the day.',
          items: [
            {
              name: 'Cornish hake, brown butter, capers',
              price: '£28',
              allergens: ['fish', 'milk'],
            },
            { name: 'Aged sirloin, bordelaise', price: '£36', allergens: ['gluten'] },
          ],
        },
      ],
    },
  },
};
