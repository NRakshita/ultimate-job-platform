interface ContextHeaderProps {
  title: string
  subtitle?: string
}

export function ContextHeader({ title, subtitle }: ContextHeaderProps) {
  return (
    <div className="px-4 py-3 border-b border-slate-700/60 bg-slate-800/40 shrink-0">
      <h1 className="text-base font-semibold text-slate-100">{title}</h1>
      {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
  )
}
