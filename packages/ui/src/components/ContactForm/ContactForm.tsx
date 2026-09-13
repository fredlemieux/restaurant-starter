import { useEffect, useReducer, useRef, useState, type FormEvent } from 'react';
import { Button } from '../Button/Button';
import { cn } from '../../lib/cn';

// Minimal shape of window.turnstile — Cloudflare's Turnstile v0 API.
interface TurnstileAPI {
  render: (el: HTMLElement, options: { sitekey: string }) => string;
  remove?: (widgetId: string) => void;
  ready?: (callback: () => void) => void;
}
declare global {
  interface Window {
    turnstile?: TurnstileAPI;
  }
}

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

type FieldName = 'name' | 'email' | 'partySize' | 'date' | 'message';
type Values = Record<FieldName, string>;
type Touched = Partial<Record<FieldName, boolean>>;
type Errors = Partial<Record<FieldName, string>>;

const EMPTY_VALUES: Values = { name: '', email: '', partySize: '', date: '', message: '' };

// Mirrors the server-side Zod schema in apps/web/src/pages/api/contact.ts.
// Keep them in sync — the server is the source of truth, this is UX polish.
function validate(values: Values): Errors {
  const errors: Errors = {};

  if (!values.name.trim()) errors.name = 'Please tell us your name.';
  else if (values.name.length > 120) errors.name = 'Keep the name under 120 characters.';

  if (!values.email.trim()) errors.email = 'Email is required.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = 'Please enter a valid email.';
  else if (values.email.length > 254) errors.email = 'Email is too long.';

  if (values.partySize) {
    if (!/^\d{1,2}$/.test(values.partySize)) errors.partySize = 'Digits only.';
    else {
      const n = Number(values.partySize);
      if (n < 1 || n > 40) errors.partySize = 'Party size must be between 1 and 40.';
    }
  }

  if (values.date && !/^\d{4}-\d{2}-\d{2}$/.test(values.date))
    errors.date = 'Please pick a valid date.';

  if (!values.message.trim()) errors.message = 'Please include a short message.';
  else if (values.message.length > 4000) errors.message = 'Message is too long (4000 max).';

  return errors;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; message: string };

type StatusAction = { kind: 'submit' } | { kind: 'ok' } | { kind: 'fail'; message: string };

function statusReducer(_state: Status, action: StatusAction): Status {
  if (action.kind === 'submit') return { kind: 'submitting' };
  if (action.kind === 'ok') return { kind: 'success' };
  return { kind: 'error', message: action.message };
}

