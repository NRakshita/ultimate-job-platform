export interface PersonalInfo {
  name: string
  email: string
  phone: string
  location: string
}

export interface EducationEntry {
  id: string
  school: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
}

export interface ExperienceEntry {
  id: string
  company: string
  title: string
  location: string
  startDate: string
  endDate: string
  description: string
}

export interface ProjectEntry {
  id: string
  title: string
  description: string
  techStack: string[]
  liveUrl: string
  githubUrl: string
}

export type SkillCategory = 'technical' | 'soft' | 'tools'

export interface SkillsByCategory {
  technical: string[]
  soft: string[]
  tools: string[]
}

export interface Links {
  github: string
  linkedin: string
}

export interface ResumeData {
  personal: PersonalInfo
  summary: string
  education: EducationEntry[]
  experience: ExperienceEntry[]
  projects: ProjectEntry[]
  skills: SkillsByCategory
  links: Links
}

export const emptyPersonal: PersonalInfo = {
  name: '',
  email: '',
  phone: '',
  location: '',
}

export const emptyEducation = (): EducationEntry => ({
  id: crypto.randomUUID(),
  school: '',
  degree: '',
  field: '',
  location: '',
  startDate: '',
  endDate: '',
})

export const emptyExperience = (): ExperienceEntry => ({
  id: crypto.randomUUID(),
  company: '',
  title: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
})

export const emptyProject = (): ProjectEntry => ({
  id: crypto.randomUUID(),
  title: '',
  description: '',
  techStack: [],
  liveUrl: '',
  githubUrl: '',
})

export const emptyLinks: Links = {
  github: '',
  linkedin: '',
}

export const emptySkills: SkillsByCategory = {
  technical: [],
  soft: [],
  tools: [],
}

export const emptyResume: ResumeData = {
  personal: { ...emptyPersonal },
  summary: '',
  education: [],
  experience: [],
  projects: [],
  skills: { ...emptySkills },
  links: { ...emptyLinks },
}

export const sampleResume: ResumeData = {
  personal: {
    name: 'Alex Chen',
    email: 'alex.chen@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
  },
  summary:
    'Senior software engineer with 8+ years of experience building scalable web applications. Passionate about clean architecture and developer experience.',
  education: [
    {
      id: crypto.randomUUID(),
      school: 'Stanford University',
      degree: 'B.S.',
      field: 'Computer Science',
      location: 'Stanford, CA',
      startDate: '2012',
      endDate: '2016',
    },
  ],
  experience: [
    {
      id: crypto.randomUUID(),
      company: 'Tech Corp',
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      startDate: '2020',
      endDate: 'Present',
      description:
        'Led development of core platform services. Mentored junior engineers and improved CI/CD pipelines.',
    },
    {
      id: crypto.randomUUID(),
      company: 'StartupXYZ',
      title: 'Software Engineer',
      location: 'Remote',
      startDate: '2016',
      endDate: '2020',
      description:
        'Built and maintained customer-facing web applications. Contributed to product roadmap and architecture decisions.',
    },
  ],
  projects: [
    {
      id: crypto.randomUUID(),
      title: 'Open Source Library',
      description: 'Popular open-source utility library with 10k+ stars.',
      techStack: ['TypeScript', 'React'],
      liveUrl: '',
      githubUrl: 'github.com/example/lib',
    },
  ],
  skills: {
    technical: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    soft: ['Team Leadership', 'Problem Solving'],
    tools: ['Git', 'AWS'],
  },
  links: {
    github: 'github.com/alexchen',
    linkedin: 'linkedin.com/in/alexchen',
  },
}
