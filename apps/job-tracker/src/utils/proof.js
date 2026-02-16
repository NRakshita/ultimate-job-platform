/**
 * Proof & Submission — localStorage: jobTrackerProof
 */

const STORAGE_KEY = 'jobTrackerProof'

export const PROJECT_STEPS = [
  { id: 'step1', label: 'Setup Design System', completed: true },
  { id: 'step2', label: 'Route Skeleton', completed: true },
  { id: 'step3', label: 'Problem Statement + App Skeleton', completed: true },
  { id: 'step4', label: 'Market Research + Realistic Data Engine', completed: true },
  { id: 'step5', label: 'Architecture + Preferences + Matching Engine', completed: true },
  { id: 'step6', label: 'HLD + Daily Digest Engine + 9AM Simulation', completed: true },
  { id: 'step7', label: 'LLD + Status Tracking + Notification Templates', completed: true },
  { id: 'step8', label: 'Test & Debug + Built-in Verification Layer', completed: true },
]

const DEFAULTS = {
  lovableLink: '',
  githubLink: '',
  deployedLink: '',
  status: 'Not Started', // Not Started | In Progress | Shipped
}

export function getProof() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULTS }
    const parsed = JSON.parse(raw)
    return {
      ...DEFAULTS,
      ...parsed,
    }
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveProof(proof) {
  try {
    const toSave = {
      lovableLink: String(proof.lovableLink || ''),
      githubLink: String(proof.githubLink || ''),
      deployedLink: String(proof.deployedLink || ''),
      status: proof.status || DEFAULTS.status,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
    return toSave
  } catch {
    return null
  }
}

export function validateUrl(url) {
  if (!url || typeof url !== 'string') return false
  const trimmed = url.trim()
  if (!trimmed) return false
  try {
    new URL(trimmed)
    return true
  } catch {
    return false
  }
}

export function canShip(proof, allTestsPassed) {
  const hasAllLinks =
    validateUrl(proof.lovableLink) &&
    validateUrl(proof.githubLink) &&
    validateUrl(proof.deployedLink)
  return hasAllLinks && allTestsPassed
}

export function formatSubmission(proof) {
  const lines = [
    '------------------------------------------',
    'Job Notification Tracker — Final Submission',
    '------------------------------------------',
    '',
    'Lovable Project:',
    proof.lovableLink || '(not provided)',
    '',
    'GitHub Repository:',
    proof.githubLink || '(not provided)',
    '',
    'Live Deployment:',
    proof.deployedLink || '(not provided)',
    '',
    'Core Features:',
    '- Intelligent match scoring',
    '- Daily digest simulation',
    '- Status tracking',
    '- Test checklist enforced',
    '',
    '------------------------------------------',
  ]
  return lines.join('\n')
}
