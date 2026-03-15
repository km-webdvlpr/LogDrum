import { useEffect, useState, type FormEvent } from 'react';

interface AuthPanelProps {
  backendEnabled: boolean;
  userEmail: string | null;
  loading: boolean;
  onSignIn: (email: string) => Promise<{ error?: string; success?: string }>;
  onSignOut: () => Promise<void>;
}

export function AuthPanel({
  backendEnabled,
  userEmail,
  loading,
  onSignIn,
  onSignOut
}: AuthPanelProps) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => setMessage(null), 2600);
    return () => window.clearTimeout(timer);
  }, [message]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await onSignIn(email);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    setMessage(result.success ?? 'Check your inbox for the login link.');
    setEmail('');
  }

  return (
    <section className="panel px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="font-display text-3xl uppercase tracking-[0.18em] text-gold">Player Login</p>
          <p className="mt-2 text-sm leading-6 text-haze/70">
            Use email magic link login for synced progress, credits, and future analytics.
          </p>
        </div>

        {userEmail ? (
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <p className="rounded-full border border-gold/20 bg-gold/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-gold">
              {userEmail}
            </p>
            <button
              type="button"
              onClick={() => {
                void onSignOut();
              }}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-haze transition hover:border-gold/35 hover:bg-white/[0.08]"
            >
              Sign out
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex w-full max-w-xl flex-col gap-3 sm:flex-row">
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              disabled={!backendEnabled || loading}
              placeholder={backendEnabled ? 'Enter your email' : 'Add Supabase keys to enable auth'}
              className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-haze outline-none transition placeholder:text-haze/35 focus:border-gold/50"
            />
            <button
              type="submit"
              disabled={!backendEnabled || loading}
              className="rounded-2xl bg-gradient-to-r from-gold via-spice to-ember px-5 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Email Link
            </button>
          </form>
        )}
      </div>

      {message ? <p className="mt-3 text-sm text-spice">{message}</p> : null}
    </section>
  );
}
