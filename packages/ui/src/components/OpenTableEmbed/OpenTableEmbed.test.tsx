import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OpenTableEmbed } from './OpenTableEmbed';

describe('OpenTableEmbed', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('renders a mount container with accessible label', () => {
    render(<OpenTableEmbed rid="111" />);
    expect(screen.getByTestId('opentable-embed')).toHaveAttribute(
      'aria-label',
      'Reserve a table via OpenTable',
    );
  });

  it('injects an opentable.co.uk loader script', () => {
    render(<OpenTableEmbed rid="999" />);
    const script = screen
      .getByTestId('opentable-embed')
      .querySelector('script') as HTMLScriptElement | null;
    expect(script).not.toBeNull();
    expect(script!.src).toContain('opentable.co.uk/widget/reservation/loader');
    expect(script!.src).toContain('rid=999');
  });

  it('uses the .com domain when configured', () => {
    render(<OpenTableEmbed rid="111" domain="com" />);
    const script = screen
      .getByTestId('opentable-embed')
      .querySelector('script') as HTMLScriptElement;
    expect(script.src).toContain('opentable.com');
  });
});
