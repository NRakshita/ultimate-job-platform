const STORAGE_KEY = 'placement_jd_history'
import { normalizeEntry, isValidEntry } from './schema'
import { getAllSkillsFromFlat, computeFinalScore } from './schema'

export function saveAnalysis(entry) {
  const history = getValidHistory()
  const normalized = normalizeEntry({
    ...entry,
    baseScore: entry.baseScore ?? entry.readinessScore,
    plan7Days: entry.plan7Days ?? entry.plan,
    skillConfidenceMap: entry.skillConfidenceMap || {},
  })
  if (!normalized) return null

  const id = entry.id || `jd_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
  const now = new Date().toISOString()
  const newEntry = {
    ...normalized,
    id,
    createdAt: entry.createdAt || now,
    updatedAt: now,
    companyIntel: entry.companyIntel ?? null,
  }
  newEntry.finalScore = computeFinalScore(
    newEntry.baseScore,
    newEntry.skillConfidenceMap,
    getAllSkillsFromFlat(newEntry.extractedSkills)
  )

  history.unshift(newEntry)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (e) {
    console.warn('Could not save to localStorage:', e)
    return null
  }
  return id
}

function getRawHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getHistory() {
  const { history } = getValidHistoryWithCorrupted()
  return history
}

function getValidHistory() {
  const { history } = getValidHistoryWithCorrupted()
  return history
}

export function getValidHistoryWithCorrupted() {
  const raw = getRawHistory()
  if (!Array.isArray(raw)) return { history: [], corruptedCount: 0 }

  const history = []
  let corruptedCount = 0
  for (const item of raw) {
    const normalized = normalizeEntry(item)
    if (normalized && isValidEntry(normalized)) {
      history.push(normalized)
    } else {
      corruptedCount++
    }
  }
  return { history, corruptedCount }
}

export function getEntryById(id) {
  const history = getHistory()
  const found = history.find((e) => e.id === id)
  return found ? normalizeEntry(found) : null
}

export function getLatestEntry() {
  const history = getHistory()
  return history[0] ? normalizeEntry(history[0]) : null
}

export function deleteEntry(id) {
  const history = getValidHistory().filter((e) => e.id !== id)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (e) {
    console.warn('Could not update localStorage:', e)
  }
}

export function updateEntry(id, updates) {
  const history = getValidHistory()
  const idx = history.findIndex((e) => e.id === id)
  if (idx === -1) return

  const current = history[idx]
  const next = { ...current, ...updates, updatedAt: new Date().toISOString() }

  if (updates.skillConfidenceMap !== undefined) {
    next.finalScore = computeFinalScore(
      next.baseScore ?? current.baseScore,
      updates.skillConfidenceMap,
      getAllSkillsFromFlat(next.extractedSkills)
    )
  }

  history[idx] = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  } catch (e) {
    console.warn('Could not update localStorage:', e)
  }
}

export function getDisplayScore(entry) {
  if (!entry) return 0
  return Math.max(0, Math.min(100, entry.finalScore ?? entry.readinessScore ?? 0))
}
