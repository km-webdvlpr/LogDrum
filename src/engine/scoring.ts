import type { Challenge, ScoreBreakdown } from '../types/wela'

export const BASE_SCORE = 10_000
export const LIFE_PENALTY = 400
export const PURE_RUN_BONUS = 500
export const PAR_STEP_BONUS = 200

export function getTimeMultiplier(timerRemaining: number, timerSeconds: number): number {
  if (timerSeconds <= 0) return 0.5

  const remainingRatio = Math.max(0, Math.min(1, timerRemaining / timerSeconds))
  return roundToTwo(0.5 + remainingRatio)
}

export function getParBonus(stepsTaken: number, par: number): number {
  return Math.max(0, (par - stepsTaken) * PAR_STEP_BONUS)
}

export function getPureRunBonus(paidClueIds: number[], solved: boolean): number {
  return solved && paidClueIds.length === 0 ? PURE_RUN_BONUS : 0
}

export function calculateFinalScore({
  challenge,
  liveScore,
  timerRemaining,
  stepsTaken,
  paidClueIds,
  livesRemaining,
  solved,
}: {
  challenge: Challenge
  liveScore: number
  timerRemaining: number
  stepsTaken: number
  paidClueIds: number[]
  livesRemaining: number
  solved: boolean
}): ScoreBreakdown {
  const timeMultiplier = getTimeMultiplier(timerRemaining, challenge.timerSeconds)
  const cluePenalty = getCluePenalty(challenge, paidClueIds)
  const livesLost = Math.max(0, 3 - livesRemaining)
  const lifePenalty = livesLost * LIFE_PENALTY
  const pureRunBonus = getPureRunBonus(paidClueIds, solved)
  const parBonus = solved ? getParBonus(stepsTaken, challenge.par) : 0
  const subtotal = Math.max(0, liveScore)
  const multiplied = Math.round(subtotal * timeMultiplier)
  const finalScore = Math.max(0, multiplied + pureRunBonus + parBonus)

  return {
    liveScore: subtotal,
    finalScore,
    timeMultiplier,
    cluePenalty,
    lifePenalty,
    pureRunBonus,
    parBonus,
  }
}

export function getCluePenalty(challenge: Challenge, paidClueIds: number[]): number {
  return paidClueIds.reduce((sum, clueId) => {
    const clue = challenge.clues.find((entry) => entry.id === clueId)
    return sum + (clue?.cost ?? 0)
  }, 0)
}

function roundToTwo(value: number): number {
  return Math.round(value * 100) / 100
}
