import { useState, useCallback, useEffect } from 'react'
import { ResumeLayout } from '@/components/layout/ResumeLayout'
import { ResumePrintLayout } from '@/components/resume/ResumePrintLayout'
import { TemplatePicker } from '@/components/resume/TemplatePicker'
import { ColorThemePicker } from '@/components/resume/ColorThemePicker'
import { AtsScoreCircle } from '@/components/resume/AtsScoreCircle'
import { useResume } from '@/context/ResumeContext'
import { resumeToPlainText } from '@/lib/resumeToText'
import { isResumeIncomplete } from '@/lib/exportValidation'

const TOAST_DURATION_MS = 3000

export function PreviewPage() {
  const { data } = useResume()
  const [copyFeedback, setCopyFeedback] = useState(false)
  const [pdfToast, setPdfToast] = useState(false)
  const incomplete = isResumeIncomplete(data)

  const handleDownloadPdf = useCallback(() => {
    setPdfToast(true)
  }, [])

  useEffect(() => {
    if (!pdfToast) return
    const t = setTimeout(() => setPdfToast(false), TOAST_DURATION_MS)
    return () => clearTimeout(t)
  }, [pdfToast])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleCopyText = useCallback(async () => {
    const text = resumeToPlainText(data)
    try {
      await navigator.clipboard.writeText(text)
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 1500)
    } catch {
      // fallback: ignore
    }
  }, [data])

  return (
    <ResumeLayout>
      <div className="bg-slate-100 py-8 px-6 min-h-[calc(100vh-3.5rem)] print:bg-white print:py-0 print:px-0">
        <div className="max-w-2xl mx-auto">
          <div className="no-print flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadPdf}
                className="px-4 py-2 text-sm font-medium rounded-md bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-600"
              >
                Download PDF
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2 text-sm font-medium rounded-md border border-slate-600 text-slate-700 hover:bg-slate-200 bg-white"
              >
                Print
              </button>
              <button
                type="button"
                onClick={handleCopyText}
                className="px-4 py-2 text-sm font-medium rounded-md border border-slate-600 text-slate-700 hover:bg-slate-200 bg-white"
              >
                {copyFeedback ? 'Copied ✓' : 'Copy Resume as Text'}
              </button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
              <TemplatePicker />
              <ColorThemePicker />
            </div>
          </div>

          {pdfToast && (
            <div
              role="status"
              aria-live="polite"
              className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-3 rounded-lg bg-slate-800 text-slate-100 text-sm font-medium shadow-lg border border-slate-600"
            >
              PDF export ready! Check your downloads.
            </div>
          )}
          {incomplete && (
            <div className="no-print mb-4 px-4 py-3 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-800 text-sm">
              Your resume may look incomplete.
            </div>
          )}
          <div className="no-print mb-6">
            <AtsScoreCircle />
          </div>
          <div className="shadow-lg print-resume-wrapper print-only-resume">
            <ResumePrintLayout />
          </div>
        </div>
      </div>
    </ResumeLayout>
  )
}
