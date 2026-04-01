interface ToastBannerProps {
  tone?: 'success' | 'error' | 'info'
  message: string
}

export function ToastBanner({ tone = 'info', message }: ToastBannerProps) {
  const cls =
    tone === 'success'
      ? 'border-gold/20 bg-gold/10 text-gold'
      : tone === 'error'
        ? 'border-ember/25 bg-ember/10 text-ember'
        : 'border-ink/10 bg-white/75 text-ink/75'

  return (
    <p className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${cls}`}>
      {message}
    </p>
  )
}
