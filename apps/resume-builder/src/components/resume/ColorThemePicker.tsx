import { useTemplate } from '@/context/TemplateContext'
import { ACCENT_THEMES, type AccentThemeId } from '@/context/TemplateContext'

const THEME_ORDER: AccentThemeId[] = ['teal', 'navy', 'burgundy', 'forest', 'charcoal']

export function ColorThemePicker() {
  const { accentTheme, setAccentTheme } = useTemplate()

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
        Color theme
      </p>
      <div className="flex gap-3 flex-wrap">
        {THEME_ORDER.map((id) => {
          const isActive = accentTheme === id
          const bg = ACCENT_THEMES[id]
          return (
            <button
              key={id}
              type="button"
              onClick={() => setAccentTheme(id)}
              className={`w-8 h-8 rounded-full shrink-0 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 ${
                isActive ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 scale-110' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: bg }}
              aria-pressed={isActive}
              aria-label={`Select ${id} color theme`}
              title={id.charAt(0).toUpperCase() + id.slice(1)}
            />
          )
        })}
      </div>
    </div>
  )
}
