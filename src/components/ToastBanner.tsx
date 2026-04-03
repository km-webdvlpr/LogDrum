interface ToastBannerProps {
  tone?: 'success' | 'error' | 'info'
  message: string
}

export function ToastBanner({ tone = 'info', message }: ToastBannerProps) {
  const cls =
    tone === 'success'
      ? 'border-gold/25 bg-[linear-gradient(135deg,rgba(183,142,30,0.18),rgba(255,255,255,0.68))] text-gold'
      : tone === 'error'
        ? 'border-ember/25 bg-[linear-gradient(135deg,rgba(15,106,72,0.16),rgba(255,255,255,0.68))] text-ember'
        : 'border-ink/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.84),rgba(248,242,227,0.84))] text-ink/75'

  return (
    <p className={`rounded-[22px] border px-4 py-3 text-sm leading-relaxed shadow-glow backdrop-blur-sm ${cls}`}>
      {message}
    </p>
  )
}
