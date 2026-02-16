import { useResume } from '@/context/ResumeContext'
import { useTemplate } from '@/context/TemplateContext'
import type { TemplateId } from '@/context/TemplateContext'

function ExternalLinkIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

const TEMPLATE_CLASSES: Record<TemplateId, { wrapper: string; header: string; section: string }> = {
  classic: {
    wrapper: 'p-8 max-w-[600px]',
    header: 'border-b border-black/20 pb-4 mb-4',
    section: 'mb-4',
  },
  modern: {
    wrapper: 'p-10 max-w-[620px]',
    header: 'border-b-2 border-black/30 pb-5 mb-6',
    section: 'mb-6',
  },
  minimal: {
    wrapper: 'p-6 max-w-[580px]',
    header: 'pb-3 mb-3',
    section: 'mb-3',
  },
}

/** Live preview shell for builder — structured placeholder layout. */
export function ResumePreviewShell() {
  const { data } = useResume()
  const { template, accentColor } = useTemplate()
  const tc = TEMPLATE_CLASSES[template]
  const style = { '--resume-accent': accentColor } as React.CSSProperties

  const sectionHeadingClass =
    template === 'minimal'
      ? 'text-xs font-semibold uppercase tracking-wider text-black/50 mb-2'
      : 'text-xs font-semibold uppercase tracking-wider mb-2'
  const sectionHeadingStyle = template !== 'minimal' ? { color: accentColor } : undefined

  const headerBorderClass =
    template === 'classic'
      ? 'border-b pb-4 mb-4'
      : template === 'modern'
        ? 'border-b-2 pb-5 mb-6'
        : 'pb-3 mb-3 border-b border-black/10'

  if (template === 'modern') {
    const sidebarBg = { backgroundColor: accentColor }
    return (
      <div
        className="h-full min-h-[700px] rounded-lg border border-slate-700/60 bg-white text-white overflow-auto"
        style={style}
      >
        <div className="flex max-w-[620px] mx-auto font-resume text-sm min-h-full">
          <aside className="w-[36%] shrink-0 p-5 text-white/95" style={sidebarBg}>
            <header className="mb-4">
              <h1 className="text-lg font-semibold tracking-tight">
                {data.personal.name || 'Your Name'}
              </h1>
              <div className="flex flex-col gap-0.5 text-xs text-white/80 mt-2">
                {data.personal.email && <span>{data.personal.email}</span>}
                {data.personal.phone && <span>{data.personal.phone}</span>}
                {data.personal.location && <span>{data.personal.location}</span>}
              </div>
            </header>
            {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || data.skills.tools.length > 0) && (
              <section className="mt-4">
                <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/70 mb-2">Skills</h2>
                <div className="flex flex-wrap gap-1">
                  {[...data.skills.technical, ...data.skills.soft, ...data.skills.tools].map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded text-xs bg-white/20">
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}
            {(data.links.github || data.links.linkedin) && (
              <section className="mt-4">
                <h2 className="text-[10px] font-semibold uppercase tracking-wider text-white/70 mb-1">Links</h2>
                <div className="flex flex-col gap-0.5 text-xs">
                  {data.links.github && <a href={data.links.github.startsWith('http') ? data.links.github : `https://${data.links.github}`} className="underline text-white/90">GitHub</a>}
                  {data.links.linkedin && <a href={data.links.linkedin.startsWith('http') ? data.links.linkedin : `https://${data.links.linkedin}`} className="underline text-white/90">LinkedIn</a>}
                </div>
              </section>
            )}
          </aside>
          <div className="flex-1 p-6 text-black">
            {data.summary && (
              <section className={tc.section}>
                <h2 className={sectionHeadingClass} style={sectionHeadingStyle}>Summary</h2>
                <p className="text-black/90 leading-relaxed text-sm">{data.summary}</p>
              </section>
            )}
            {data.education.length > 0 && (
              <section className={tc.section}>
                <h2 className={sectionHeadingClass} style={sectionHeadingStyle}>Education</h2>
                {data.education.map((e) => (
                  <div key={e.id} className="mb-3">
                    <div className="font-medium text-sm">{e.school || 'School'}</div>
                    <div className="text-black/70 text-xs">
                      {[e.degree, e.field].filter(Boolean).join(' in ')}
                      {(e.degree || e.field) && (e.startDate || e.endDate) && ' · '}
                      {[e.startDate, e.endDate].filter(Boolean).join(' – ')}
                    </div>
                  </div>
                ))}
              </section>
            )}
            {data.experience.length > 0 && (
              <section className={tc.section}>
                <h2 className={sectionHeadingClass} style={sectionHeadingStyle}>Experience</h2>
                {data.experience.map((e) => (
                  <div key={e.id} className="mb-3">
                    <div className="font-medium text-sm">{e.company || 'Company'}</div>
                    <div className="text-black/70 text-xs">
                      {e.title}
                      {(e.title && e.location) && ' · '}
                      {e.location}
                      {(e.title || e.location) && (e.startDate || e.endDate) && ' · '}
                      {[e.startDate, e.endDate].filter(Boolean).join(' – ')}
                    </div>
                    {e.description && <p className="mt-1 text-black/80 text-xs leading-relaxed">{e.description}</p>}
                  </div>
                ))}
              </section>
            )}
            {data.projects.length > 0 && (
              <section className={tc.section}>
                <h2 className={sectionHeadingClass} style={sectionHeadingStyle}>Projects</h2>
                <div className="space-y-2">
                  {data.projects.map((p) => (
                    <div key={p.id} className="p-2 rounded border border-black/10 bg-black/[0.02]">
                      <div className="font-medium text-sm flex items-center gap-2 flex-wrap">
                        <span>{p.title || 'Project'}</span>
                        {(p.liveUrl || p.githubUrl) && (
                          <span className="flex gap-1.5 text-black/60">
                            {p.liveUrl && <a href={p.liveUrl.startsWith('http') ? p.liveUrl : `https://${p.liveUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex"><ExternalLinkIcon /></a>}
                            {p.githubUrl && <a href={p.githubUrl.startsWith('http') ? p.githubUrl : `https://${p.githubUrl}`} target="_blank" rel="noopener noreferrer" className="inline-flex"><GitHubIcon /></a>}
                          </span>
                        )}
                      </div>
                      {p.description && <p className="text-black/80 text-xs leading-relaxed mt-0.5">{p.description}</p>}
                      {p.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {p.techStack.map((t) => (
                            <span key={t} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/10 text-black/80">{t}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="h-full min-h-[700px] rounded-lg border border-slate-700/60 bg-white text-black overflow-auto"
      style={style}
    >
      <div className={`${tc.wrapper} mx-auto font-resume text-sm`}>
        <header className={`${headerBorderClass}`} style={template !== 'minimal' ? { borderColor: accentColor } : undefined}>
          <h1 className={`text-xl font-semibold tracking-tight ${template === 'classic' ? 'font-resume' : ''}`} style={template !== 'minimal' ? { color: accentColor } : undefined}>
            {data.personal.name || 'Your Name'}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-0 text-xs text-black/70 mt-1">
            {[data.personal.email, data.personal.phone, data.personal.location]
              .filter(Boolean)
              .join(' · ') || 'Email · Phone · Location'}
          </div>
        </header>

        {data.summary && (
          <section className={tc.section}>
            <h2 className={sectionHeadingClass} style={sectionHeadingStyle}>
              Summary
            </h2>
            <p className="text-black/90 leading-relaxed">{data.summary}</p>
          </section>
        )}

        {data.education.length > 0 && (
          <section className={tc.section}>
            <h2 className={sectionHeadingClass} style={sectionHeadingStyle}>
              Education
            </h2>
            {data.education.map((e) => (
              <div key={e.id} className="mb-3">
                <div className="font-medium">{e.school || 'School'}</div>
                <div className="text-black/70">
                  {[e.degree, e.field].filter(Boolean).join(' in ')}
                  {(e.degree || e.field) && (e.startDate || e.endDate) && ' · '}
                  {[e.startDate, e.endDate].filter(Boolean).join(' – ')}
                </div>
              </div>
            ))}
          </section>
        )}

        {data.experience.length > 0 && (
          <section className={tc.section}>
            <h2 className={sectionHeadingClass} style={sectionHeadingStyle}>
              Experience
            </h2>
            {data.experience.map((e) => (
              <div key={e.id} className="mb-3">
                <div className="font-medium">{e.company || 'Company'}</div>
                <div className="text-black/70">
                  {e.title}
                  {(e.title && e.location) && ' · '}
                  {e.location}
                  {(e.title || e.location) && (e.startDate || e.endDate) && ' · '}
                  {[e.startDate, e.endDate].filter(Boolean).join(' – ')}
                </div>
                {e.description && (
                  <p className="mt-1 text-black/80 leading-relaxed">{e.description}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {data.projects.length > 0 && (
          <section className={tc.section}>
            <h2 className={sectionHeadingClass} style={sectionHeadingStyle}>
              Projects
            </h2>
            <div className="space-y-3">
              {data.projects.map((p) => (
                <div key={p.id} className="p-3 rounded-lg border border-black/10 bg-black/[0.02]">
                  <div className="font-medium flex items-center gap-2 flex-wrap">
                    <span>{p.title || 'Project'}</span>
                    {(p.liveUrl || p.githubUrl) && (
                      <span className="flex gap-1.5 text-black/60">
                        {p.liveUrl && (
                          <a
                            href={p.liveUrl.startsWith('http') ? p.liveUrl : `https://${p.liveUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 hover:text-black"
                            aria-label="Live site"
                          >
                            <ExternalLinkIcon />
                          </a>
                        )}
                        {p.githubUrl && (
                          <a
                            href={p.githubUrl.startsWith('http') ? p.githubUrl : `https://${p.githubUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 hover:text-black"
                            aria-label="GitHub"
                          >
                            <GitHubIcon />
                          </a>
                        )}
                      </span>
                    )}
                  </div>
                  {p.description && (
                    <p className="text-black/80 text-sm leading-relaxed mt-1">{p.description}</p>
                  )}
                  {p.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {p.techStack.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded text-xs font-medium bg-black/10 text-black/80"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || data.skills.tools.length > 0) && (
          <section className={tc.section}>
            <h2 className={sectionHeadingClass} style={sectionHeadingStyle}>
              Skills
            </h2>
            <div className="space-y-2">
              {data.skills.technical.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-black/50 mb-1">Technical</div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.skills.technical.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-full text-xs font-medium bg-black/10 text-black/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.skills.soft.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-black/50 mb-1">Soft</div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.skills.soft.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-full text-xs font-medium bg-black/10 text-black/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.skills.tools.length > 0 && (
                <div>
                  <div className="text-xs font-medium text-black/50 mb-1">Tools & Technologies</div>
                  <div className="flex flex-wrap gap-1.5">
                    {data.skills.tools.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded-full text-xs font-medium bg-black/10 text-black/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {(data.links.github || data.links.linkedin) && (
          <section className={`${tc.section} mt-4`}>
            <h2 className={sectionHeadingClass} style={sectionHeadingStyle}>
              Links
            </h2>
            <div className="flex gap-4 text-sm">
              {data.links.github && (
                <a href={data.links.github.startsWith('http') ? data.links.github : `https://${data.links.github}`} className="underline">
                  GitHub
                </a>
              )}
              {data.links.linkedin && (
                <a href={data.links.linkedin.startsWith('http') ? data.links.linkedin : `https://${data.links.linkedin}`} className="underline">
                  LinkedIn
                </a>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
