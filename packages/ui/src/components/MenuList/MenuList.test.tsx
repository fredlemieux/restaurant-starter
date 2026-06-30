import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MenuList } from './MenuList';
import type { Menu } from '@restaurant/schemas';

const fixture: Menu = {
  _id: 'm',
  title: 'Dinner',
  slug: { current: 'dinner' },
  available: 'Tue–Sat',
  sections: [
    {
      title: 'Starters',
      items: [
        { name: 'Burrata', price: '£12', allergens: ['milk'] },
        { name: 'Padrón peppers', price: '£8' },
      ],
    },
  ],
};

describe('MenuList', () => {
  it('renders the menu title and availability', () => {
    render(<MenuList menu={fixture} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Dinner' })).toBeInTheDocument();
    expect(screen.getByText('Tue–Sat')).toBeInTheDocument();
  });

  it('renders each section as an h3', () => {
    render(<MenuList menu={fixture} />);
    expect(screen.getByRole('heading', { level: 3, name: 'Starters' })).toBeInTheDocument();
  });

  it('renders every item with name and price', () => {
    render(<MenuList menu={fixture} />);
    expect(screen.getByText('Burrata')).toBeInTheDocument();
    expect(screen.getByText('£12')).toBeInTheDocument();
    expect(screen.getByText('Padrón peppers')).toBeInTheDocument();
    expect(screen.getByText('£8')).toBeInTheDocument();
  });

  it('shows allergens when present', () => {
    render(<MenuList menu={fixture} />);
    expect(screen.getByText('milk')).toBeInTheDocument();
  });
});
