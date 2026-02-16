/**
 * Test Checklist — localStorage: jobTrackerTestChecklist
 */

const STORAGE_KEY = 'jobTrackerTestChecklist'

export const TEST_ITEMS = [
  {
    id: 'preferences-persist',
    label: 'Preferences persist after refresh',
    hint: 'Save preferences in Settings, refresh page, verify they are still there.',
  },
  {
    id: 'match-score-calculates',
    label: 'Match score calculates correctly',
    hint: 'Set preferences, check dashboard job cards show match scores (0-100).',
  },
  {
    id: 'show-matches-toggle',
    label: '"Show only matches" toggle works',
    hint: 'Enable toggle on dashboard, verify only jobs above threshold appear.',
  },
  {
    id: 'save-persists',
    label: 'Save job persists after refresh',
    hint: 'Save a job, refresh page, check it appears in /saved.',
  },
  {
    id: 'apply-opens-tab',
    label: 'Apply opens in new tab',
    hint: 'Click Apply button, verify new tab opens with job URL.',
  },
  {
    id: 'status-persists',
    label: 'Status update persists after refresh',
    hint: 'Change job status, refresh page, verify status is still set.',
  },
  {
    id: 'status-filter-works',
    label: 'Status filter works correctly',
    hint: 'Set job statuses, use filter dropdown, verify correct jobs show.',
  },
  {
    id: 'digest-generates-top10',
    label: 'Digest generates top 10 by score',
    hint: 'Generate digest, verify exactly 10 jobs appear, sorted by match score.',
  },
  {
    id: 'digest-persists-day',
    label: 'Digest persists for the day',
    hint: 'Generate digest, refresh page, verify same digest appears.',
  },
  {
    id: 'no-console-errors',
    label: 'No console errors on main pages',
    hint: 'Open browser console, navigate through /dashboard, /saved, /digest, /settings.',
  },
]

export function getTestChecklist() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export function setTestChecklist(checklist) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checklist))
    return true
  } catch {
    return false
  }
}

export function updateTestItem(itemId, checked) {
  const checklist = getTestChecklist()
  checklist[itemId] = checked
  setTestChecklist(checklist)
  return checklist
}

export function getAllTestsPassed() {
  const checklist = getTestChecklist()
  return TEST_ITEMS.every((item) => checklist[item.id] === true)
}

export function getTestsPassedCount() {
  const checklist = getTestChecklist()
  return TEST_ITEMS.filter((item) => checklist[item.id] === true).length
}

export function resetTestChecklist() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch {
    return false
  }
}