export function ContactForm({ action, turnstileSiteKey, className }: ContactFormProps) {
  const [status, dispatch] = useReducer(statusReducer, { kind: 'idle' });
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [touched, setTouched] = useState<Touched>({});
  const [turnstileError, setTurnstileError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);

  const errors = validate(values);
  const showError = (name: FieldName): string | undefined =>
    touched[name] ? errors[name] : undefined;

  // Explicit render — Turnstile's auto-scan on script load races React
  // hydration and the widget silently fails to appear (div stays 0px tall
  // with `window.turnstile` loaded but no iframe injected). Owning the render
  // call from a useEffect is deterministic. Contact.astro loads the script
  // with `?render=explicit` so auto-scan is disabled.
  //
  // Don't use `turnstile.ready()` — Cloudflare's own console warning says
  // it isn't safe to call before api.js has fully executed. Poll for
  // `turnstile.render` being a function instead; that's the reliable signal
  // that the API is warm.
  useEffect(() => {
    if (!turnstileSiteKey) return;
    const el = turnstileRef.current;
    if (!el) return;

    let widgetId: string | null = null;
    let cancelled = false;

    const tryRender = () => {
      if (cancelled || widgetId) return;
      if (typeof window.turnstile?.render === 'function') {
        widgetId = window.turnstile.render(el, { sitekey: turnstileSiteKey });
      } else {
        window.setTimeout(tryRender, 100);
      }
    };
    tryRender();

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile?.remove) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [turnstileSiteKey]);

  function updateValue(name: FieldName, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  function markTouched(name: FieldName) {
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    setTouched({ name: true, email: true, partySize: true, date: true, message: true });
    if (Object.keys(errors).length > 0) {
      focusFirstError(form, errors);
      return;
    }

    if (turnstileSiteKey) {
      const token = readTurnstileToken(form);
      if (!token) {
        setTurnstileError('Please complete the anti-spam check.');
        return;
      }
      setTurnstileError(null);
    }

    dispatch({ kind: 'submit' });
    try {
      await postContact(action, readForm(form, values));
      dispatch({ kind: 'ok' });
      form.reset();
      setValues(EMPTY_VALUES);
      setTouched({});
    } catch (err) {
      dispatch({
        kind: 'fail',
        message: err instanceof Error ? err.message : 'Something went wrong.',
      });
    }
  }

  if (status.kind === 'success') {
    return (
      <p role="status" className={cn('text-sage', className)}>
        Thanks — we’ll be in touch shortly.
      </p>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className={cn('grid max-w-lg gap-4', className)}
      noValidate
    >
      <Field
        name="name"
        label="Your name"
        required
        value={values.name}
        error={showError('name')}
        onChange={(v) => updateValue('name', v)}
        onBlur={() => markTouched('name')}
      />
      <Field
        name="email"
        label="Email"
        type="email"
        required
        value={values.email}
        error={showError('email')}
        onChange={(v) => updateValue('email', v)}
        onBlur={() => markTouched('email')}
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          name="partySize"
          label="Party size"
          type="number"
          min={1}
          max={40}
          value={values.partySize}
          error={showError('partySize')}
          onChange={(v) => updateValue('partySize', v)}
          onBlur={() => markTouched('partySize')}
        />
        <Field
          name="date"
          label="Preferred date"
          type="date"
          value={values.date}
          error={showError('date')}
          onChange={(v) => updateValue('date', v)}
          onBlur={() => markTouched('date')}
        />
      </div>
      <TextArea
        name="message"
        label="Message"
        required
        value={values.message}
        error={showError('message')}
        onChange={(v) => updateValue('message', v)}
        onBlur={() => markTouched('message')}
      />
      {turnstileSiteKey ? (
        <div>
          <div ref={turnstileRef} />
          {turnstileError ? (
            <p role="alert" className="mt-1 text-xs text-red-700">
              {turnstileError}
            </p>
          ) : null}
        </div>
      ) : null}
      {status.kind === 'error' ? (
        <p role="alert" className="text-sm text-red-700">
          {status.message}
        </p>
      ) : null}
      <Button type="submit" disabled={status.kind === 'submitting'}>
        {status.kind === 'submitting' ? 'Sending…' : 'Send'}
      </Button>
    </form>
  );
}

interface FieldProps {
  name: FieldName;
  label: string;
  type?: string;
  required?: boolean;
  min?: number;
  max?: number;
  value: string;
  error: string | undefined;
  onChange: (v: string) => void;
  onBlur: () => void;
}

function Field({
  name,
  label,
  type = 'text',
  required,
  min,
  max,
  value,
  error,
  onChange,
  onBlur,
}: FieldProps) {
  const errorId = error ? `${name}-error` : undefined;
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn('rounded-md border px-3 py-2', error ? 'border-red-600' : 'border-ink/20')}
      />
      {error ? (
        <span id={errorId} role="alert" className="text-xs text-red-700">
          {error}
        </span>
      ) : null}
    </label>
  );
}

interface TextAreaProps {
  name: FieldName;
  label: string;
  required?: boolean;
  value: string;
  error: string | undefined;
  onChange: (v: string) => void;
  onBlur: () => void;
}

function TextArea({ name, label, required, value, error, onChange, onBlur }: TextAreaProps) {
  const errorId = error ? `${name}-error` : undefined;
  return (
    <label className="grid gap-1">
      <span className="text-sm">
        {label}
        {required ? ' *' : ''}
      </span>
      <textarea
        name={name}
        required={required}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={cn('rounded-md border px-3 py-2', error ? 'border-red-600' : 'border-ink/20')}
      />
      {error ? (
        <span id={errorId} role="alert" className="text-xs text-red-700">
          {error}
        </span>
      ) : null}
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

function readForm(form: HTMLFormElement, values: Values): ContactFormValues {
  const payload: ContactFormValues = {
    name: values.name,
    email: values.email,
    message: values.message,
  };
  if (values.partySize) payload.partySize = values.partySize;
  if (values.date) payload.date = values.date;
  const token = readTurnstileToken(form);
  if (token) payload.turnstileToken = token;
  return payload;
}

function readTurnstileToken(form: HTMLFormElement): string | undefined {
  const data = new FormData(form);
  const v = data.get('cf-turnstile-response');
  return v == null || v === '' ? undefined : String(v);
}

function focusFirstError(form: HTMLFormElement, errors: Errors) {
  const order: FieldName[] = ['name', 'email', 'partySize', 'date', 'message'];
  for (const name of order) {
    if (!errors[name]) continue;
    const el = form.elements.namedItem(name);
    if (el instanceof HTMLElement) {
      el.focus();
      return;
    }
  }
}
