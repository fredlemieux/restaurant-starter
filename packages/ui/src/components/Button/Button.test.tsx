import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Reserve</Button>);
    expect(screen.getByRole('button', { name: 'Reserve' })).toBeInTheDocument();
  });

  it('fires onClick when activated', async () => {
    const handle = vi.fn();
    render(<Button onClick={handle}>Reserve</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handle).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const handle = vi.fn();
    render(
      <Button onClick={handle} disabled>
        Reserve
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(handle).not.toHaveBeenCalled();
  });

  it('forwards additional className', () => {
    render(<Button className="extra-class">x</Button>);
    expect(screen.getByRole('button')).toHaveClass('extra-class');
  });
});
