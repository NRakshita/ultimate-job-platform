import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'

export type TemplateId = 'classic' | 'modern' | 'minimal'

export type AccentThemeId = 'teal' | 'navy' | 'burgundy' | 'forest' | 'charcoal'

export const ACCENT_THEMES: Record<AccentThemeId, string> = {
  teal: 'hsl(168, 60%, 40%)',
  navy: 'hsl(220, 60%, 35%)',
  burgundy: 'hsl(345, 60%, 35%)',
  forest: 'hsl(150, 50%, 30%)',
  charcoal: 'hsl(0, 0%, 25%)',
}

const TEMPLATE_STORAGE_KEY = 'resumeBuilderTemplate'
const ACCENT_STORAGE_KEY = 'resumeBuilderAccent'

function loadTemplate(): TemplateId {
  try {
    const raw = localStorage.getItem(TEMPLATE_STORAGE_KEY)
    if (raw === 'classic' || raw === 'modern' || raw === 'minimal') return raw
  } catch {
    // ignore
  }
  return 'classic'
}

function loadAccent(): AccentThemeId {
  try {
    const raw = localStorage.getItem(ACCENT_STORAGE_KEY)
    if (raw && raw in ACCENT_THEMES) return raw as AccentThemeId
  } catch {
    // ignore
  }
  return 'teal'
}

function saveTemplate(t: TemplateId) {
  try {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, t)
  } catch {
    // ignore
  }
}

function saveAccent(a: AccentThemeId) {
  try {
    localStorage.setItem(ACCENT_STORAGE_KEY, a)
  } catch {
    // ignore
  }
}

interface TemplateContextValue {
  template: TemplateId
  setTemplate: (t: TemplateId) => void
  accentTheme: AccentThemeId
  setAccentTheme: (a: AccentThemeId) => void
  accentColor: string
}

const TemplateContext = createContext<TemplateContextValue | null>(null)

export function TemplateProvider({ children }: { children: ReactNode }) {
  const [template, setTemplateState] = useState<TemplateId>(loadTemplate)
  const [accentTheme, setAccentThemeState] = useState<AccentThemeId>(loadAccent)

  useEffect(() => {
    saveTemplate(template)
  }, [template])

  useEffect(() => {
    saveAccent(accentTheme)
  }, [accentTheme])

  const setTemplate = useCallback((t: TemplateId) => {
    setTemplateState(t)
  }, [])

  const setAccentTheme = useCallback((a: AccentThemeId) => {
    setAccentThemeState(a)
  }, [])

  const accentColor = ACCENT_THEMES[accentTheme]

  return (
    <TemplateContext.Provider
      value={{
        template,
        setTemplate,
        accentTheme,
        setAccentTheme,
        accentColor,
      }}
    >
      {children}
    </TemplateContext.Provider>
  )
}

export function useTemplate() {
  const ctx = useContext(TemplateContext)
  if (!ctx) throw new Error('useTemplate must be used within TemplateProvider')
  return ctx
}
