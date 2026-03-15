interface StatPillProps {
  label: string;
  value: string | number;
}

export function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="rounded-[24px] border border-white/8 bg-white/[0.04] px-4 py-3">
      <p className="text-xs uppercase tracking-[0.28em] text-haze/45">{label}</p>
      <p className="mt-2 font-display text-3xl uppercase tracking-[0.08em] text-haze">{value}</p>
    </div>
  );
}
