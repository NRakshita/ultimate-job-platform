import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'
import {
  ResumeData,
  emptyResume,
  emptySkills,
  emptyProject,
  sampleResume,
  EducationEntry,
  ExperienceEntry,
  ProjectEntry,
  SkillCategory,
  SkillsByCategory,
} from '@/types/resume'

const STORAGE_KEY = 'resumeBuilderData'

function normalizeSkills(parsed: unknown): SkillsByCategory {
  if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
    const o = parsed as Record<string, unknown>
    return {
      technical: Array.isArray(o.technical) ? o.technical : [],
      soft: Array.isArray(o.soft) ? o.soft : [],
      tools: Array.isArray(o.tools) ? o.tools : [],
    }
  }
  if (Array.isArray(parsed)) {
    return { ...emptySkills, technical: parsed as string[] }
  }
  return { ...emptySkills }
}

function normalizeProject(p: unknown): ProjectEntry {
  if (p && typeof p === 'object') {
    const o = p as Record<string, unknown>
    const id = typeof o.id === 'string' ? o.id : crypto.randomUUID()
    const title = typeof o.title === 'string' ? o.title : (typeof o.name === 'string' ? o.name : '')
    const description = typeof o.description === 'string' ? o.description : ''
    const techStack = Array.isArray(o.techStack) ? (o.techStack as string[]) : []
    const liveUrl = typeof o.liveUrl === 'string' ? o.liveUrl : ''
    const githubUrl = typeof o.githubUrl === 'string' ? o.githubUrl : (typeof o.url === 'string' ? o.url : '')
    return { id, title, description, techStack, liveUrl, githubUrl }
  }
  return emptyProject()
}

function loadFromStorage(): ResumeData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Record<string, unknown>
    if (!parsed || typeof parsed !== 'object') return null
    const projects = Array.isArray(parsed.projects)
      ? (parsed.projects as unknown[]).map(normalizeProject)
      : []
    return {
      personal: {
        ...emptyResume.personal,
        ...(parsed.personal && typeof parsed.personal === 'object'
          ? parsed.personal
          : {}),
      },
      summary: typeof parsed.summary === 'string' ? parsed.summary : '',
      education: Array.isArray(parsed.education) ? parsed.education : [],
      experience: Array.isArray(parsed.experience) ? parsed.experience : [],
      projects,
      skills: normalizeSkills(parsed.skills),
      links: {
        ...emptyResume.links,
        ...(parsed.links && typeof parsed.links === 'object' ? parsed.links : {}),
      },
    }
  } catch {
    return null
  }
}

function saveToStorage(data: ResumeData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore
  }
}

export interface ResumeContextValue {
  data: ResumeData
  updatePersonal: (patch: Partial<ResumeData['personal']>) => void
  setSummary: (v: string) => void
  setEducation: (entries: EducationEntry[]) => void
  addEducation: () => void
  removeEducation: (id: string) => void
  updateEducation: (id: string, patch: Partial<EducationEntry>) => void
  setExperience: (entries: ExperienceEntry[]) => void
  addExperience: () => void
  removeExperience: (id: string) => void
  updateExperience: (id: string, patch: Partial<ExperienceEntry>) => void
  setProjects: (entries: ProjectEntry[]) => void
  addProject: () => string
  removeProject: (id: string) => void
  updateProject: (id: string, patch: Partial<ProjectEntry>) => void
  addSkill: (category: SkillCategory, skill: string) => void
  removeSkill: (category: SkillCategory, skill: string) => void
  suggestSkills: () => void
  updateLinks: (patch: Partial<ResumeData['links']>) => void
  loadSample: () => void
}

const ResumeContext = createContext<ResumeContextValue | null>(null)

