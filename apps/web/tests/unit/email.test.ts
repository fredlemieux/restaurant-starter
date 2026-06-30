import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const sendMock = vi.fn();

class MockResend {
  emails = { send: sendMock };
}

vi.mock('resend', () => ({ Resend: MockResend }));

describe('sendContactEmail', () => {
  beforeEach(() => {
    vi.resetModules();
    sendMock.mockReset();
    vi.stubEnv('RESEND_API_KEY', 'rs_test');
    vi.stubEnv('CONTACT_TO_ADDRESS', 'hello@example.com');
    vi.stubEnv('CONTACT_FROM_ADDRESS', 'no-reply@example.com');
  });
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('throws when any env var is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    const { sendContactEmail } = await import('../../src/lib/email');
    await expect(
      sendContactEmail({ name: 'A', email: 'a@b.co', message: 'm' }),
    ).rejects.toThrow(/email environment is not fully configured/i);
  });

  it('sends to the configured recipient with reply-to as the sender', async () => {
    sendMock.mockResolvedValue({ data: { id: 'msg_1' }, error: null });
    const { sendContactEmail } = await import('../../src/lib/email');

    await sendContactEmail({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      partySize: '2',
      date: '2026-09-15',
      message: 'Anniversary dinner.',
    });

    expect(sendMock).toHaveBeenCalledOnce();
    const payload = sendMock.mock.calls[0]![0];
    expect(payload).toMatchObject({
      from: 'no-reply@example.com',
      to: ['hello@example.com'],
      replyTo: 'ada@example.com',
      subject: 'Website enquiry from Ada Lovelace',
    });
    expect(payload.text).toContain('Ada Lovelace');
    expect(payload.text).toContain('Party: 2');
    expect(payload.text).toContain('Anniversary dinner.');
  });

  it('surfaces the Resend error message on failure', async () => {
    sendMock.mockResolvedValue({ data: null, error: { message: 'API key revoked' } });
    const { sendContactEmail } = await import('../../src/lib/email');
    await expect(
      sendContactEmail({ name: 'a', email: 'a@b.co', message: 'm' }),
    ).rejects.toThrow('API key revoked');
  });

  it('omits empty optional lines from the rendered text body', async () => {
    sendMock.mockResolvedValue({ data: { id: '1' }, error: null });
    const { sendContactEmail } = await import('../../src/lib/email');
    await sendContactEmail({ name: 'A', email: 'a@b.co', message: 'just a hello' });
    const text = sendMock.mock.calls[0]![0].text as string;
    expect(text).not.toContain('Party:');
    expect(text).not.toContain('Date:');
  });
});
