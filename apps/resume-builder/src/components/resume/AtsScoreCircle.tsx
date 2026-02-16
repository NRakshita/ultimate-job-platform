import { useResume } from '@/context/ResumeContext'
import { useMemo } from 'react'
import {
  computeAtsScore,
  getAtsScoreBand,
  ATS_BAND_LABELS,
} from '@/lib/atsScore'

const BAND_COLORS = {
  needsWork: {
    stroke: 'rgb(239, 68, 68)', // red-500
    bg: 'bg-red-500/10',
    text: 'text-red-600',
  },
  gettingThere: {
    stroke: 'rgb(245, 158, 11)', // amber-500
    bg: 'bg-amber-500/10',
    text: 'text-amber-600',
  },
  strong: {
    stroke: 'rgb(34, 197, 94)', // green-500
    bg: 'bg-green-500/10',
    text: 'text-green-600',
  },
} as const

const RADIUS = 54
const STROKE = 8
const CIRCUMFERENCE = 2 * Math.PI * (RADIUS - STROKE / 2)

export function AtsScoreCircle() {
  const { data } = useResume()
  const result = useMemo(() => computeAtsScore(data), [data])
  const band = getAtsScoreBand(result.score)
  const colors = BAND_COLORS[band]
  const dashOffset = CIRCUMFERENCE - (result.score / 100) * CIRCUMFERENCE

  return (
    <div className="no-print rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-800 mb-4">
        ATS Resume Score
      </p>
      <div className="flex flex-col sm:flex-row sm:items-start gap-6">
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative w-28 h-28">
            <svg
              className="w-28 h-28 -rotate-90"
              viewBox={`0 0 ${RADIUS * 2} ${RADIUS * 2}`}
            >
              <circle
                cx={RADIUS}
                cy={RADIUS}
                r={RADIUS - STROKE / 2}
                fill="none"
                stroke="rgb(226, 232, 240)"
                strokeWidth={STROKE}
              />
              <circle
                cx={RADIUS}
                cy={RADIUS}
                r={RADIUS - STROKE / 2}
                fill="none"
                stroke={colors.stroke}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                className="transition-[stroke-dashoffset] duration-500"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-800">
              {result.score}
            </span>
          </div>
          <div>
            <p className={`font-semibold ${colors.text}`}>
              {ATS_BAND_LABELS[band]}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">out of 100</p>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          {result.suggestions.length > 0 ? (
            <>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                Improvement suggestions
              </p>
              <ul className="space-y-1.5">
                {result.suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="text-sm text-slate-700 flex items-start gap-2"
                  >
                    <span className="text-slate-400 mt-0.5">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="text-sm text-slate-600">
              Your resume meets all scored ATS criteria. Great job!
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
