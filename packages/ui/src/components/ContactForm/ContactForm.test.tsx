import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from './ContactForm';

describe('ContactForm', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
  });
  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  async function fillAndSubmit() {
    await userEvent.type(screen.getByLabelText(/your name/i), 'Ada Lovelace');
    await userEvent.type(screen.getByLabelText(/email/i), 'ada@example.com');
    await userEvent.type(screen.getByLabelText(/message/i), 'Table for two please.');
    await userEvent.click(screen.getByRole('button', { name: /send/i }));
  }

  it('POSTs collected values as JSON to the configured action', async () => {
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    render(<ContactForm action="/api/contact" />);
    await fillAndSubmit();

    const [url, init] = (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls[0]!;
    expect(url).toBe('/api/contact');
    expect((init as RequestInit).method).toBe('POST');
    expect(JSON.parse((init as RequestInit).body as string)).toMatchObject({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      message: 'Table for two please.',
    });
  });

  it('renders a success message on 2xx', async () => {
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 }),
    );
    render(<ContactForm action="/api/contact" />);
    await fillAndSubmit();
    expect(await screen.findByRole('status')).toHaveTextContent(/be in touch/i);
  });

  it('renders the server error message on non-2xx', async () => {
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response(JSON.stringify({ error: 'Bookings closed for maintenance' }), { status: 503 }),
    );
    render(<ContactForm action="/api/contact" />);
    await fillAndSubmit();
    expect(await screen.findByRole('alert')).toHaveTextContent('Bookings closed for maintenance');
  });

  it('renders a generic error message when the server body has no `error`', async () => {
    (globalThis.fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      new Response('boom', { status: 500 }),
    );
    render(<ContactForm action="/api/contact" />);
    await fillAndSubmit();
    expect(await screen.findByRole('alert')).toHaveTextContent(/request failed \(500\)/i);
  });
});
