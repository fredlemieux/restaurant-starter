import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OpeningHours } from './OpeningHours';

describe('OpeningHours', () => {
  it('orders days Monday through Sunday', () => {
    render(
      <OpeningHours
        hours={{
          schedule: [
            { day: 'sun', closed: false, open: '10:00', close: '17:00' },
            { day: 'mon', closed: false, open: '12:00', close: '22:00' },
          ],
        }}
      />,
    );
    const dts = screen.getAllByRole('term').map((el) => el.textContent);
    expect(dts).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
  });

  it('renders "Closed" for missing days', () => {
    render(<OpeningHours hours={{ schedule: [] }} />);
    const closedDays = screen.getAllByText('Closed');
    expect(closedDays.length).toBe(7);
  });

  it('renders open and close times', () => {
    render(
      <OpeningHours
        hours={{
          schedule: [{ day: 'fri', closed: false, open: '18:00', close: '23:00' }],
        }}
      />,
    );
    expect(screen.getByText('18:00 – 23:00')).toBeInTheDocument();
  });

  it('renders the free-text note when provided', () => {
    render(
      <OpeningHours
        hours={{ schedule: [], note: 'Last orders 9pm.' }}
      />,
    );
    expect(screen.getByText('Last orders 9pm.')).toBeInTheDocument();
  });
});
