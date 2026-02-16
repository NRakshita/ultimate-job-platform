import type { ResumeData } from '@/types/resume'

const NUMERIC_PATTERN = /[\d%€$£¥kKmMxX]+/

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length
}

function hasNumbers(data: ResumeData): boolean {
  const texts: string[] = []
  data.experience.forEach((e) => texts.push(e.description))
  data.projects.forEach((p) => texts.push(p.description))
  return texts.some((t) => t && NUMERIC_PATTERN.test(t))
}

export function getTopImprovements(data: ResumeData): string[] {
  const out: string[] = []

  if (data.projects.length < 2) {
    out.push('Add at least 2 projects.')
  }
  if (!hasNumbers(data) && (data.experience.length > 0 || data.projects.length > 0)) {
    out.push('Add measurable impact (numbers) to experience or project bullets.')
  }
  if (wordCount(data.summary) < 40 && data.summary.trim()) {
    out.push('Expand summary to 40+ words.')
  } else if (!data.summary.trim()) {
    out.push('Write a summary (target 40+ words).')
  }
  const totalSkills = data.skills.technical.length + data.skills.soft.length + data.skills.tools.length
  if (totalSkills < 8) {
    out.push('Add more skills (target 8+).')
  }
  if (data.experience.length === 0) {
    out.push('Add internship or project work as experience.')
  }

  return out.slice(0, 3)
}
