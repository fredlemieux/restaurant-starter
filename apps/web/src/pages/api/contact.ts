import type { APIRoute } from 'astro';
import { z } from 'zod';
import { sendContactEmail } from '@/lib/email';
import { verifyTurnstile } from '@/lib/turnstile';

export const prerender = false;

const ContactSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.email().max(254),
  partySize: z.string().regex(/^\d{1,2}$/).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  message: z.string().min(1).max(4000),
  turnstileToken: z.string().optional(),
});

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON.' }, 400);
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return json({ error: 'Validation failed.', issues: parsed.error.issues }, 422);
  }

  const data = parsed.data;

  if (data.turnstileToken) {
    const verification = await verifyTurnstile(data.turnstileToken, clientAddress);
    if (!verification.ok) {
      return json({ error: 'Anti-spam check failed.' }, 403);
    }
  }

  try {
    await sendContactEmail(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Send failed.';
    return json({ error: message }, 502);
  }

  return json({ ok: true }, 200);
};

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
