import { ReactNode } from 'react'
import { TopBar } from './TopBar'
import { ContextHeader } from './ContextHeader'
import { BuildPanel } from './BuildPanel'
import { ProofFooter } from './ProofFooter'
import type { ArtifactStatus } from '@/context/ArtifactContext'

interface PremiumLayoutProps {
  /** Main workspace content (70%) */
  children: ReactNode
  /** Step number 1-8 for step pages, or undefined for proof */
  stepNumber?: number
  /** Context header title */
  headerTitle: string
  /** Context header subtitle */
  headerSubtitle?: string
  /** Content to copy into Lovable */
  copyContent: string
  /** Callback when user marks artifact status */
  onArtifactStatus?: (status: ArtifactStatus) => void
  /** Top bar center text */
  topBarCenter: string
  /** Top bar status badge */
  topBarStatus?: string
  /** Top bar status style (e.g. success for Shipped) */
  topBarStatusVariant?: 'default' | 'success' | 'error' | 'warning'
  /** Custom footer content */
  footerContent?: ReactNode
}

export function PremiumLayout({
  children,
  stepNumber,
  headerTitle,
  headerSubtitle,
  copyContent,
  onArtifactStatus,
  topBarCenter,
  topBarStatus,
  topBarStatusVariant,
  footerContent,
}: PremiumLayoutProps) {
  const showBuildPanel = stepNumber != null && onArtifactStatus != null

  return (
    <div className="h-screen flex flex-col bg-slate-900 text-slate-200">
      <TopBar
        title="AI Resume Builder"
        center={topBarCenter}
        status={topBarStatus}
        statusVariant={topBarStatusVariant ?? 'default'}
      />
      <ContextHeader title={headerTitle} subtitle={headerSubtitle} />
      <div className="flex-1 flex min-h-0">
        <main className="flex-1 overflow-auto" style={{ width: showBuildPanel ? '70%' : '100%' }}>
          {children}
        </main>
        {showBuildPanel && (
          <BuildPanel
            copyContent={copyContent}
            stepNumber={stepNumber}
            onArtifactStatus={onArtifactStatus}
          />
        )}
      </div>
      <ProofFooter>{footerContent}</ProofFooter>
    </div>
  )
}
