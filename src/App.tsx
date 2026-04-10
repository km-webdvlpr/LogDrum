import { useEffect, useMemo, useState } from 'react'
import artistsData from './data/artists.json'
import songsData from './data/songs.json'
import { ArtistInputPanel } from './components/ArtistInputPanel'
import { CluePanel } from './components/CluePanel'
import { HowToPlayPanel } from './components/HowToPlayPanel'
import { MoveRevealCard } from './components/MoveRevealCard'
import { PathTrail } from './components/PathTrail'
import { ResultScreen } from './components/ResultScreen'
import { StatusRail } from './components/StatusRail'
import { TickerStrip } from './components/TickerStrip'
import { getCopy, type Locale } from './content/copy'
import { getDailyChallenge, getSADateKey } from './engine/challenge'
import { buildGraph } from './engine/graph'
import { calculateFinalScore } from './engine/scoring'
import { loadHistory } from './store/history'
import { useGame } from './store/useGame'
import type { Artist, Challenge, HistoryEntry, Song } from './types/wela'

const artists = artistsData as Artist[]
const songs = songsData as Song[]
const LOCALE_STORAGE_KEY = 'wela-locale'

function useSADate() {
  const [dateKey, setDateKey] = useState(getSADateKey)

  useEffect(() => {
    const id = setInterval(() => {
      const next = getSADateKey()
      setDateKey((prev) => (prev !== next ? next : prev))
    }, 60_000)

    return () => clearInterval(id)
  }, [])

  return dateKey
}

export default function App() {
  const graph = useMemo(() => buildGraph(artists, songs), [])
  const dateKey = useSADate()
  const [locale, setLocale] = useState<Locale>(getStoredLocale)
  const [showRules, setShowRules] = useState(false)
  const copy = useMemo(() => getCopy(locale), [locale])

  useEffect(() => {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    document.documentElement.lang = locale
  }, [locale])

  const challenge = useMemo<Challenge>(() => getDailyChallenge(graph, artists, dateKey), [graph, dateKey])
  const historyEntries = useMemo(
    () => loadHistory(),
    [dateKey, challenge.id]
  )

  const savedDailyEntry = useMemo(() => {
    const entry = historyEntries.find((item) => item.date === challenge.date)
    if (!entry) return null

    const isSameChallenge =
      entry.startId === challenge.startId &&
      entry.destinationId === challenge.destinationId &&
      entry.date === challenge.date

    return isSameChallenge ? entry : null
  }, [historyEntries, challenge])

  const { state, submitArtist, revealClue, reset } = useGame(graph, artists, challenge, savedDailyEntry)

  const startArtist = artists.find((artist) => artist.id === challenge.startId)!
  const destinationArtist = artists.find((artist) => artist.id === challenge.destinationId)!
  const breakdown = calculateFinalScore({
    challenge,
    liveScore: state.score,
    timerRemaining: state.timerRemaining,
    stepsTaken: state.path.length,
    paidClueIds: state.paidClueIds,
    livesRemaining: state.livesRemaining,
    solved: state.status === 'solved',
  })
  if (state.finalScore != null) {
    breakdown.finalScore = state.finalScore
  }

  const streak = useMemo(() => getSolvedStreak(historyEntries), [historyEntries])
  const difficultyLabel = resolveDifficultyLabel(copy, challenge.difficulty)
  const statusLabel =
    state.status === 'solved'
      ? copy.cabinet.solved
      : state.status === 'failed'
        ? copy.cabinet.failed
        : copy.cabinet.active

  return (
    <div className="min-h-screen bg-[#0A0E09] text-[#F0EAD0]">
      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-5 lg:px-6">
        <header className="rounded-[4px] border border-[#8A6510] bg-[#0F1A0D] px-4 py-4 shadow-[0_0_0_1px_rgba(245,200,66,0.06)]">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-score text-4xl tracking-[0.2em] text-[#F5C842] sm:text-5xl">WELA</span>
                <span className="rounded-[3px] border border-[#1C3018] bg-[#0A0E09] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#2EFF7A]">
                  {copy.cabinet.footerDaily}
                </span>
                <span className="rounded-[3px] border border-[#8A6510] bg-[#1A1408] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#F5C842]">
                  {statusLabel}
                </span>
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#A89E80]">
                {copy.header.routePromise}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <LocaleButton label="EN" active={locale === 'en'} onClick={() => setLocale('en')} />
              <LocaleButton label="ZU" active={locale === 'zu'} onClick={() => setLocale('zu')} />
              <LocaleButton label="XH" active={locale === 'xh'} onClick={() => setLocale('xh')} />
              <button
                onClick={() => setShowRules((current) => !current)}
                className="rounded-[3px] border border-[#1C3018] bg-[#0A0E09] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#A89E80] transition-colors hover:border-[#8A6510] hover:text-[#F5C842]"
              >
                {copy.header.rules}
              </button>
            </div>
          </div>
        </header>

        <div className="mt-3">
          <TickerStrip
            date={challenge.date}
            par={challenge.par}
            timerSeconds={challenge.timerSeconds}
            difficultyLabel={difficultyLabel}
            copy={copy}
          />
        </div>

        <main className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
          <section className="space-y-4">
            <section className="rounded-[4px] border border-[#8A6510] bg-[#0F1A0D] px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#F5C842]">
                    {copy.cabinet.challengePanel}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#A89E80]">
                    {copy.header.connectionPrompt}
                  </p>
                </div>

                <div className="rounded-[3px] border border-[#1C3018] bg-[#0A0E09] px-3 py-2 text-right">
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#A89E80]">
                    {copy.status.difficulty}
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.18em] text-[#2EFF7A]">
                    {difficultyLabel}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_1fr]">
                <CabinetNode label={copy.header.start} value={startArtist.name} tone="start" />
                <div className="flex items-center justify-center">
                  <span className="rounded-[3px] border border-[#1C3018] bg-[#0A0E09] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[#A89E80]">
                    VS
                  </span>
                </div>
                <CabinetNode label={copy.header.target} value={destinationArtist.name} tone="target" />
              </div>
            </section>

            <section className="rounded-[4px] border border-[#1C3018] bg-[#0F1A0D] px-4 py-4">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#F5C842]">
                {copy.cabinet.routePanel}
              </p>
              <PathTrail
                startId={challenge.startId}
                path={state.path}
                artists={artists}
                currentId={state.currentId}
              />
            </section>

            {(showRules || (state.status === 'playing' && state.path.length === 0)) && (
              <HowToPlayPanel copy={copy} />
            )}

            {state.status === 'playing' ? (
              <>
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                  <ArtistInputPanel
                    currentArtist={artistName(artists, state.currentId)}
                    targetArtist={destinationArtist.name}
                    disabled={state.status !== 'playing'}
                    copy={copy}
                    onSubmit={submitArtist}
                  />
                  <CluePanel
                    clues={challenge.clues}
                    revealedClueIds={state.revealedClueIds}
                    onReveal={revealClue}
                    copy={copy}
                  />
                </div>

                <MoveRevealCard
                  artists={artists}
                  copy={copy}
                  step={state.lastMove}
                  feedback={state.feedback}
                />
              </>
            ) : (
              <ResultScreen
                challenge={challenge}
                path={state.path}
                artists={artists}
                breakdown={breakdown}
                status={state.status}
                resultReason={state.resultReason}
                solvedFromHistory={Boolean(savedDailyEntry)}
                copy={copy}
                onReset={reset}
              />
            )}

          </section>

          <StatusRail
            score={state.score}
            finalScore={state.finalScore}
            timerRemaining={state.timerRemaining}
            livesRemaining={state.livesRemaining}
            stepsTaken={state.path.length}
            par={challenge.par}
            difficultyLabel={difficultyLabel}
            copy={copy}
          />
        </main>

        <footer className="mt-4 rounded-[4px] border border-[#1C3018] bg-[#0F1A0D] px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#A89E80]">
            <span>{copy.cabinet.footerInsertCoin}</span>
            <span>{challenge.date}</span>
            <span>{`STREAK ${streak}`}</span>
          </div>
        </footer>
      </div>
    </div>
  )
}

function LocaleButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'rounded-[3px] border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors',
        active
          ? 'border-[#8A6510] bg-[#1A1408] text-[#F5C842]'
          : 'border-[#1C3018] bg-[#0A0E09] text-[#A89E80] hover:border-[#8A6510] hover:text-[#F5C842]',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

function CabinetNode({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'start' | 'target'
}) {
  return (
    <div
      className={[
        'rounded-[4px] border px-4 py-4',
        tone === 'start'
          ? 'border-[#004D24] bg-[#0A0E09]'
          : 'border-[#8A6510] bg-[#0A0E09]',
      ].join(' ')}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#A89E80]">{label}</p>
      <p
        className={[
          'mt-3 font-title text-xl leading-tight sm:text-2xl',
          tone === 'start' ? 'text-[#2EFF7A]' : 'text-[#F5C842]',
        ].join(' ')}
      >
        {value}
      </p>
    </div>
  )
}

function resolveDifficultyLabel(copy: ReturnType<typeof getCopy>, difficulty: Challenge['difficulty']) {
  if (difficulty === 'groove') return copy.status.groove
  if (difficulty === 'deep-cuts') return copy.status.deepCuts
  return copy.status.amapiano
}

function getSolvedStreak(entries: HistoryEntry[]): number {
  const solvedDates = Array.from(
    new Set(
      entries
        .filter((entry) => entry.status === 'solved')
        .map((entry) => entry.date)
        .sort((a, b) => b.localeCompare(a))
    )
  )

  if (solvedDates.length === 0) return 0

  let streak = 0
  let cursor = getSADateKey()

  while (solvedDates.includes(cursor)) {
    streak += 1
    cursor = previousDate(cursor)
  }

  return streak
}

function previousDate(dateKey: string): string {
  const date = new Date(`${dateKey}T00:00:00+02:00`)
  date.setDate(date.getDate() - 1)
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Johannesburg',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

function artistName(list: Artist[], id: string): string {
  return list.find((artist) => artist.id === id)?.name ?? id
}

function getStoredLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY)
  return saved === 'zu' || saved === 'xh' ? saved : 'en'
}
