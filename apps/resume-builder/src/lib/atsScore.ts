import type { ResumeData } from '@/types/resume'

/** Action verbs that earn +10 when present in summary (case-insensitive). */
const ACTION_VERBS = [
  'built',
  'led',
  'designed',
  'improved',
  'created',
  'developed',
  'implemented',
  'managed',
  'delivered',
  'achieved',
  'launched',
  'established',
  'drove',
  'optimized',
  'reduced',
  'increased',
  'scaled',
  'mentored',
  'coordinated',
  'automated',
  'shipped',
  'architected',
  'transformed',
]

function summaryHasActionVerbs(summary: string): boolean {
  const lower = summary.trim().toLowerCase()
  if (!lower) return false
  return ACTION_VERBS.some((verb) => {
    const re = new RegExp(`\\b${verb}\\b`)
    return re.test(lower)
  })
}

function hasExperienceWithBullets(data: ResumeData): boolean {
  return data.experience.some((e) => (e.description || '').trim().length > 0)
}

function totalSkills(data: ResumeData): number {
  return (
    data.skills.technical.length +
    data.skills.soft.length +
    data.skills.tools.length
  )
}

export interface AtsRule {
  label: string
  points: number
  earned: boolean
}

export interface AtsResult {
  score: number
  maxScore: number
  breakdown: AtsRule[]
  suggestions: string[]
}

const RULES = [
  { id: 'name', label: 'Name provided', points: 10 },
  { id: 'email', label: 'Email provided', points: 10 },
  { id: 'summary', label: 'Professional summary (>50 chars)', points: 10 },
  { id: 'experienceBullets', label: 'At least 1 experience with bullets', points: 15 },
  { id: 'education', label: 'At least 1 education entry', points: 10 },
  { id: 'skills', label: 'At least 5 skills', points: 10 },
  { id: 'project', label: 'At least 1 project', points: 10 },
  { id: 'phone', label: 'Phone provided', points: 5 },
  { id: 'linkedin', label: 'LinkedIn provided', points: 5 },
  { id: 'github', label: 'GitHub provided', points: 5 },
  { id: 'actionVerbs', label: 'Summary contains action verbs', points: 10 },
] as const

export function computeAtsScore(data: ResumeData): AtsResult {
  const nameOk = !!(data.personal.name || '').trim()
  const emailOk = !!(data.personal.email || '').trim()
  const summaryOk = (data.summary || '').trim().length > 50
  const experienceBulletsOk = hasExperienceWithBullets(data)
  const educationOk = data.education.length >= 1
  const skillsOk = totalSkills(data) >= 5
  const projectOk = data.projects.length >= 1
  const phoneOk = !!(data.personal.phone || '').trim()
  const linkedinOk = !!(data.links.linkedin || '').trim()
  const githubOk = !!(data.links.github || '').trim()
  const actionVerbsOk = summaryHasActionVerbs(data.summary || '')

  const checks = {
    name: nameOk,
    email: emailOk,
    summary: summaryOk,
    experienceBullets: experienceBulletsOk,
    education: educationOk,
    skills: skillsOk,
    project: projectOk,
    phone: phoneOk,
    linkedin: linkedinOk,
    github: githubOk,
    actionVerbs: actionVerbsOk,
  }

  let score = 0
  const breakdown: AtsRule[] = RULES.map((r) => {
    const earned = checks[r.id]
    if (earned) score += r.points
    return { label: r.label, points: r.points, earned }
  })

  const suggestions: string[] = []
  if (!nameOk) suggestions.push('Add your name (+10 points)')
  if (!emailOk) suggestions.push('Add your email (+10 points)')
  if (!summaryOk) suggestions.push('Add a professional summary over 50 characters (+10 points)')
  if (!experienceBulletsOk) suggestions.push('Add at least one experience entry with bullet points (+15 points)')
  if (!educationOk) suggestions.push('Add at least one education entry (+10 points)')
  if (!skillsOk) suggestions.push('Add at least 5 skills (+10 points)')
  if (!projectOk) suggestions.push('Add at least one project (+10 points)')
  if (!phoneOk) suggestions.push('Add your phone number (+5 points)')
  if (!linkedinOk) suggestions.push('Add your LinkedIn URL (+5 points)')
  if (!githubOk) suggestions.push('Add your GitHub URL (+5 points)')
  if (!actionVerbsOk && (data.summary || '').trim()) {
    suggestions.push('Use action verbs in your summary (e.g. built, led, designed, improved) (+10 points)')
  }

  return {
    score: Math.min(100, score),
    maxScore: 100,
    breakdown,
    suggestions,
  }
}

/** Band for display: 0-40 Needs Work (red), 41-70 Getting There (amber), 71-100 Strong (green) */
export function getAtsScoreBand(score: number): 'needsWork' | 'gettingThere' | 'strong' {
  if (score <= 40) return 'needsWork'
  if (score <= 70) return 'gettingThere'
  return 'strong'
}

export const ATS_BAND_LABELS: Record<ReturnType<typeof getAtsScoreBand>, string> = {
  needsWork: 'Needs Work',
  gettingThere: 'Getting There',
  strong: 'Strong Resume',
}
