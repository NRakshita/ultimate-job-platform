import type { ResumeData } from '@/types/resume'

export function isResumeIncomplete(data: ResumeData): boolean {
  const noName = !data.personal.name?.trim()
  const noProject = data.projects.length === 0
  const noExperience = data.experience.length === 0
  return noName || (noProject && noExperience)
}
