import { useTemplate } from '@/context/TemplateContext'
import type { TemplateId } from '@/context/TemplateContext'

const OPTIONS: { id: TemplateId; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'modern', label: 'Modern' },
  { id: 'minimal', label: 'Minimal' },
]

export function TemplateTabs() {
  const { template, setTemplate } = useTemplate()

  return (
    <div className="flex gap-1 p-0.5 rounded-md bg-slate-800/60 border border-slate-700/60">
      {OPTIONS.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => setTemplate(id)}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            template === id
              ? 'bg-slate-700 text-slate-100'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
