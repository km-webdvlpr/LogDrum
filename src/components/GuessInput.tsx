import { useEffect, useMemo, useState, type FormEvent } from 'react';

interface GuessInputProps {
  titles: string[];
  disabled: boolean;
  onSubmit: (guess: string) => Promise<{ accepted: boolean; message?: string }>;
}

export function GuessInput({ titles, disabled, onSubmit }: GuessInputProps) {
  const [value, setValue] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const suggestions = useMemo(() => {
    if (!value.trim()) {
      return titles.slice(0, 6);
    }

    return titles
      .filter((title) => title.toLowerCase().includes(value.trim().toLowerCase()))
      .slice(0, 6);
  }, [titles, value]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = window.setTimeout(() => setMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [message]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = await onSubmit(value);

    if (result.accepted) {
      setValue('');
      setMessage(null);
      return;
    }

    setMessage(result.message ?? 'Guess not accepted.');
  }

  return (
    <div className="rounded-[28px] border border-white/8 bg-black/30 p-4 sm:p-5">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label className="block">
          <span className="mb-2 block text-xs uppercase tracking-[0.28em] text-haze/50">Drop your guess</span>
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={disabled}
            placeholder={disabled ? 'Today is complete' : 'Type a song title'}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-base text-haze outline-none transition placeholder:text-haze/35 focus:border-gold/50 focus:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>

        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-2xl bg-gradient-to-r from-gold via-spice to-ember px-4 py-3 font-semibold uppercase tracking-[0.2em] text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Lock In Guess
        </button>
      </form>

      {message ? <p className="mt-3 text-sm text-spice">{message}</p> : null}

      <div className="mt-4">
        <p className="mb-2 text-xs uppercase tracking-[0.28em] text-haze/45">Autocomplete crate</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((title) => (
            <button
              key={title}
              type="button"
              onClick={() => setValue(title)}
              disabled={disabled}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-haze/75 transition hover:border-gold/40 hover:text-haze disabled:cursor-not-allowed disabled:opacity-50"
            >
              {title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
