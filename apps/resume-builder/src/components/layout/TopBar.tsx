interface TopBarProps {
  title: string
  center: string
  status?: string
  statusVariant?: 'default' | 'success' | 'error' | 'warning'
}

export function TopBar({ title, center, status, statusVariant }: TopBarProps) {
  const variant = statusVariant ?? 'default'
  const statusClass =
    variant === 'success'
      ? 'bg-emerald-500/20 text-emerald-400'
      : variant === 'error'
        ? 'bg-rose-500/20 text-rose-400'
        : variant === 'warning'
          ? 'bg-amber-500/20 text-amber-400'
          : 'bg-slate-600/40 text-slate-300'

  return (
    <header className="h-12 flex items-center justify-between px-4 border-b border-slate-700/60 bg-slate-900/80 shrink-0">
      <div className="text-sm font-medium text-slate-200">{title}</div>
      <div className="text-sm font-medium text-slate-100">{center}</div>
      <div>
        {status ? (
          <span className={`inline-flex px-2.5 py-0.5 rounded text-xs font-medium ${statusClass}`}>
            {status}
          </span>
        ) : (
          <span className="text-slate-500 text-xs">—</span>
        )}
      </div>
    </header>
  )
}
