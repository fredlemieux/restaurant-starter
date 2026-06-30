import type { Meta, StoryObj } from '@storybook/react-vite';
import { OpeningHours } from './OpeningHours';

const meta = {
  title: 'Sections/OpeningHours',
  component: OpeningHours,
  tags: ['autodocs'],
} satisfies Meta<typeof OpeningHours>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TuesdayToSaturday: Story = {
  args: {
    hours: {
      note: 'Kitchen closes 30 minutes before.',
      schedule: [
        { day: 'mon', closed: true },
        { day: 'tue', closed: false, open: '18:00', close: '22:30' },
        { day: 'wed', closed: false, open: '18:00', close: '22:30' },
        { day: 'thu', closed: false, open: '18:00', close: '22:30' },
        { day: 'fri', closed: false, open: '18:00', close: '23:00' },
        { day: 'sat', closed: false, open: '12:00', close: '23:00' },
        { day: 'sun', closed: false, open: '12:00', close: '17:00' },
      ],
    },
  },
};

export const ClosedAllWeek: Story = {
  args: {
    hours: {
      schedule: [
        { day: 'mon', closed: true },
        { day: 'tue', closed: true },
        { day: 'wed', closed: true },
        { day: 'thu', closed: true },
        { day: 'fri', closed: true },
        { day: 'sat', closed: true },
        { day: 'sun', closed: true },
      ],
    },
  },
};
