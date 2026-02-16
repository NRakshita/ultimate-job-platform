import { useState, useEffect, useCallback } from 'react'
import { loadPreferences, savePreferences, hasPreferencesSet } from '../utils/preferences'

export function usePreferences() {
  const [prefs, setPrefs] = useState(null)

  const load = useCallback(() => {
    setPrefs(loadPreferences())
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const save = useCallback((next) => {
    const saved = savePreferences(next)
    if (saved) setPrefs(saved)
    return saved
  }, [])

  const isSet = hasPreferencesSet(prefs)

  return { preferences: prefs, loadPreferences: load, savePreferences: save, hasPreferences: isSet }
}
