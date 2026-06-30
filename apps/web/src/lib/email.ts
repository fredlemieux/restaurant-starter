import { Resend } from 'resend';

export interface ContactEmail {
  name: string;
  email: string;
  partySize?: string;
  date?: string;
  message: string;
}

export async function sendContactEmail(payload: ContactEmail): Promise<void> {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const to = import.meta.env.CONTACT_TO_ADDRESS;
  const from = import.meta.env.CONTACT_FROM_ADDRESS;

  if (!apiKey || !to || !from) {
    throw new Error('Email environment is not fully configured.');
  }

  const resend = new Resend(apiKey);
  const subject = `Website enquiry from ${payload.name}`;
  const text = renderText(payload);

  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: payload.email,
    subject,
    text,
  });

  if (error) throw new Error(error.message);
}

function renderText(p: ContactEmail): string {
  const lines = [
    `From:  ${p.name} <${p.email}>`,
    p.partySize ? `Party: ${p.partySize}` : '',
    p.date ? `Date:  ${p.date}` : '',
    '',
    p.message,
  ];
  return lines.filter(Boolean).join('\n');
}
