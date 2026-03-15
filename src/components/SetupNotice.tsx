interface SetupNoticeProps {
  backendEnabled: boolean;
}

export function SetupNotice({ backendEnabled }: SetupNoticeProps) {
  if (backendEnabled) {
    return null;
  }

  return (
    <section className="panel border-ember/25 bg-ember/10 px-5 py-4 sm:px-6">
      <p className="font-display text-2xl uppercase tracking-[0.16em] text-spice">Backend Setup Needed</p>
      <p className="mt-2 text-sm leading-6 text-haze/75">
        Supabase env keys are not set yet, so the app is running in local gameplay mode. Add
        `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to activate real auth, DB-backed daily
        challenges, and the admin dashboard.
      </p>
    </section>
  );
}
