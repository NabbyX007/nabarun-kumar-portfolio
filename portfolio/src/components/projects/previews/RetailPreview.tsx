import { motion } from 'framer-motion';
import { Lock, LogOut, ShoppingBag, TrendingUp } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { PreviewFrame, type PreviewProps } from './PreviewFrame';
import { easeOutExpo } from '@/lib/motion';

const spark = [12, 18, 14, 22, 19, 27, 24, 31, 29, 36];

function Sparkline() {
  const max = Math.max(...spark);
  const points = spark.map((v, i) => `${(i / (spark.length - 1)) * 100},${30 - (v / max) * 26}`).join(' ');
  return (
    <svg viewBox="0 0 100 32" className="h-8 w-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="retail-spark" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#5b8cff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#5b8cff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,32 ${points} 100,32`} fill="url(#retail-spark)" />
      <polyline points={points} fill="none" stroke="#8fb0ff" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function RetailPreview({ interactive = false, className }: PreviewProps) {
  const [signedIn, setSignedIn] = useState(!interactive);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('demo@retail.example');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading) return;
    const t = window.setTimeout(() => {
      setLoading(false);
      setSignedIn(true);
    }, 800);
    return () => window.clearTimeout(t);
  }, [loading]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.');
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    setError('');
    setLoading(true);
  };

  return (
    <PreviewFrame title="Commerce dashboard" interactive={interactive} className={className}>
      {!signedIn ? (
        <form onSubmit={submit} noValidate className="mx-auto flex h-full max-w-[15rem] flex-col justify-center gap-2 p-3">
          <span className="mx-auto grid h-8 w-8 place-items-center rounded-lg bg-signal/15 text-signal-soft">
            <Lock size={14} aria-hidden="true" />
          </span>
          <p className="text-center font-display text-sm font-semibold text-fg">Sign in</p>
          <label className="text-[0.65rem] text-muted">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-0.5 w-full rounded-md border border-white/[0.08] bg-ink-800 px-2 py-1 text-[0.72rem] text-fg outline-none focus:border-signal/60"
            />
          </label>
          <label className="text-[0.65rem] text-muted">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-0.5 w-full rounded-md border border-white/[0.08] bg-ink-800 px-2 py-1 text-[0.72rem] text-fg outline-none focus:border-signal/60"
            />
          </label>
          {error && (
            <p className="text-[0.65rem] text-danger" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 rounded-md bg-[linear-gradient(110deg,#4a7bff,#7a68ff)] py-1.5 text-[0.72rem] font-medium text-white disabled:opacity-70"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      ) : (
        <div className="flex h-full flex-col gap-2 p-3">
          <div className="flex items-center justify-between">
            <p className="text-[0.72rem] text-fg-soft">Welcome back</p>
            {interactive && (
              <button
                type="button"
                onClick={() => setSignedIn(false)}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[0.65rem] text-muted hover:bg-white/[0.05] hover:text-fg"
              >
                <LogOut size={11} aria-hidden="true" /> Sign out
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Orders today', value: '1,284', icon: ShoppingBag },
              { label: 'Conversion', value: '3.4%', icon: TrendingUp },
            ].map(({ label, value, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={interactive ? { opacity: 0, y: 8 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: easeOutExpo }}
                className="rounded-xl border border-white/[0.06] bg-ink-800/80 p-2"
              >
                <Icon size={13} aria-hidden="true" className="text-signal-soft" />
                <p className="mt-1 font-display text-base font-semibold text-fg">{value}</p>
                <p className="text-[0.62rem] text-muted">{label}</p>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={interactive ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16, ease: easeOutExpo }}
            className="rounded-xl border border-white/[0.06] bg-ink-800/80 p-2"
          >
            <p className="text-[0.62rem] text-muted">Revenue, last 10 days</p>
            <Sparkline />
          </motion.div>
        </div>
      )}
    </PreviewFrame>
  );
}
