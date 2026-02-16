import { ResumeLayout } from '@/components/layout/ResumeLayout'
import { ResumeForm } from '@/components/resume/ResumeForm'
import { ResumePreviewShell } from '@/components/resume/ResumePreviewShell'
import { AtsScoreMeter } from '@/components/resume/AtsScoreMeter'
import { TemplatePicker } from '@/components/resume/TemplatePicker'
import { ColorThemePicker } from '@/components/resume/ColorThemePicker'

export function BuilderPage() {
  return (
    <ResumeLayout>
      <div className="flex h-[calc(100vh-3.5rem)]">
        <aside className="w-[45%] overflow-y-auto border-r border-slate-800/80 p-6">
          <ResumeForm />
        </aside>
        <div className="flex-1 p-6 overflow-auto bg-slate-900/30 flex flex-col gap-6">
          <div className="shrink-0 flex items-center justify-between gap-4">
            <AtsScoreMeter />
          </div>
          <div className="shrink-0 flex flex-col gap-4">
            <TemplatePicker />
            <ColorThemePicker />
          </div>
          <div className="flex-1 min-h-0">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-2">
              Live Preview
            </p>
            <ResumePreviewShell />
          </div>
        </div>
      </div>
    </ResumeLayout>
  )
}
