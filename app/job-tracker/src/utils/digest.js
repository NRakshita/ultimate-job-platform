/**
 * Daily Digest — storage and generation.
 * Key: jobTrackerDigest_{YYYY-MM-DD}
 */

import { computeMatchScore } from './matchScore'

const PREFIX = 'jobTrackerDigest_'

export function getTodayKey() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * Stored shape: { dateKey, items: [{ jobId, matchScore }] }
 */
export function getStoredDigest(dateKey) {
  try {
    const raw = localStorage.getItem(PREFIX + dateKey)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setStoredDigest(dateKey, items) {
  try {
    const toSave = {
      dateKey,
      items: items.map(({ job, matchScore }) => ({ jobId: job.id, matchScore })),
    }
    localStorage.setItem(PREFIX + dateKey, JSON.stringify(toSave))
    return toSave
  } catch {
    return null
  }
}

/**
 * Generate top 10 jobs: sort by matchScore descending, then postedDaysAgo ascending.
 * Returns array of { job, matchScore }.
 */
export function generateDigest(jobs, preferences) {
  if (!jobs?.length || !preferences) return []

  const withScores = jobs.map((job) => ({
    job,
    matchScore: computeMatchScore(job, preferences),
  }))

  withScores.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore
    return (a.job.postedDaysAgo ?? 99) - (b.job.postedDaysAgo ?? 99)
  })

  return withScores.slice(0, 10)
}

/**
 * Resolve stored digest items to full job objects using jobs array.
 */
export function resolveDigestItems(stored, jobs) {
  if (!stored?.items?.length || !jobs?.length) return []
  const byId = new Map(jobs.map((j) => [j.id, j]))
  return stored.items
    .map(({ jobId, matchScore }) => {
      const job = byId.get(jobId)
      return job ? { job, matchScore } : null
    })
    .filter(Boolean)
}
