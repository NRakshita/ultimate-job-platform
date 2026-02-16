const STORAGE_KEY = 'prp_final_submission'

const STEP_IDS = [
  'step-1',
  'step-2',
  'step-3',
  'step-4',
  'step-5',
  'step-6',
  'step-7',
  'step-8',
]

const DEFAULT_SUBMISSION = {
  steps: STEP_IDS.reduce((acc, id) => ({ ...acc, [id]: false }), {}),
  lovableProjectLink: '',
  githubRepositoryLink: '',
  deployedUrl: '',
}

export const STEP_LABELS = {
  'step-1': 'JD Input & Validation',
  'step-2': 'Skill Extraction',
  'step-3': 'Round Mapping Engine',
  'step-4': '7-Day Plan Generation',
  'step-5': 'Interactive Readiness Score',
  'step-6': 'History & Persistence',
  'step-7': 'Export Tools',
  'step-8': 'Test Checklist (10/10)',
}

export { STEP_IDS }

export function isValidUrl(str) {
  if (!str || typeof str !== 'string') return false
  const trimmed = str.trim()
  if (!trimmed) return false
  try {
    const url = new URL(trimmed)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function getProofSubmission() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SUBMISSION }
    const parsed = JSON.parse(raw)
    return {
      steps: { ...DEFAULT_SUBMISSION.steps, ...parsed.steps },
      lovableProjectLink: parsed.lovableProjectLink ?? '',
      githubRepositoryLink: parsed.githubRepositoryLink ?? '',
      deployedUrl: parsed.deployedUrl ?? '',
    }
  } catch {
    return { ...DEFAULT_SUBMISSION }
  }
}

export function setProofStep(stepId, completed) {
  const current = getProofSubmission()
  if (!STEP_IDS.includes(stepId)) return current
  current.steps[stepId] = !!completed
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch (e) {
    console.warn('Could not save proof:', e)
  }
  return getProofSubmission()
}

export function setProofLinks(links) {
  const current = getProofSubmission()
  if (links.lovableProjectLink !== undefined) current.lovableProjectLink = String(links.lovableProjectLink ?? '')
  if (links.githubRepositoryLink !== undefined) current.githubRepositoryLink = String(links.githubRepositoryLink ?? '')
  if (links.deployedUrl !== undefined) current.deployedUrl = String(links.deployedUrl ?? '')
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  } catch (e) {
    console.warn('Could not save proof:', e)
  }
  return getProofSubmission()
}

export function getAllStepsCompleted() {
  const submission = getProofSubmission()
  return STEP_IDS.every((id) => !!submission.steps[id])
}

export function getAllLinksProvided(submission) {
  const s = submission ?? getProofSubmission()
  return (
    isValidUrl(s.lovableProjectLink) &&
    isValidUrl(s.githubRepositoryLink) &&
    isValidUrl(s.deployedUrl)
  )
}
