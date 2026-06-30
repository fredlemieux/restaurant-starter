import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the restaurant name as an h1', () => {
    render(<Hero name="Jamavar" />);
    expect(screen.getByRole('heading', { level: 1, name: 'Jamavar' })).toBeInTheDocument();
  });

  it('renders the tagline when provided', () => {
    render(<Hero name="Jamavar" tagline="Regional Indian cooking." />);
    expect(screen.getByText('Regional Indian cooking.')).toBeInTheDocument();
  });

  it('renders the hero image with given alt text', () => {
    render(<Hero name="x" imageUrl="https://example.com/h.jpg" imageAlt="Dining room" />);
    expect(screen.getByAltText('Dining room')).toHaveAttribute('src', 'https://example.com/h.jpg');
  });

  it('renders the CTA slot', () => {
    render(<Hero name="x" cta={<button>Reserve</button>} />);
    expect(screen.getByRole('button', { name: 'Reserve' })).toBeInTheDocument();
  });
});
