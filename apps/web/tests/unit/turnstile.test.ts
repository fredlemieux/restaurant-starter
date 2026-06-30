import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('verifyTurnstile', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('TURNSTILE_SECRET_KEY', 'secret');
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  it('returns ok when the secret key is unset', async () => {
    vi.stubEnv('TURNSTILE_SECRET_KEY', '');
    const { verifyTurnstile } = await import('../../src/lib/turnstile');
    const result = await verifyTurnstile('any');
    expect(result.ok).toBe(true);
  });

  it('returns ok when Cloudflare responds with success', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true }), { status: 200 }),
    );
    const { verifyTurnstile } = await import('../../src/lib/turnstile');
    const result = await verifyTurnstile('token');
    expect(result.ok).toBe(true);
  });

  it('returns error codes when Cloudflare rejects', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: false, 'error-codes': ['timeout'] }), { status: 200 }),
    );
    const { verifyTurnstile } = await import('../../src/lib/turnstile');
    const result = await verifyTurnstile('token');
    expect(result).toEqual({ ok: false, errorCodes: ['timeout'] });
  });
});
