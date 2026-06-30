import type { Meta, StoryObj } from '@storybook/react-vite';
import { OpenTableEmbed } from './OpenTableEmbed';

const meta = {
  title: 'Integrations/OpenTableEmbed',
  component: OpenTableEmbed,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Mounts the OpenTable reservation widget loader. The widget itself is a third-party iframe — Storybook will show an empty container unless your network can reach opentable.co.uk.',
      },
    },
  },
} satisfies Meta<typeof OpenTableEmbed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { rid: '123456' },
};