function ensureIds(data: ResumeData): ResumeData {
  const ensure = (id: string) => id || crypto.randomUUID()
  return {
    ...data,
    education: (data.education ?? []).map((e) => ({ ...e, id: ensure(e.id) })),
    experience: (data.experience ?? []).map((e) => ({ ...e, id: ensure(e.id) })),
    projects: (data.projects ?? []).map((p) => ({ ...p, id: ensure(p.id) })),
  }
}

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<ResumeData>(() => {
    const stored = loadFromStorage()
    if (stored) return ensureIds({ ...emptyResume, ...stored })
    return emptyResume
  })

  useEffect(() => {
    saveToStorage(data)
  }, [data])

  const updatePersonal = useCallback((patch: Partial<ResumeData['personal']>) => {
    setData((d) => ({
      ...d,
      personal: { ...d.personal, ...patch },
    }))
  }, [])

  const setSummary = useCallback((v: string) => {
    setData((d) => ({ ...d, summary: v }))
  }, [])

  const setEducation = useCallback((entries: EducationEntry[]) => {
    setData((d) => ({ ...d, education: entries }))
  }, [])

  const addEducation = useCallback(() => {
    setData((d) => ({
      ...d,
      education: [
        ...d.education,
        {
          id: crypto.randomUUID(),
          school: '',
          degree: '',
          field: '',
          location: '',
          startDate: '',
          endDate: '',
        },
      ],
    }))
  }, [])

  const removeEducation = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      education: d.education.filter((e) => e.id !== id),
    }))
  }, [])

  const updateEducation = useCallback((id: string, patch: Partial<EducationEntry>) => {
    setData((d) => ({
      ...d,
      education: d.education.map((e) =>
        e.id === id ? { ...e, ...patch } : e
      ),
    }))
  }, [])

  const setExperience = useCallback((entries: ExperienceEntry[]) => {
    setData((d) => ({ ...d, experience: entries }))
  }, [])

  const addExperience = useCallback(() => {
    setData((d) => ({
      ...d,
      experience: [
        ...d.experience,
        {
          id: crypto.randomUUID(),
          company: '',
          title: '',
          location: '',
          startDate: '',
          endDate: '',
          description: '',
        },
      ],
    }))
  }, [])

  const removeExperience = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      experience: d.experience.filter((e) => e.id !== id),
    }))
  }, [])

  const updateExperience = useCallback((id: string, patch: Partial<ExperienceEntry>) => {
    setData((d) => ({
      ...d,
      experience: d.experience.map((e) =>
        e.id === id ? { ...e, ...patch } : e
      ),
    }))
  }, [])

  const setProjects = useCallback((entries: ProjectEntry[]) => {
    setData((d) => ({ ...d, projects: entries }))
  }, [])

  const addProject = useCallback((): string => {
    const entry = emptyProject()
    setData((d) => ({
      ...d,
      projects: [...d.projects, entry],
    }))
    return entry.id
  }, [])

  const removeProject = useCallback((id: string) => {
    setData((d) => ({
      ...d,
      projects: d.projects.filter((p) => p.id !== id),
    }))
  }, [])

  const updateProject = useCallback((id: string, patch: Partial<ProjectEntry>) => {
    setData((d) => ({
      ...d,
      projects: d.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }))
  }, [])

  const addSkill = useCallback((category: SkillCategory, skill: string) => {
    const trimmed = skill.trim()
    if (!trimmed) return
    setData((d) => {
      const list = d.skills[category]
      if (list.includes(trimmed)) return d
      return {
        ...d,
        skills: { ...d.skills, [category]: [...list, trimmed] },
      }
    })
  }, [])

  const removeSkill = useCallback((category: SkillCategory, skill: string) => {
    setData((d) => ({
      ...d,
      skills: {
        ...d.skills,
        [category]: d.skills[category].filter((s) => s !== skill),
      },
    }))
  }, [])

  const suggestSkills = useCallback(() => {
    setData((d) => {
      const merge = (current: string[], suggested: string[]) => {
        const set = new Set(current)
        suggested.forEach((s) => set.add(s))
        return [...set]
      }
      return {
        ...d,
        skills: {
          technical: merge(d.skills.technical, ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'GraphQL']),
          soft: merge(d.skills.soft, ['Team Leadership', 'Problem Solving']),
          tools: merge(d.skills.tools, ['Git', 'Docker', 'AWS']),
        },
      }
    })
  }, [])

  const updateLinks = useCallback((patch: Partial<ResumeData['links']>) => {
    setData((d) => ({
      ...d,
      links: { ...d.links, ...patch },
    }))
  }, [])

  const loadSample = useCallback(() => {
    setData(JSON.parse(JSON.stringify(sampleResume)))
  }, [])

  const value: ResumeContextValue = {
    data,
    updatePersonal,
    setSummary,
    setEducation,
    addEducation,
    removeEducation,
    updateEducation,
    setExperience,
    addExperience,
    removeExperience,
    updateExperience,
    setProjects,
    addProject,
    removeProject,
    updateProject,
    addSkill,
    removeSkill,
    suggestSkills,
    updateLinks,
    loadSample,
  }

  return (
    <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
  )
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within ResumeProvider')
  return ctx
}
