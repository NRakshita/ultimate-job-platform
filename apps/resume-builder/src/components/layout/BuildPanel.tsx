import { useState } from 'react'
import type { ArtifactStatus } from '@/context/ArtifactContext'

interface BuildPanelProps {
  copyContent: string
  stepNumber: number
  onArtifactStatus: (status: ArtifactStatus) => void
}

export function BuildPanel({ copyContent, stepNumber: _stepNumber, onArtifactStatus }: BuildPanelProps) {
  const [feedback, setFeedback] = useState<'idle' | 'copied'>('idle')

  const handleCopy = () => {
    navigator.clipboard.writeText(copyContent)
    setFeedback('copied')
    setTimeout(() => setFeedback('idle'), 1500)
  }

  const handleWorked = () => {
    onArtifactStatus('uploaded')
  }

  const handleError = () => {
    onArtifactStatus('error')
  }

  return (
    <aside className="w-[30%] min-w-[260px] flex flex-col border-l border-slate-700/60 bg-slate-900/60 shrink-0">
      <div className="px-3 py-2 border-b border-slate-700/60 text-xs font-medium text-slate-400 uppercase tracking-wide">
        Build Panel
      </div>
      <div className="flex-1 flex flex-col p-3 gap-3 overflow-auto">
        <label className="text-xs text-slate-400">Copy This Into Lovable</label>
        <textarea
          readOnly
          value={copyContent}
          className="w-full h-24 text-xs font-mono bg-slate-800 text-slate-200 rounded border border-slate-600/60 p-2 resize-none"
          rows={4}
        />
        <button
          type="button"
          onClick={handleCopy}
          className="px-3 py-2 text-sm font-medium rounded bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          {feedback === 'copied' ? 'Copied ✓' : 'Copy'}
        </button>
        <a
          href="https://lovable.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 text-sm font-medium rounded border border-indigo-500/60 text-indigo-400 hover:bg-indigo-500/10 text-center"
        >
          Build in Lovable
        </a>
        <div className="border-t border-slate-700/60 pt-3 mt-2">
          <label className="text-xs text-slate-400 block mb-2">Mark step result</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleWorked}
              className="flex-1 px-2 py-1.5 text-xs font-medium rounded bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-400"
            >
              It Worked
            </button>
            <button
              type="button"
              onClick={handleError}
              className="flex-1 px-2 py-1.5 text-xs font-medium rounded bg-rose-600/30 hover:bg-rose-600/50 text-rose-400"
            >
              Error
            </button>
            <button
              type="button"
              className="flex-1 px-2 py-1.5 text-xs font-medium rounded border border-slate-600 text-slate-400 hover:bg-slate-700/50"
            >
              Add Screenshot
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
