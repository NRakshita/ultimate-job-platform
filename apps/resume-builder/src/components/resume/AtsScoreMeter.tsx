import { useResume } from '@/context/ResumeContext'
import { useMemo } from 'react'
import { computeAtsScore, getAtsScoreBand } from '@/lib/atsScore'

const BAND_STROKE = {
  needsWork: '#ef4444',
  gettingThere: '#f59e0b',
  strong: '#22c55e',
}

const RADIUS = 18
const STROKE = 3
const CIRCUMFERENCE = 2 * Math.PI * (RADIUS - STROKE / 2)

export function AtsScoreMeter() {
  const { data } = useResume()
  const result = useMemo(() => computeAtsScore(data), [data])
  const band = getAtsScoreBand(result.score)
  const strokeColor = BAND_STROKE[band]
  const dashOffset = CIRCUMFERENCE - (result.score / 100) * CIRCUMFERENCE

  return (
    <div className="rounded-lg border border-slate-700/60 bg-slate-900/50 p-4 flex-1 min-w-0">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
        ATS Readiness Score
      </p>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-14 h-14 shrink-0">
          <svg
            className="w-14 h-14 -rotate-90"
            viewBox={`0 0 ${RADIUS * 2} ${RADIUS * 2}`}
          >
            <circle
              cx={RADIUS}
              cy={RADIUS}
              r={RADIUS - STROKE / 2}
              fill="none"
              stroke="rgb(51, 65, 85)"
              strokeWidth={STROKE}
            />
            <circle
              cx={RADIUS}
              cy={RADIUS}
              r={RADIUS - STROKE / 2}
              fill="none"
              stroke={strokeColor}
              strokeWidth={STROKE}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              className="transition-[stroke-dashoffset] duration-500"
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-200">
            {result.score}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${result.score}%`, backgroundColor: strokeColor }}
            />
          </div>
        </div>
      </div>
      {result.suggestions.length > 0 && (
        <ul className="space-y-1.5">
          {result.suggestions.map((s, i) => (
            <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
              <span className="text-slate-500 mt-0.5">·</span>
              <span>{s}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
