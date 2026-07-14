import { useReducer, type FormEvent } from 'react';
import { Button } from '../Button/Button';
import { cn } from '../../lib/cn';

export interface ContactFormValues {
  name: string;
  email: string;
  partySize?: string;
  date?: string;
  message: string;
  turnstileToken?: string;
}

export interface ContactFormProps {
  action: string;
  turnstileSiteKey?: string;
  className?: string;
}

type State =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

type Action = { kind: 'submit' } | { kind: 'ok' } | { kind: 'fail'; message: string };

function reducer(_state: State, action: Action): State {
  if (action.kind === 'submit') return { kind: 'submitting' };
  if (action.kind === 'ok') return { kind: 'success' };
  return { kind: 'error', message: action.message };
}

export function ContactForm({ action, turnstileSiteKey, className }: ContactFormProps) {
  const [state, dispatch] = useReducer(reducer, { kind: 'idle' });

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    dispatch({ kind: 'submit' });
    try {
      await postContact(action, readForm(form));
      dispatch({ kind: 'ok' });
      form.reset();
    } catch (err) {
      dispatch({ kind: 'fail', message: err instanceof Error ? err.message : 'Something went wrong.' });
    }
  }

  if (state.kind === 'success') {
    return (
      <p role="status" className={cn('text-sage', className)}>
        Thanks — we’ll be in touch shortly.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('grid gap-4 max-w-lg', className)} noValidate>
      <Field name="name" label="Your name" required />
      <Field name="email" label="Email" type="email" required />
      <div className="grid grid-cols-2 gap-4">
        <Field name="partySize" label="Party size" type="number" min={1} max={40} />
        <Field name="date" label="Preferred date" type="date" />
      </div>
      <label className="grid gap-1">
        <span className="text-sm">Message</span>
        <textarea
          name="message"
          required
          rows={4}
          className="border border-ink/20 rounded-md px-3 py-2"
        />
      </label>
      {turnstileSiteKey ? (
        <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-size="flexible" />
      ) : null}
      {state.kind === 'error' ? (
        <p role="alert" className="text-sm text-red-700">{state.message}</p>
      ) : null}
      <Button type="submit" disabled={state.kind === 'submitting'}>
        {state.kind === 'submitting' ? 'Sending…' : 'Send'}
      </Button>
    </form>
  );
}

interface FieldProps {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
}

function Field({ name, label, type = 'text', required, min, max }: FieldProps) {
  return (
    <label className="grid gap-1">
      <span className="text-sm">
        {label}
        {required ? ' *' : ''}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        min={min}
        max={max}
        className="border border-ink/20 rounded-md px-3 py-2"
      />
    </label>
  );
}

async function postContact(url: string, values: ContactFormValues): Promise<void> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(values),
  });
  if (res.ok) return;
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  throw new Error(body.error ?? `Request failed (${res.status})`);
}

function readForm(form: HTMLFormElement): ContactFormValues {
  const data = new FormData(form);
  const get = (key: string): string | undefined => {
    const v = data.get(key);
    return v == null || v === '' ? undefined : String(v);
  };
  const values: ContactFormValues = {
    name: get('name') ?? '',
    email: get('email') ?? '',
    message: get('message') ?? '',
  };
  const partySize = get('partySize');
  if (partySize !== undefined) values.partySize = partySize;
  const date = get('date');
  if (date !== undefined) values.date = date;
  const turnstileToken = get('cf-turnstile-response');
  if (turnstileToken !== undefined) values.turnstileToken = turnstileToken;
  return values;
}
