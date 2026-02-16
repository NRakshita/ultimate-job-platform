/**
 * Job Notification Tracker — Preferences (localStorage: jobTrackerPreferences)
 */

const STORAGE_KEY = 'jobTrackerPreferences'

const DEFAULTS = {
  roleKeywords: '',
  preferredLocations: [],
  preferredMode: [],
  experienceLevel: '',
  skills: '',
  minMatchScore: 40,
}

export function getDefaultPreferences() {
  return { ...DEFAULTS }
}

export function loadPreferences() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULTS,
      ...parsed,
      preferredLocations: Array.isArray(parsed.preferredLocations) ? parsed.preferredLocations : DEFAULTS.preferredLocations,
      preferredMode: Array.isArray(parsed.preferredMode) ? parsed.preferredMode : DEFAULTS.preferredMode,
      minMatchScore: typeof parsed.minMatchScore === 'number' ? Math.max(0, Math.min(100, parsed.minMatchScore)) : DEFAULTS.minMatchScore,
    }
  } catch {
    return null
  }
}

export function savePreferences(prefs) {
  try {
    const toSave = {
      roleKeywords: String(prefs.roleKeywords ?? DEFAULTS.roleKeywords),
      preferredLocations: Array.isArray(prefs.preferredLocations) ? prefs.preferredLocations : [],
      preferredMode: Array.isArray(prefs.preferredMode) ? prefs.preferredMode : [],
      experienceLevel: String(prefs.experienceLevel ?? DEFAULTS.experienceLevel),
      skills: String(prefs.skills ?? DEFAULTS.skills),
      minMatchScore: Math.max(0, Math.min(100, Number(prefs.minMatchScore) ?? DEFAULTS.minMatchScore)),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    return toSave
  } catch {
    return null
  }
}

export function hasPreferencesSet(prefs) {
  if (!prefs) return false
  return (
    (prefs.roleKeywords && prefs.roleKeywords.trim().length > 0) ||
    (prefs.preferredLocations && prefs.preferredLocations.length > 0) ||
    (prefs.preferredMode && prefs.preferredMode.length > 0) ||
    (prefs.experienceLevel && prefs.experienceLevel.length > 0) ||
    (prefs.skills && prefs.skills.trim().length > 0)
  )
}
