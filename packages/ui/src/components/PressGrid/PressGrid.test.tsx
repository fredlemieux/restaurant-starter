import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PressGrid } from './PressGrid';

describe('PressGrid', () => {
  it('renders one card per item', () => {
    render(
      <PressGrid
        items={[
          { _id: 'a', publication: 'The Guardian', quote: 'Great.' },
          { _id: 'b', publication: 'Eater', quote: 'Fine.' },
        ]}
      />,
    );
    expect(screen.getByText('The Guardian')).toBeInTheDocument();
    expect(screen.getByText('Eater')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('renders the URL when provided', () => {
    render(
      <PressGrid
        items={[{ _id: 'a', publication: 'A', quote: 'B', url: 'https://example.com' }]}
      />,
    );
    expect(screen.getByRole('link', { name: /read article/i })).toHaveAttribute(
      'href',
      'https://example.com',
    );
  });
});
