const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export interface TurnstileResult {
  ok: boolean;
  errorCodes?: string[];
}

export async function verifyTurnstile(token: string, remoteIp?: string): Promise<TurnstileResult> {
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secret) return { ok: true };

  const body = new URLSearchParams({ secret, response: token });
  if (remoteIp) body.set('remoteip', remoteIp);

  const res = await fetch(VERIFY_URL, { method: 'POST', body });
  if (!res.ok) return { ok: false, errorCodes: [`http-${res.status}`] };

  const json = (await res.json()) as { success: boolean; 'error-codes'?: string[] };
  return json.success
    ? { ok: true }
    : { ok: false, errorCodes: json['error-codes'] ?? ['unknown'] };
}
