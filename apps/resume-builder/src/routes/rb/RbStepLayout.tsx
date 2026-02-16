import { Outlet, useParams, useNavigate, Navigate } from 'react-router-dom'
import { PremiumLayout } from '@/components/layout/PremiumLayout'
import { useArtifacts } from '@/context/ArtifactContext'
import type { ArtifactStatus } from '@/context/ArtifactContext'

const STEP_SLUGS = [
  '01-problem',
  '02-market',
  '03-architecture',
  '04-hld',
  '05-lld',
  '06-build',
  '07-test',
  '08-ship',
] as const

const STEP_NAMES: Record<string, string> = {
  '01': 'Problem',
  '02': 'Market',
  '03': 'Architecture',
  '04': 'HLD',
  '05': 'LLD',
  '06': 'Build',
  '07': 'Test',
  '08': 'Ship',
}

export function RbStepLayout() {
  const { stepSlug } = useParams<{ stepSlug: string }>()
  const navigate = useNavigate()
  const { hasArtifact, setArtifact } = useArtifacts()

  const stepIndex = STEP_SLUGS.indexOf(stepSlug as (typeof STEP_SLUGS)[number])
  if (stepIndex < 0) {
    return <Navigate to="/rb/01-problem" replace />
  }
  const stepNum = stepIndex + 1
  const stepId = stepNum >= 1 && stepNum <= 8 ? stepNum.toString().padStart(2, '0') : ''
  const stepName = stepId ? STEP_NAMES[stepId] ?? 'Step' : ''
  const stepDisplay = stepIndex >= 0 ? stepIndex + 1 : 0
  const canProceed = stepNum >= 1 && stepNum <= 8 && hasArtifact(stepNum)
  const isLast = stepIndex === 7
  const nextSlug = isLast ? null : STEP_SLUGS[stepIndex + 1]
  const prevSlug = stepIndex > 0 ? STEP_SLUGS[stepIndex - 1] : null

  const handleNext = () => {
    if (isLast) {
      navigate('/rb/proof')
    } else if (nextSlug) {
      navigate(`/rb/${nextSlug}`)
    }
  }

  const handlePrev = () => {
    if (prevSlug) {
      navigate(`/rb/${prevSlug}`)
    }
  }

  const copyContent = `Step ${stepDisplay}: ${stepName}\n\nPlaceholder — paste your build instructions here.`

  return (
    <PremiumLayout
      stepNumber={stepNum}
      headerTitle={`Step ${stepDisplay}: ${stepName}`}
      headerSubtitle="Project 3 — AI Resume Builder Build Track"
      copyContent={copyContent}
      onArtifactStatus={(status: ArtifactStatus) => {
        if (stepNum >= 1 && stepNum <= 8) {
          setArtifact(stepNum, { status })
        }
      }}
      topBarCenter={`Project 3 — Step ${stepDisplay} of 8`}
      topBarStatus={canProceed ? 'Ready' : 'Upload artifact'}
    >
      <Outlet
        context={{
          stepNum,
          stepName,
          canProceed,
          onNext: handleNext,
          onPrev: handlePrev,
        }}
      />
    </PremiumLayout>
  )
}
