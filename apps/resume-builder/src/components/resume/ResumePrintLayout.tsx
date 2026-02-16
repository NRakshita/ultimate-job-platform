import { useResume } from '@/context/ResumeContext'
import { useTemplate } from '@/context/TemplateContext'
import type { TemplateId } from '@/context/TemplateContext'

const TEMPLATE_CLASSES: Record<TemplateId, { container: string; header: string; section: string }> = {
  classic: {
    container: 'px-12 py-16',
    header: 'border-b pb-6 mb-6',
    section: 'mb-8',
  },
  modern: {
    container: 'px-0 py-0',
    header: 'border-b-2 pb-8 mb-8',
    section: 'mb-10',
  },
  minimal: {
    container: 'px-10 py-12',
    header: 'border-b border-black/30 pb-4 mb-4',
    section: 'mb-5',
  },
}

const h2Class = 'text-xs font-semibold uppercase tracking-[0.2em] mb-3'

/** Resume layout for /preview. Uses template and accent color. */
export function ResumePrintLayout() {
  const { data } = useResume()
  const { template, accentColor } = useTemplate()
  const tc = TEMPLATE_CLASSES[template]
  const accentStyle = { color: accentColor, borderColor: accentColor }

  if (template === 'modern') {
    const sidebarBg = { backgroundColor: accentColor }
    return (
      <div className="bg-white text-black min-h-screen font-resume print:min-h-0 break-words" style={{ borderColor: accentColor }}>
        <div className="max-w-[210mm] mx-auto flex print:py-0 print:px-0">
          <aside className="w-[32%] shrink-0 py-10 px-8 text-white print:py-10 print:px-6" style={sidebarBg}>
            <header className="mb-6">
              <h1 className="text-xl font-semibold tracking-tight">{data.personal.name || 'Your Name'}</h1>
              <div className="flex flex-col gap-1 text-sm text-white/90 mt-2">
                {data.personal.email && <span>{data.personal.email}</span>}
                {data.personal.phone && <span>{data.personal.phone}</span>}
                {data.personal.location && <span>{data.personal.location}</span>}
              </div>
            </header>
            {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || data.skills.tools.length > 0) && (
              <section className="mb-6">
                <h2 className="text-[10px] font-semibold uppercase tracking-widest text-white/80 mb-2">Skills</h2>
                <p className="text-[13px] leading-relaxed text-white/95">
                  {[...data.skills.technical, ...data.skills.soft, ...data.skills.tools].join(', ')}
                </p>
              </section>
            )}
            {(data.links.github || data.links.linkedin) && (
              <section>
                <h2 className="text-[10px] font-semibold uppercase tracking-widest text-white/80 mb-1">Links</h2>
                <div className="flex flex-col gap-0.5 text-sm">
                  {data.links.github && <a href={data.links.github.startsWith('http') ? data.links.github : `https://${data.links.github}`} className="underline text-white/95">GitHub</a>}
                  {data.links.linkedin && <a href={data.links.linkedin.startsWith('http') ? data.links.linkedin : `https://${data.links.linkedin}`} className="underline text-white/95">LinkedIn</a>}
                </div>
              </section>
            )}
          </aside>
          <div className="flex-1 py-12 px-10 print:py-10 print:px-8">
            {data.summary && (
              <section className={tc.section}>
                <h2 className={h2Class} style={accentStyle}>Summary</h2>
                <p className="text-[15px] leading-relaxed text-black/90">{data.summary}</p>
              </section>
            )}
            {data.education.length > 0 && (
              <section className={tc.section}>
                <h2 className={h2Class} style={accentStyle}>Education</h2>
                {data.education.map((e) => (
                  <div key={e.id} className="mb-4">
                    <div className="font-semibold text-base">{e.school || 'School'}</div>
                    <div className="text-black/70 text-sm">
                      {[e.degree, e.field].filter(Boolean).join(' in ')}
                      {(e.degree || e.field) && (e.startDate || e.endDate) && ' · '}
                      {[e.startDate, e.endDate].filter(Boolean).join(' – ')}
                    </div>
                  </div>
                ))}
              </section>
            )}
            {data.experience.length > 0 && (
              <section className={`${tc.section} print-page`}>
                <h2 className={h2Class} style={accentStyle}>Experience</h2>
                {data.experience.map((e) => (
                  <div key={e.id} className="mb-6 print-page">
                    <div className="flex justify-between items-baseline gap-4">
                      <div className="font-semibold text-base">{e.company || 'Company'}</div>
                      <div className="text-black/60 text-sm shrink-0">{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</div>
                    </div>
                    <div className="text-black/70 text-sm mb-1">{e.title} · {e.location}</div>
                    {e.description && <p className="text-[15px] leading-relaxed text-black/85">{e.description}</p>}
                  </div>
                ))}
              </section>
            )}
            {data.projects.length > 0 && (
              <section className={`${tc.section} print-page`}>
                <h2 className={h2Class} style={accentStyle}>Projects</h2>
                {data.projects.map((p) => (
                  <div key={p.id} className="mb-4 print-page">
                    <div className="font-semibold text-base">
                      {p.liveUrl ? <a href={p.liveUrl.startsWith('http') ? p.liveUrl : `https://${p.liveUrl}`} className="underline underline-offset-2">{p.title || 'Project'}</a> : p.githubUrl ? <a href={p.githubUrl.startsWith('http') ? p.githubUrl : `https://${p.githubUrl}`} className="underline underline-offset-2">{p.title || 'Project'}</a> : (p.title || 'Project')}
                    </div>
                    {p.description && <p className="text-[15px] leading-relaxed text-black/85 mt-1">{p.description}</p>}
                    {p.techStack.length > 0 && <p className="text-[13px] text-black/70 mt-1">{p.techStack.join(', ')}</p>}
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white text-black min-h-screen font-resume print:min-h-0 break-words">
      <div className={`max-w-[210mm] mx-auto print:py-12 print:px-12 ${tc.container}`}>
        <header className={tc.header} style={template !== 'minimal' ? { borderColor: accentColor } : undefined}>
          <h1 className={`text-2xl font-semibold tracking-tight ${template === 'classic' ? 'font-resume' : ''}`} style={template !== 'minimal' ? { color: accentColor } : undefined}>
            {data.personal.name || 'Your Name'}
          </h1>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-black/70 mt-2">
            {data.personal.email && <span>{data.personal.email}</span>}
            {data.personal.phone && <span>{data.personal.phone}</span>}
            {data.personal.location && <span>{data.personal.location}</span>}
          </div>
        </header>

        {data.summary && (
          <section className={tc.section}>
            <h2 className={h2Class} style={template !== 'minimal' ? accentStyle : undefined}>Summary</h2>
            <p className="text-[15px] leading-relaxed text-black/90">{data.summary}</p>
          </section>
        )}

        {data.education.length > 0 && (
          <section className={tc.section}>
            <h2 className={h2Class} style={template !== 'minimal' ? accentStyle : undefined}>Education</h2>
            {data.education.map((e) => (
              <div key={e.id} className="mb-4">
                <div className="font-semibold text-base">{e.school || 'School'}</div>
                <div className="text-black/70 text-sm">
                  {[e.degree, e.field].filter(Boolean).join(' in ')}
                  {(e.degree || e.field) && (e.startDate || e.endDate) && ' · '}
                  {[e.startDate, e.endDate].filter(Boolean).join(' – ')}
                </div>
              </div>
            ))}
          </section>
        )}

        {data.experience.length > 0 && (
          <section className={`${tc.section} print-page`}>
            <h2 className={h2Class} style={template !== 'minimal' ? accentStyle : undefined}>Experience</h2>
            {data.experience.map((e) => (
              <div key={e.id} className="mb-6 print-page">
                <div className="flex justify-between items-baseline gap-4">
                  <div className="font-semibold text-base">{e.company || 'Company'}</div>
                  <div className="text-black/60 text-sm shrink-0">{[e.startDate, e.endDate].filter(Boolean).join(' – ')}</div>
                </div>
                <div className="text-black/70 text-sm mb-1">{e.title} · {e.location}</div>
                {e.description && <p className="text-[15px] leading-relaxed text-black/85">{e.description}</p>}
              </div>
            ))}
          </section>
        )}

        {data.projects.length > 0 && (
          <section className={`${tc.section} print-page`}>
            <h2 className={h2Class} style={template !== 'minimal' ? accentStyle : undefined}>Projects</h2>
            {data.projects.map((p) => (
              <div key={p.id} className="mb-4 print-page">
                <div className="font-semibold text-base">
                  {p.liveUrl ? <a href={p.liveUrl.startsWith('http') ? p.liveUrl : `https://${p.liveUrl}`} className="underline underline-offset-2">{p.title || 'Project'}</a> : p.githubUrl ? <a href={p.githubUrl.startsWith('http') ? p.githubUrl : `https://${p.githubUrl}`} className="underline underline-offset-2">{p.title || 'Project'}</a> : (p.title || 'Project')}
                </div>
                {p.description && <p className="text-[15px] leading-relaxed text-black/85 mt-1">{p.description}</p>}
                {p.techStack.length > 0 && <p className="text-[13px] text-black/70 mt-1">{p.techStack.join(', ')}</p>}
              </div>
            ))}
          </section>
        )}

        {(data.skills.technical.length > 0 || data.skills.soft.length > 0 || data.skills.tools.length > 0) && (
          <section className={tc.section}>
            <h2 className={h2Class} style={template !== 'minimal' ? accentStyle : undefined}>Skills</h2>
            <p className="text-[15px] leading-relaxed text-black/85">{[...data.skills.technical, ...data.skills.soft, ...data.skills.tools].join(', ')}</p>
          </section>
        )}

        {(data.links.github || data.links.linkedin) && (
          <section className="pt-6 border-t border-black/20" style={template !== 'minimal' ? { borderColor: accentColor } : undefined}>
            <div className="flex gap-8 text-sm">
              {data.links.github && <a href={data.links.github.startsWith('http') ? data.links.github : `https://${data.links.github}`} className="underline underline-offset-2">GitHub</a>}
              {data.links.linkedin && <a href={data.links.linkedin.startsWith('http') ? data.links.linkedin : `https://${data.links.linkedin}`} className="underline underline-offset-2">LinkedIn</a>}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
