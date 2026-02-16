/** Final submission links stored under rb_final_submission */
export interface RbFinalSubmission {
  lovableProjectLink: string
  githubRepositoryLink: string
  deployedUrl: string
}

const SUBMISSION_KEY = 'rb_final_submission'
const CHECKLIST_KEY = 'rb_checklist'

export function loadFinalSubmission(): RbFinalSubmission {
  try {
    const raw = localStorage.getItem(SUBMISSION_KEY)
    if (!raw) return { lovableProjectLink: '', githubRepositoryLink: '', deployedUrl: '' }
    const parsed = JSON.parse(raw) as Record<string, unknown>
    return {
      lovableProjectLink: typeof parsed.lovableProjectLink === 'string' ? parsed.lovableProjectLink : '',
      githubRepositoryLink: typeof parsed.githubRepositoryLink === 'string' ? parsed.githubRepositoryLink : '',
      deployedUrl: typeof parsed.deployedUrl === 'string' ? parsed.deployedUrl : '',
    }
  } catch {
    return { lovableProjectLink: '', githubRepositoryLink: '', deployedUrl: '' }
  }
}

export function saveFinalSubmission(data: RbFinalSubmission): void {
  try {
    localStorage.setItem(SUBMISSION_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

/** 10 checklist items (manual test checklist). Stored as array of booleans. */
export function loadChecklist(): boolean[] {
  try {
    const raw = localStorage.getItem(CHECKLIST_KEY)
    if (!raw) return Array(10).fill(false)
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return Array(10).fill(false)
    const arr = parsed.slice(0, 10).map((v: unknown) => v === true)
    while (arr.length < 10) arr.push(false)
    return arr
  } catch {
    return Array(10).fill(false)
  }
}

export function saveChecklist(checked: boolean[]): void {
  try {
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(checked.slice(0, 10)))
  } catch {
    // ignore
  }
}

/** Valid URL: has protocol http/https and valid host */
export function isValidUrl(s: string): boolean {
  const t = (s || '').trim()
  if (!t) return false
  try {
    const u = new URL(t)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}
