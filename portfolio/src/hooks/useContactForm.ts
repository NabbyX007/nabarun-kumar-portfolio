import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from 'react';
import type { ContactMessage, SendResult } from '@/lib/contact';

type Field = keyof ContactMessage;
type Errors = Partial<Record<Field, string>>;
export type FormStatus = 'idle' | 'sending' | 'sent' | 'drafted' | 'error';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const EMPTY: ContactMessage = { name: '', email: '', subject: '', message: '' };
const FIELDS: Field[] = ['name', 'email', 'subject', 'message'];

export function validate(values: ContactMessage): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = 'Enter your name.';
  if (!values.email.trim()) errors.email = 'Enter your email address.';
  else if (!EMAIL.test(values.email.trim())) errors.email = 'Enter an email address like name@company.com.';
  if (values.subject.trim().length < 3) errors.subject = 'Add a short subject.';
  if (values.message.trim().length < 20) errors.message = 'Write at least 20 characters so I know how I can help.';
  return errors;
}

/** Form state with validation on blur and submit, plus async sending states. */
export function useContactForm(send: (values: ContactMessage) => Promise<SendResult>) {
  const [values, setValues] = useState<ContactMessage>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<FormStatus>('idle');
  const [sendError, setSendError] = useState('');

  const errors = validate(values);
  const visibleErrors: Errors = Object.fromEntries(FIELDS.filter((k) => touched[k] && errors[k]).map((k) => [k, errors[k]]));

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setTouched((t) => ({ ...t, [e.target.name]: true }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === 'sending') return;
    const form = e.currentTarget;

    // Honeypot: real visitors never see or fill this field
    if ((form.elements.namedItem('company') as HTMLInputElement | null)?.value) return;

    setTouched({ name: true, email: true, subject: true, message: true });
    const first = FIELDS.find((k) => validate(values)[k]);
    if (first) {
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    setStatus('sending');
    setSendError('');
    const trimmed = Object.fromEntries(FIELDS.map((k) => [k, values[k].trim()])) as unknown as ContactMessage;
    const result = await send(trimmed);
    if (result.ok) {
      setStatus(result.via === 'endpoint' ? 'sent' : 'drafted');
    } else {
      setSendError(result.error);
      setStatus('error');
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setTouched({});
    setStatus('idle');
    setSendError('');
  };

  return { values, errors: visibleErrors, status, sendError, onChange, onBlur, onSubmit, reset };
}
