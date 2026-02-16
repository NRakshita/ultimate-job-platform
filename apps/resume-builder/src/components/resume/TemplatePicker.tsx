import { useTemplate } from '@/context/TemplateContext'
import type { TemplateId } from '@/context/TemplateContext'

const TEMPLATES: { id: TemplateId; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
]

/** 120px-wide layout sketch for Classic: single column, serif feel, horizontal rules */
function ClassicThumb() {
  return (
    <div className="w-full h-[72px] bg-white rounded overflow-hidden flex flex-col text-[0.5rem] text-black/80 font-serif">
      <div className="h-3 border-b border-black/30 mx-1 mt-1" />
      <div className="flex-1 flex flex-col gap-0.5 px-1 py-0.5">
        <div className="h-1.5 w-3/4 bg-black/10 rounded-sm" />
        <div className="h-1 w-full border-b border-black/20" />
        <div className="h-1.5 w-1/2 bg-black/10 rounded-sm" />
        <div className="h-1 w-full border-b border-black/20" />
      </div>
    </div>
  )
}

/** 120px-wide layout sketch for Modern: two columns, colored sidebar */
function ModernThumb() {
  return (
    <div className="w-full h-[72px] bg-white rounded overflow-hidden flex text-[0.5rem]">
      <div className="w-7 h-full bg-teal-600 shrink-0 flex flex-col gap-0.5 p-0.5">
        <div className="h-1.5 w-full bg-white/30 rounded" />
        <div className="h-1 w-full bg-white/20 rounded" />
        <div className="h-1 w-full bg-white/20 rounded" />
        <div className="flex-1 mt-0.5 flex flex-wrap gap-0.5 content-start">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-1 w-4 bg-white/40 rounded-full" />
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col gap-0.5 p-0.5">
        <div className="h-2 w-full bg-black/10 rounded" />
        <div className="h-1 w-full bg-black/5 rounded" />
        <div className="h-1.5 w-4/5 bg-black/10 rounded" />
        <div className="h-1 w-full bg-black/5 rounded" />
      </div>
    </div>
  )
}

/** 120px-wide layout sketch for Minimal: single column, no rules, spacious */
function MinimalThumb() {
  return (
    <div className="w-full h-[72px] bg-white rounded overflow-hidden flex flex-col text-[0.5rem] text-black/80 p-1.5 gap-1">
      <div className="h-2.5 w-2/3 bg-black/10 rounded-sm" />
      <div className="h-0.5 w-full" />
      <div className="h-1 w-full bg-black/5 rounded-sm" />
      <div className="h-0.5 w-full" />
      <div className="h-1 w-4/5 bg-black/5 rounded-sm" />
    </div>
  )
}

const THUMB_COMPONENTS: Record<TemplateId, () => JSX.Element> = {
  classic: ClassicThumb,
  modern: ModernThumb,
  minimal: MinimalThumb,
}

function CheckIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

export function TemplatePicker() {
  const { template, setTemplate } = useTemplate()

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
        Template
      </p>
      <div className="flex gap-3">
        {TEMPLATES.map(({ id, label }) => {
          const Thumb = THUMB_COMPONENTS[id]
          const isActive = template === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => setTemplate(id)}
              className={`relative shrink-0 w-[120px] flex flex-col items-center gap-1.5 p-1.5 rounded-lg border-2 transition-colors ${
                isActive
                  ? 'border-blue-500 bg-slate-800/50'
                  : 'border-slate-700/60 bg-slate-800/30 hover:border-slate-600'
              }`}
              aria-pressed={isActive}
              aria-label={`Select ${label} template`}
            >
              <div className="w-full rounded overflow-hidden shadow-inner ring-1 ring-black/5">
                <Thumb />
              </div>
              <span className={`text-xs font-medium ${isActive ? 'text-slate-100' : 'text-slate-400'}`}>
                {label}
              </span>
              {isActive && (
                <span className="absolute top-1.5 right-1.5 rounded-full bg-white shadow flex items-center justify-center p-0.5" aria-hidden>
                  <CheckIcon />
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
