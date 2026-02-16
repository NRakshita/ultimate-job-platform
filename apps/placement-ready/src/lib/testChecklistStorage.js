const STORAGE_KEY = 'prp_test_checklist'

const DEFAULT_CHECKLIST = {
  'jd-required': false,
  'short-jd-warning': false,
  'skills-extraction': false,
  'round-mapping': false,
  'score-deterministic': false,
  'skill-toggles-live': false,
  'persist-after-refresh': false,
  'history-saves-loads': false,
  'export-buttons': false,
  'no-console-errors': false,
}

export const TEST_IDS = Object.keys(DEFAULT_CHECKLIST)

export function getTestChecklist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_CHECKLIST }
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_CHECKLIST, ...parsed }
  } catch {
    return { ...DEFAULT_CHECKLIST }
  }
}

export function setTestChecked(id, checked) {
  const current = getTestChecklist()
  current[id] = !!checked
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch (e) {
    console.warn('Could not save test checklist:', e)
  }
  return current
}

export function resetTestChecklist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_CHECKLIST))
  } catch (e) {
    console.warn('Could not reset test checklist:', e)
  }
}

export function getAllTestsPassed() {
  const checklist = getTestChecklist()
  return TEST_IDS.every((id) => !!checklist[id])
}

export function getTestsPassedCount() {
  const checklist = getTestChecklist()
  return TEST_IDS.filter((id) => !!checklist[id]).length
}
