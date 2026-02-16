import type { ResumeData } from '@/types/resume'

export function resumeToPlainText(data: ResumeData): string {
  const lines: string[] = []

  lines.push(data.personal.name || 'Your Name')
  const contact = [data.personal.email, data.personal.phone, data.personal.location]
    .filter(Boolean)
    .join(' | ')
  if (contact) lines.push(contact)
  lines.push('')

  if (data.summary.trim()) {
    lines.push('Summary')
    lines.push(data.summary.trim())
    lines.push('')
  }

  if (data.education.length > 0) {
    lines.push('Education')
    data.education.forEach((e) => {
      const deg = [e.degree, e.field].filter(Boolean).join(' in ')
      const meta = [deg, e.school, e.location, [e.startDate, e.endDate].filter(Boolean).join(' – ')]
        .filter(Boolean)
        .join(' · ')
      lines.push(meta)
    })
    lines.push('')
  }

  if (data.experience.length > 0) {
    lines.push('Experience')
    data.experience.forEach((e) => {
      const header = [e.company, e.title, e.location].filter(Boolean).join(' · ')
      lines.push(header)
      if (e.startDate || e.endDate) {
        lines.push([e.startDate, e.endDate].filter(Boolean).join(' – '))
      }
      if (e.description.trim()) {
        lines.push(e.description.trim())
      }
      lines.push('')
    })
  }

  if (data.projects.length > 0) {
    lines.push('Projects')
    data.projects.forEach((p) => {
      lines.push(p.title || 'Project')
      if (p.liveUrl) lines.push(p.liveUrl)
      if (p.githubUrl) lines.push(p.githubUrl)
      if (p.description.trim()) lines.push(p.description.trim())
      if (p.techStack.length > 0) lines.push(p.techStack.join(', '))
      lines.push('')
    })
  }

  const allSkills = [...data.skills.technical, ...data.skills.soft, ...data.skills.tools]
  if (allSkills.length > 0) {
    lines.push('Skills')
    lines.push(allSkills.join(', '))
    lines.push('')
  }

  if (data.links.github || data.links.linkedin) {
    lines.push('Links')
    if (data.links.github) lines.push(`GitHub: ${data.links.github}`)
    if (data.links.linkedin) lines.push(`LinkedIn: ${data.links.linkedin}`)
  }

  return lines.join('\n').trim()
}
