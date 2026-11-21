import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Check, Copy, Download, Loader2, Mail, MapPin, Send } from 'lucide-react';
import type { ChangeEvent, FocusEvent, MouseEvent, ReactNode } from 'react';
import { Section } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Magnetic } from '@/components/ui/Magnetic';
import { LinkedInIcon, GitHubIcon } from '@/components/ui/BrandIcons';
import { profile } from '@/data/profile';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useContactForm } from '@/hooks/useContactForm';
import { buildMailto, hasContactEndpoint, sendContactMessage, type ContactMessage } from '@/lib/contact';
import { downloadResume, interceptResumeDownload } from '@/lib/resume-download';
import { cn } from '@/lib/cn';

const inputBase =
  'mt-2 w-full rounded-control border bg-ink-900/60 px-4 py-3 text-fg placeholder:text-faint outline-none transition-[border-color,box-shadow] duration-300 focus:border-signal/60 focus:shadow-[0_0_0_4px_rgb(91_140_255/0.15)] disabled:opacity-60';

const socialLink =
  'glass inline-flex h-12 items-center gap-3 rounded-control px-4 text-fg-soft transition-[border-color,color,transform] duration-300 hover:-translate-y-0.5 hover:border-signal/40 hover:text-fg';

function FieldError({ id, message }: { id: string; message?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          key={message}
          id={id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-1.5 text-sm text-danger"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

interface FieldProps {
  name: keyof ContactMessage;
  label: string;
  value: string;
  error?: string;
  disabled: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  autoComplete?: string;
  placeholder: string;
  multiline?: boolean;
  hint?: string;
}

function Field({ name, label, value, error, disabled, onChange, onBlur, type = 'text', autoComplete, placeholder, multiline, hint }: FieldProps) {
  const id = `cf-${name}`;
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  const shared = {
    id,
    name,
    value,
    onChange,
    onBlur,
    disabled,
    placeholder,
    required: true,
    'aria-invalid': !!error,
    'aria-describedby': describedBy,
  };
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-fg-soft">
        {label}
      </label>
      {multiline ? (
        <textarea {...shared} rows={6} className={cn(inputBase, 'resize-y', error ? 'border-danger/60' : 'border-white/10')} />
      ) : (
        <input
          {...shared}
          type={type}
          autoComplete={autoComplete}
          inputMode={type === 'email' ? 'email' : undefined}
          className={cn(inputBase, error ? 'border-danger/60' : 'border-white/10')}
        />
      )}
      {error ? (
        <FieldError id={`${id}-error`} message={error} />
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-sm text-faint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

function ResultPanel({ tone, title, children, action }: { tone: 'success' | 'info'; title: string; children: ReactNode; action: ReactNode }) {
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex min-h-[30rem] flex-col items-start justify-center"
    >
      <span
        className={cn(
          'grid h-12 w-12 place-items-center rounded-panel',
          tone === 'success' ? 'bg-success/15 text-success' : 'bg-signal/15 text-signal-soft',
        )}
      >
        {tone === 'success' ? <Check size={22} aria-hidden="true" /> : <Mail size={22} aria-hidden="true" />}
      </span>
      <h3 className="mt-5 text-2xl font-semibold text-fg">{title}</h3>
      <div className="mt-3 max-w-sm leading-relaxed text-muted">{children}</div>
      <div className="mt-6">{action}</div>
    </motion.div>
  );
}

export function Contact() {
  const { copied, copy } = useCopyToClipboard();
  const form = useContactForm(sendContactMessage);
  const sending = form.status === 'sending';

  const onResume = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!interceptResumeDownload) return;
    e.preventDefault();
    void downloadResume();
  };

  return (
    <Section id="contact" labelledBy="contact-title" className="pb-28">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-1/3 -z-10 mx-auto h-[28rem] max-w-4xl rounded-full bg-[radial-gradient(closest-side,rgb(91_140_255/0.14),transparent)] blur-2xl" />
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <div>
          <Reveal blur>
            <p className="eyebrow mb-5 flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[linear-gradient(90deg,transparent,var(--color-signal-soft))]" />
              06 · Contact
            </p>
            <h2 id="contact-title" className="text-[2.4rem] leading-[1.02] font-semibold tracking-[-0.04em] text-fg sm:text-6xl">
              Let’s Build <span className="text-gradient-animated">Something Meaningful.</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
              I’m always interested in discussing challenging frontend problems, innovative products, and opportunities to build
              impactful digital experiences.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="mt-10">
            <p className="eyebrow text-faint">Email</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.15}>
                <a
                  href={`mailto:${profile.email}`}
                  className="group relative inline-flex max-w-full overflow-hidden rounded-panel p-px shadow-[0_12px_40px_-16px_rgb(91_140_255/0.6)]"
                >
                  <span
                    aria-hidden="true"
                    className="animate-spin-slow absolute -inset-[120%] bg-[conic-gradient(from_0deg,transparent_0deg,#5b8cff_90deg,#9a7bff_160deg,transparent_240deg)] opacity-80"
                  />
                  <span className="relative truncate rounded-[15px] bg-ink-850 px-5 py-3.5 font-display text-lg font-medium text-fg transition-colors group-hover:bg-ink-800 sm:text-xl">
                    {profile.email}
                  </span>
                </a>
              </Magnetic>
              <button
                type="button"
                onClick={() => copy(profile.email)}
                className={cn(
                  'inline-flex h-12 items-center gap-2 rounded-control border px-4 text-sm transition-colors duration-300',
                  copied ? 'border-success/40 bg-success/10 text-success' : 'border-white/10 text-fg-soft hover:border-signal/40 hover:text-fg',
                )}
              >
                <AnimatePresence initial={false} mode="wait">
                  <motion.span
                    key={copied ? 'done' : 'copy'}
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex"
                  >
                    {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                  </motion.span>
                </AnimatePresence>
                {copied ? 'Copied' : 'Copy email'}
              </button>
              <span className="sr-only" role="status" aria-live="polite">
                {copied ? 'Email address copied to clipboard' : ''}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="mt-10 flex flex-wrap items-center gap-3">
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className={socialLink}>
              <LinkedInIcon className="h-4 w-4" />
              LinkedIn
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            {/* GitHub appears once profile.github is set in src/data/profile.ts */}
            {profile.github && (
              <a href={profile.github} target="_blank" rel="noreferrer" className={socialLink}>
                <GitHubIcon className="h-4 w-4" />
                GitHub
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            )}
            <ButtonLink
              variant="secondary"
              href={profile.resumeUrl}
              download={profile.resumeFileName}
              onClick={onResume}
              icon={<Download size={17} aria-hidden="true" />}
              iconPosition="start"
              className="h-12"
            >
              Download resume
            </ButtonLink>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 inline-flex items-center gap-2 text-muted">
              <MapPin size={16} aria-hidden="true" />
              {profile.location}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="glass relative overflow-hidden rounded-card p-6 sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(143_176_255/0.6),transparent)]" />
            {form.status === 'sent' ? (
              <ResultPanel
                tone="success"
                title="Message sent"
                action={
                  <Button variant="secondary" onClick={form.reset}>
                    Write another message
                  </Button>
                }
              >
                <p>Thanks for reaching out. I’ll reply to {form.values.email} as soon as I can.</p>
              </ResultPanel>
            ) : form.status === 'drafted' ? (
              <ResultPanel
                tone="info"
                title="Your email app should be open"
                action={
                  <Button variant="secondary" onClick={form.reset}>
                    Write another message
                  </Button>
                }
              >
                <p>
                  The message has been filled in for you. Press send there to deliver it. If nothing opened,{' '}
                  <a href={buildMailto(form.values)} className="text-signal-soft underline underline-offset-4 hover:text-fg">
                    try the email link again
                  </a>{' '}
                  or write to {profile.email}.
                </p>
              </ResultPanel>
            ) : (
              <form onSubmit={form.onSubmit} noValidate aria-labelledby="cf-title" aria-busy={sending}>
                <h3 id="cf-title" className="text-xl font-semibold text-fg">
                  Send a message
                </h3>
                {/* Honeypot for bots: hidden from people and assistive tech */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor="cf-company">Company</label>
                  <input id="cf-company" name="company" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field name="name" label="Name" value={form.values.name} error={form.errors.name} disabled={sending} onChange={form.onChange} onBlur={form.onBlur} autoComplete="name" placeholder="Your name" />
                  <Field name="email" label="Email" type="email" value={form.values.email} error={form.errors.email} disabled={sending} onChange={form.onChange} onBlur={form.onBlur} autoComplete="email" placeholder="name@company.com" />
                </div>
                <div className="mt-5">
                  <Field name="subject" label="Subject" value={form.values.subject} error={form.errors.subject} disabled={sending} onChange={form.onChange} onBlur={form.onBlur} placeholder="Frontend role, project, question…" />
                </div>
                <div className="mt-5">
                  <Field
                    name="message"
                    label="Message"
                    multiline
                    value={form.values.message}
                    error={form.errors.message}
                    disabled={sending}
                    onChange={form.onChange}
                    onBlur={form.onBlur}
                    placeholder="Tell me about the role or project"
                    hint={hasContactEndpoint ? undefined : 'Sending opens your email app with this message filled in.'}
                  />
                </div>

                <AnimatePresence>
                  {form.status === 'error' && (
                    <motion.div
                      role="alert"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 flex gap-3 rounded-control border border-danger/30 bg-danger/[0.07] p-4 text-sm">
                        <AlertCircle size={18} aria-hidden="true" className="mt-px shrink-0 text-danger" />
                        <p className="text-fg-soft">
                          {form.sendError} Please try again, or{' '}
                          <a href={buildMailto(form.values)} className="text-signal-soft underline underline-offset-4 hover:text-fg">
                            send it by email instead
                          </a>
                          .
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  type="submit"
                  size="lg"
                  disabled={sending}
                  className="mt-6 w-full sm:w-auto"
                  icon={sending ? <Loader2 size={17} aria-hidden="true" className="animate-spin" /> : <Send size={17} aria-hidden="true" />}
                >
                  {sending ? 'Sending…' : 'Send message'}
                </Button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
