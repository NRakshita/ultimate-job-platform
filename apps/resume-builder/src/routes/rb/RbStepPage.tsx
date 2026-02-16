import { useOutletContext } from 'react-router-dom'

interface RbStepContext {
  stepNum: number
  stepName: string
  canProceed: boolean
  onNext: () => void
  onPrev: () => void
}

export function RbStepPage() {
  const { stepNum, stepName, canProceed, onNext, onPrev } = useOutletContext<RbStepContext>()

  return (
    <div className="p-6 max-w-3xl">
      <div className="prose prose-invert prose-sm max-w-none">
        <p className="text-slate-400">
          Step {stepNum}: {stepName} — placeholder. Build content will go here.
        </p>
      </div>
      <div className="mt-8 flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={stepNum <= 1}
          className="px-4 py-2 text-sm font-medium rounded border border-slate-600 text-slate-300 hover:bg-slate-700/50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="px-4 py-2 text-sm font-medium rounded bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {stepNum >= 8 ? 'Go to Proof' : 'Next'}
        </button>
      </div>
    </div>
  )
}
