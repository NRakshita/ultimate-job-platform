import { createContext, useContext, useCallback, useState, useMemo, ReactNode, useEffect } from 'react'

export type ArtifactStatus = 'pending' | 'uploaded' | 'error'

export interface StepArtifact {
  status: ArtifactStatus
  value?: string
  screenshot?: string
}

const STORAGE_PREFIX = 'rb_step_'

function getStorageKey(step: number) {
  return `${STORAGE_PREFIX}${step.toString().padStart(2, '0')}_artifact`
}

export function loadStepArtifact(step: number): StepArtifact | null {
  try {
    const raw = localStorage.getItem(getStorageKey(step))
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveStepArtifact(step: number, artifact: StepArtifact) {
  localStorage.setItem(getStorageKey(step), JSON.stringify(artifact))
}

export interface ArtifactContextValue {
  artifacts: Record<number, StepArtifact | null>
  setArtifact: (step: number, artifact: StepArtifact) => void
  hasArtifact: (step: number) => boolean
  loadAll: () => void
}

const ArtifactContext = createContext<ArtifactContextValue | null>(null)

export function ArtifactProvider({ children }: { children: ReactNode }) {
  const [artifacts, setArtifacts] = useState<Record<number, StepArtifact | null>>({})

  const loadAll = useCallback(() => {
    const next: Record<number, StepArtifact | null> = {}
    for (let i = 1; i <= 8; i++) {
      next[i] = loadStepArtifact(i)
    }
    setArtifacts(next)
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  const setArtifact = useCallback((step: number, artifact: StepArtifact) => {
    saveStepArtifact(step, artifact)
    setArtifacts(prev => ({ ...prev, [step]: artifact }))
  }, [])

  const hasArtifact = useCallback((step: number) => {
    const a = artifacts[step] ?? loadStepArtifact(step)
    return a != null && (a.status === 'uploaded' || a.status === 'error')
  }, [artifacts])

  const value = useMemo(
    () => ({ artifacts, setArtifact, hasArtifact, loadAll }),
    [artifacts, setArtifact, hasArtifact, loadAll],
  )

  return (
    <ArtifactContext.Provider value={value}>
      {children}
    </ArtifactContext.Provider>
  )
}

export function useArtifacts() {
  const ctx = useContext(ArtifactContext)
  if (!ctx) throw new Error('useArtifacts must be used within ArtifactProvider')
  return ctx
}
