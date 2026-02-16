import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'job-notification-tracker-saved'

function readSavedIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeSavedIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch (_) {}
}

export function useSavedJobs() {
  const [savedIds, setSavedIds] = useState(readSavedIds)

  const syncFromStorage = useCallback(() => {
    setSavedIds(readSavedIds())
  }, [])

  useEffect(() => {
    writeSavedIds(savedIds)
  }, [savedIds])

  const addSaved = useCallback((id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const removeSaved = useCallback((id) => {
    setSavedIds((prev) => prev.filter((s) => s !== id))
  }, [])

  const isSaved = useCallback(
    (id) => savedIds.includes(id),
    [savedIds]
  )

  return { savedIds, addSaved, removeSaved, isSaved, syncFromStorage }
}
