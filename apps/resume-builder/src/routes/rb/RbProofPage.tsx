import { useState, useCallback, useEffect } from 'react'
import { PremiumLayout } from '@/components/layout/PremiumLayout'
import { useArtifacts } from '@/context/ArtifactContext'
import {
  loadFinalSubmission,
  saveFinalSubmission,
  loadChecklist,
  saveChecklist,
  isValidUrl,
  type RbFinalSubmission,
} from '@/lib/proofStorage'

const STEP_NAMES = [
  '01 Problem',
  '02 Market',
  '03 Architecture',
  '04 HLD',
  '05 LLD',
  '06 Build',
  '07 Test',
  '08 Ship',
]

const CHECKLIST_LABELS = [
  'All form sections save to localStorage',
  'Live preview updates in real-time',
  'Template switching preserves data',
  'Color theme persists after refresh',
  'ATS score calculates correctly',
  'Score updates live on edit',
  'Export buttons work (copy / download)',
  'Empty states handled gracefully',
  'Mobile responsive layout works',
  'No console errors on any page',
]

export function RbProofPage() {
  const { artifacts } = useArtifacts()
  const [submission, setSubmission] = useState<RbFinalSubmission>(loadFinalSubmission)
  const [checklist, setChecklistState] = useState<boolean[]>(() => loadChecklist())
  const [copyFeedback, setCopyFeedback] = useState(false)

  useEffect(() => {
    saveFinalSubmission(submission)
  }, [submission])

  useEffect(() => {
    saveChecklist(checklist)
  }, [checklist])

  const getStepStatus = useCallback((step: number) => {
    const a = artifacts[step] ?? null
    if (!a) return 'pending'
    return a.status === 'uploaded' ? 'complete' : a.status === 'error' ? 'error' : 'pending'
  }, [artifacts])

  const allStepsComplete = [1, 2, 3, 4, 5, 6, 7, 8].every(
    (step) => artifacts[step]?.status === 'uploaded'
  )
  const allChecklistPassed = checklist.length >= 10 && checklist.every(Boolean)
  const lovableValid = isValidUrl(submission.lovableProjectLink)
  const githubValid = isValidUrl(submission.githubRepositoryLink)
  const deployedValid = isValidUrl(submission.deployedUrl)
  const allLinksValid = lovableValid && githubValid && deployedValid
  const isShipped = allStepsComplete && allChecklistPassed && allLinksValid

  const setChecklistItem = useCallback((index: number, value: boolean) => {
    setChecklistState((prev) => {
      const next = [...prev]
      while (next.length <= index) next.push(false)
      next[index] = value
      return next.slice(0, 10)
    })
  }, [])

  const handleCopySubmission = useCallback(() => {
    const text = [
      '------------------------------------------',
      'AI Resume Builder — Final Submission',
      '',
      'Lovable Project: ' + (submission.lovableProjectLink || ''),
      'GitHub Repository: ' + (submission.githubRepositoryLink || ''),
      'Live Deployment: ' + (submission.deployedUrl || ''),
      '',
      'Core Capabilities:',
      '- Structured resume builder',
      '- Deterministic ATS scoring',
      '- Template switching',
      '- PDF export with clean formatting',
      '- Persistence + validation checklist',
      '------------------------------------------',
    ].join('\n')
    navigator.clipboard.writeText(text).then(() => {
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 1500)
    })
  }, [submission])

  const footer = (
    <div className="flex items-center justify-between">
      <span className="text-xs text-slate-500">Project 3 — AI Resume Builder Proof</span>
    </div>
  )

  return (
    <PremiumLayout
      headerTitle="Proof — AI Resume Builder"
      headerSubtitle="Project 3 — Final submission"
      copyContent=""
      topBarCenter="Project 3 — Proof"
      topBarStatus={isShipped ? 'Shipped' : 'In Progress'}
      topBarStatusVariant={isShipped ? 'success' : 'default'}
      footerContent={footer}
    >
      <div className="p-6 max-w-2xl">
        {isShipped && (
          <div className="mb-6 py-4 px-4 rounded-lg bg-slate-800/60 border border-slate-700/60">
            <p className="text-slate-200 font-medium">Project 3 Shipped Successfully.</p>
          </div>
        )}

        {/* A) Step Completion Overview */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
            Step Completion Overview
          </h2>
          <div className="space-y-2">
            {STEP_NAMES.map((name, i) => {
              const status = getStepStatus(i + 1)
              const statusClass =
                status === 'complete'
                  ? 'text-emerald-400'
                  : status === 'error'
                    ? 'text-rose-400'
                    : 'text-slate-500'
              const statusLabel =
                status === 'complete' ? 'Complete' : status === 'error' ? 'Error' : 'Pending'
              return (
                <div key={name} className="flex items-center gap-3 text-sm">
                  <span className="w-36 text-slate-400">{name}</span>
                  <span className={statusClass}>{statusLabel}</span>
                </div>
              )
            })}
          </div>
        </section>

        {/* B) Artifact Collection (Required to mark Shipped) */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
            Artifact Collection (Required to mark Shipped)
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Lovable Project Link
              </label>
              <input
                type="url"
                value={submission.lovableProjectLink}
                onChange={(e) =>
                  setSubmission((s) => ({ ...s, lovableProjectLink: e.target.value }))
                }
                placeholder="https://lovable.dev/projects/..."
                className={`w-full px-3 py-2 text-sm bg-slate-800 border rounded text-slate-200 placeholder-slate-500 ${
                  submission.lovableProjectLink && !lovableValid
                    ? 'border-rose-500/50'
                    : 'border-slate-600'
                }`}
              />
              {submission.lovableProjectLink && !lovableValid && (
                <p className="text-xs text-rose-400 mt-1">Enter a valid URL (e.g. https://...)</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                GitHub Repository Link
              </label>
              <input
                type="url"
                value={submission.githubRepositoryLink}
                onChange={(e) =>
                  setSubmission((s) => ({ ...s, githubRepositoryLink: e.target.value }))
                }
                placeholder="https://github.com/..."
                className={`w-full px-3 py-2 text-sm bg-slate-800 border rounded text-slate-200 placeholder-slate-500 ${
                  submission.githubRepositoryLink && !githubValid
                    ? 'border-rose-500/50'
                    : 'border-slate-600'
                }`}
              />
              {submission.githubRepositoryLink && !githubValid && (
                <p className="text-xs text-rose-400 mt-1">Enter a valid URL (e.g. https://...)</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Deployed URL
              </label>
              <input
                type="url"
                value={submission.deployedUrl}
                onChange={(e) =>
                  setSubmission((s) => ({ ...s, deployedUrl: e.target.value }))
                }
                placeholder="https://..."
                className={`w-full px-3 py-2 text-sm bg-slate-800 border rounded text-slate-200 placeholder-slate-500 ${
                  submission.deployedUrl && !deployedValid
                    ? 'border-rose-500/50'
                    : 'border-slate-600'
                }`}
              />
              {submission.deployedUrl && !deployedValid && (
                <p className="text-xs text-rose-400 mt-1">Enter a valid URL (e.g. https://...)</p>
              )}
            </div>
          </div>
        </section>

        {/* Checklist (10 items — required for Shipped) */}
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
            Verification Checklist (all required for Shipped)
          </h2>
          <div className="space-y-2">
            {CHECKLIST_LABELS.map((label, i) => (
              <label
                key={i}
                className="flex items-start gap-3 text-sm text-slate-300 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={checklist[i] === true}
                  onChange={(e) => setChecklistItem(i, e.target.checked)}
                  className="mt-1 rounded border-slate-600 bg-slate-800 text-emerald-500 focus:ring-emerald-500"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </section>

        {/* Final Submission Export */}
        <section>
          <button
            type="button"
            onClick={handleCopySubmission}
            className="px-4 py-2 text-sm font-medium rounded bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
          >
            {copyFeedback ? 'Copied ✓' : 'Copy Final Submission'}
          </button>
        </section>
      </div>
    </PremiumLayout>
  )
}
