import { useState, useCallback, KeyboardEvent } from 'react'
import { useResume } from '@/context/ResumeContext'
import { BulletGuidanceHint } from './BulletGuidanceHint'
import type { SkillCategory } from '@/types/resume'

const SKILL_CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: 'technical', label: 'Technical Skills' },
  { id: 'soft', label: 'Soft Skills' },
  { id: 'tools', label: 'Tools & Technologies' },
]

function SkillTagInput({
  category: _category,
  skills,
  onAdd,
  onRemove,
}: {
  category: SkillCategory
  skills: string[]
  onAdd: (s: string) => void
  onRemove: (s: string) => void
}) {
  const [input, setInput] = useState('')
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = input.trim()
      if (trimmed) {
        onAdd(trimmed)
        setInput('')
      }
    }
  }
  return (
    <div className="flex flex-wrap gap-2 p-2 rounded-md border border-slate-700 bg-slate-900/30 min-h-[40px]">
      {skills.map((s) => (
        <span
          key={s}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-700 text-slate-200"
        >
          {s}
          <button
            type="button"
            onClick={() => onRemove(s)}
            className="ml-0.5 rounded hover:bg-slate-600 text-slate-400 hover:text-white leading-none p-0.5"
            aria-label={`Remove ${s}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type skill and press Enter"
        className="flex-1 min-w-[120px] px-2 py-1 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 text-slate-200 placeholder-slate-500"
      />
    </div>
  )
}

function TechStackInput({
  techStack,
  onChange,
}: {
  techStack: string[]
  onChange: (techStack: string[]) => void
}) {
  const [input, setInput] = useState('')
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const trimmed = input.trim()
      if (trimmed && !techStack.includes(trimmed)) {
        onChange([...techStack, trimmed])
        setInput('')
      }
    }
  }
  const remove = (s: string) => onChange(techStack.filter((t) => t !== s))
  return (
    <div className="flex flex-wrap gap-2 p-2 rounded-md border border-slate-700 bg-slate-900/30 min-h-[36px]">
      {techStack.map((s) => (
        <span
          key={s}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-200"
        >
          {s}
          <button type="button" onClick={() => remove(s)} className="rounded hover:bg-slate-600 text-slate-400 hover:text-white leading-none p-0.5" aria-label={`Remove ${s}`}>×</button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tech and press Enter"
        className="flex-1 min-w-[80px] px-2 py-0.5 text-sm bg-transparent border-0 focus:outline-none text-slate-200 placeholder-slate-500"
      />
    </div>
  )
}

const DESCRIPTION_MAX = 200

export function ResumeForm() {
  const {
    data,
    updatePersonal,
    setSummary,
    addEducation,
    removeEducation,
    updateEducation,
    addExperience,
    removeExperience,
    updateExperience,
    addProject,
    removeProject,
    updateProject,
    addSkill,
    removeSkill,
    suggestSkills,
    updateLinks,
    loadSample,
  } = useResume()

  const [skillsOpen, setSkillsOpen] = useState<SkillCategory | null>('technical')
  const [projectsOpen, setProjectsOpen] = useState<Set<string>>(new Set())
  const [suggestLoading, setSuggestLoading] = useState(false)

  const toggleProject = useCallback((id: string) => {
    setProjectsOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const onSuggestSkills = useCallback(() => {
    setSuggestLoading(true)
    setTimeout(() => {
      suggestSkills()
      setSuggestLoading(false)
    }, 1000)
  }, [suggestSkills])

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={loadSample}
          className="px-4 py-2 text-sm font-medium rounded-md border border-slate-600 text-slate-300 hover:bg-slate-800/50 transition-colors"
        >
          Load Sample Data
        </button>
      </div>

      <section>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
          Personal Info
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Full name"
            value={data.personal.name}
            onChange={(e) => updatePersonal({ name: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-600"
          />
          <input
            type="email"
            placeholder="Email"
            value={data.personal.email}
            onChange={(e) => updatePersonal({ email: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-600"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={data.personal.phone}
            onChange={(e) => updatePersonal({ phone: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-600"
          />
          <input
            type="text"
            placeholder="Location"
            value={data.personal.location}
            onChange={(e) => updatePersonal({ location: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-600"
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
          Summary
        </h2>
        <textarea
          placeholder="Professional summary"
          value={data.summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
          className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-600 resize-none"
        />
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Education
          </h2>
          <button
            type="button"
            onClick={addEducation}
            className="text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            + Add
          </button>
        </div>
        <div className="space-y-4">
          {data.education.map((e) => (
            <div key={e.id} className="p-4 rounded-md border border-slate-700/60 space-y-2">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeEducation(e.id)}
                  className="text-xs text-slate-500 hover:text-rose-400"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="School"
                value={e.school}
                onChange={(ev) => updateEducation(e.id, { school: ev.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Degree"
                  value={e.degree}
                  onChange={(ev) => updateEducation(e.id, { degree: ev.target.value })}
                  className="px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md"
                />
                <input
                  type="text"
                  placeholder="Field"
                  value={e.field}
                  onChange={(ev) => updateEducation(e.id, { field: ev.target.value })}
                  className="px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md"
                />
              </div>
              <input
                type="text"
                placeholder="Location"
                value={e.location}
                onChange={(ev) => updateEducation(e.id, { location: ev.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Start"
                  value={e.startDate}
                  onChange={(ev) => updateEducation(e.id, { startDate: ev.target.value })}
                  className="px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md"
                />
                <input
                  type="text"
                  placeholder="End"
                  value={e.endDate}
                  onChange={(ev) => updateEducation(e.id, { endDate: ev.target.value })}
                  className="px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Experience
          </h2>
          <button
            type="button"
            onClick={addExperience}
            className="text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            + Add
          </button>
        </div>
        <div className="space-y-4">
          {data.experience.map((e) => (
            <div key={e.id} className="p-4 rounded-md border border-slate-700/60 space-y-2">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => removeExperience(e.id)}
                  className="text-xs text-slate-500 hover:text-rose-400"
                >
                  Remove
                </button>
              </div>
              <input
                type="text"
                placeholder="Company"
                value={e.company}
                onChange={(ev) => updateExperience(e.id, { company: ev.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md"
              />
              <input
                type="text"
                placeholder="Title"
                value={e.title}
                onChange={(ev) => updateExperience(e.id, { title: ev.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md"
              />
              <input
                type="text"
                placeholder="Location"
                value={e.location}
                onChange={(ev) => updateExperience(e.id, { location: ev.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Start"
                  value={e.startDate}
                  onChange={(ev) => updateExperience(e.id, { startDate: ev.target.value })}
                  className="px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md"
                />
                <input
                  type="text"
                  placeholder="End"
                  value={e.endDate}
                  onChange={(ev) => updateExperience(e.id, { endDate: ev.target.value })}
                  className="px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md"
                />
              </div>
              <textarea
                placeholder="Description (one bullet per line)"
                value={e.description}
                onChange={(ev) => updateExperience(e.id, { description: ev.target.value })}
                rows={3}
                className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md resize-none"
              />
              {e.description.trim() && <BulletGuidanceHint text={e.description} />}
            </div>
          ))}
        </div>
      </section>

      {/* Skills accordion */}
      <section>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Skills
          </h2>
          <button
            type="button"
            onClick={onSuggestSkills}
            disabled={suggestLoading}
            className="text-xs font-medium px-3 py-1.5 rounded-md border border-slate-600 text-slate-300 hover:bg-slate-800/50 transition-colors disabled:opacity-60"
          >
            {suggestLoading ? 'Adding…' : '✨ Suggest Skills'}
          </button>
        </div>
        <div className="border border-slate-700/60 rounded-md overflow-hidden">
          {SKILL_CATEGORIES.map(({ id, label }) => {
            const isOpen = skillsOpen === id
            const list = data.skills[id]
            const count = list.length
            return (
              <div key={id} className="border-b border-slate-700/60 last:border-b-0">
                <button
                  type="button"
                  onClick={() => setSkillsOpen(isOpen ? null : id)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-200 hover:bg-slate-800/40 transition-colors"
                >
                  <span>
                    {label} {count > 0 && `(${count})`}
                  </span>
                  <span className="text-slate-500">{isOpen ? '▼' : '▶'}</span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-0">
                    <SkillTagInput
                      category={id}
                      skills={list}
                      onAdd={(s) => addSkill(id, s)}
                      onRemove={(s) => removeSkill(id, s)}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Projects accordion */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide">
            Projects
          </h2>
          <button
            type="button"
            onClick={() => {
              const id = addProject()
              setProjectsOpen((prev) => new Set([...prev, id]))
            }}
            className="text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            + Add Project
          </button>
        </div>
        <div className="space-y-2">
          {data.projects.map((p) => {
            const isOpen = projectsOpen.has(p.id)
            const title = p.title.trim() || 'Untitled Project'
            return (
              <div key={p.id} className="rounded-md border border-slate-700/60 overflow-hidden">
                <div className="flex items-center justify-between bg-slate-800/30">
                  <button
                    type="button"
                    onClick={() => toggleProject(p.id)}
                    className="flex-1 flex items-center justify-between px-4 py-3 text-left text-sm font-medium text-slate-200 hover:bg-slate-800/40 transition-colors"
                  >
                    <span className="truncate">{title}</span>
                    <span className="text-slate-500 ml-2 shrink-0">{isOpen ? '▼' : '▶'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProject(p.id)}
                    className="p-3 text-slate-500 hover:text-rose-400 transition-colors"
                    aria-label="Delete project"
                  >
                    Delete
                  </button>
                </div>
                {isOpen && (
                  <div className="p-4 space-y-3 border-t border-slate-700/60">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Project Title</label>
                      <input
                        type="text"
                        placeholder="Project name"
                        value={p.title}
                        onChange={(ev) => updateProject(p.id, { title: ev.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">
                        Description ({p.description.length}/{DESCRIPTION_MAX})
                      </label>
                      <textarea
                        placeholder="Brief description"
                        value={p.description}
                        onChange={(ev) =>
                          updateProject(p.id, {
                            description: ev.target.value.slice(0, DESCRIPTION_MAX),
                          })
                        }
                        maxLength={DESCRIPTION_MAX}
                        rows={3}
                        className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md text-slate-200 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Tech Stack</label>
                      <TechStackInput
                        techStack={p.techStack}
                        onChange={(techStack) => updateProject(p.id, { techStack })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Live URL (optional)</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={p.liveUrl}
                        onChange={(ev) => updateProject(p.id, { liveUrl: ev.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md text-slate-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">GitHub URL (optional)</label>
                      <input
                        type="url"
                        placeholder="https://github.com/..."
                        value={p.githubUrl}
                        onChange={(ev) => updateProject(p.id, { githubUrl: ev.target.value })}
                        className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md text-slate-200"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
          Links
        </h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="GitHub"
            value={data.links.github}
            onChange={(e) => updateLinks({ github: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md"
          />
          <input
            type="text"
            placeholder="LinkedIn"
            value={data.links.linkedin}
            onChange={(e) => updateLinks({ linkedin: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-900/50 border border-slate-700 rounded-md"
          />
        </div>
      </section>
    </div>
  )
}
