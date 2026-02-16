import { useMemo, useState, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/ui/card'
import { getEntryById, getLatestEntry, updateEntry } from '../lib/storage'
import { generateCompanyIntel } from '../lib/companyIntel'
import { generateRoundMapping } from '../lib/roundMapping'
import { getAllSkillsFromFlat, normalizeEntry } from '../lib/schema'
import { ArrowLeft, Copy, Download } from 'lucide-react'

const SKILL_LABELS = { coreCS: 'Core CS', languages: 'Languages', web: 'Web', data: 'Data', cloud: 'Cloud/DevOps', testing: 'Testing', other: 'Other' }

function computeLiveScore(baseScore, allSkills, skillConfidenceMap) {
  let delta = 0
  for (const skill of allSkills) {
    const status = skillConfidenceMap[skill] || 'practice'
    delta += status === 'know' ? 2 : -2
  }
  return Math.max(0, Math.min(100, baseScore + delta))
}

function formatPlanForExport(plan) {
  if (!plan?.length) return ''
  return plan
    .map((d) => {
      const tasks = (d.tasks || d.items || []).map((i) => `  • ${i}`).join('\n')
      return `${d.focus || d.title}\n${tasks}`
    })
    .join('\n\n')
}

function formatChecklistForExport(checklist) {
  if (!checklist?.length) return ''
  return checklist
    .map((r) => {
      const items = (r.items || []).map((i) => `  □ ${i}`).join('\n')
      return `${r.roundTitle || r.title}\n${items}`
    })
    .join('\n\n')
}

function formatQuestionsForExport(questions) {
  if (!questions?.length) return ''
  return questions.map((q, i) => `${i + 1}. ${q}`).join('\n')
}

export default function Results() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const location = useLocation()
  const id = searchParams.get('id')

  const entry = useMemo(() => {
    const raw = location?.state?.entry ?? (id ? getEntryById(id) : getLatestEntry())
    return raw ? normalizeEntry(raw) : null
  }, [id, location?.state?.entry])

  const allSkills = useMemo(() => getAllSkillsFromFlat(entry?.extractedSkills), [entry])
  const [skillConfidenceMap, setSkillConfidenceMapState] = useState(() => entry?.skillConfidenceMap || {})

  useEffect(() => {
    setSkillConfidenceMapState(entry?.skillConfidenceMap || {})
  }, [entry?.id])

  const baseScore = entry?.baseScore ?? entry?.readinessScore ?? 0

  const persistConfidence = useCallback(
    (newMap) => {
      if (!entry?.id) return
      updateEntry(entry.id, { skillConfidenceMap: newMap })
    },
    [entry?.id]
  )

  const setSkillConfidence = useCallback(
    (skill, status) => {
      const next = { ...skillConfidenceMap, [skill]: status }
      setSkillConfidenceMapState(next)
      persistConfidence(next)
    },
    [skillConfidenceMap, persistConfidence]
  )

  const liveScore = useMemo(
    () => computeLiveScore(baseScore, allSkills, skillConfidenceMap),
    [baseScore, allSkills, skillConfidenceMap]
  )

  const practiceSkills = useMemo(
    () => allSkills.filter((s) => (skillConfidenceMap[s] || 'practice') === 'practice'),
    [allSkills, skillConfidenceMap]
  )

  const topWeakSkills = practiceSkills.slice(0, 3)

  const copyToClipboard = useCallback(async (text, label) => {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      return false
    }
  }, [])

  const handleCopyPlan = () => copyToClipboard(formatPlanForExport(displayPlan), '7-day plan')
  const handleCopyChecklist = () => copyToClipboard(formatChecklistForExport(entry?.checklist), 'round checklist')
  const handleCopyQuestions = () => copyToClipboard(formatQuestionsForExport(entry?.questions), '10 questions')

  const handleDownloadTxt = () => {
    const sections = [
      `Placement Readiness — ${entry?.company || 'Unknown'} — ${entry?.role || 'N/A'}`,
      `Readiness Score: ${liveScore}/100`,
      '',
    ]
    if (companyIntel) {
      sections.push(
        '--- COMPANY INTEL ---',
        `${companyIntel.companyName} | ${companyIntel.industry} | ${companyIntel.sizeLabel}`,
        `Hiring Focus: ${companyIntel.hiringFocus}`,
        ''
      )
    }
    if (roundMapping?.length) {
      sections.push(
        '--- INTERVIEW ROUND FLOW ---',
        ...roundMapping.map(
          (r) => `${r.roundTitle || r.title}: ${(r.focusAreas || [r.content]).join(', ')}\n  ${r.whyItMatters || r.whyMatters}`
        ),
        ''
      )
    }
    sections.push(
      '--- 7-DAY PLAN ---',
      formatPlanForExport(displayPlan),
      '',
      '--- ROUND-WISE CHECKLIST ---',
      formatChecklistForExport(entry?.checklist),
      '',
      '--- 10 LIKELY INTERVIEW QUESTIONS ---',
      formatQuestionsForExport(entry?.questions),
    )
    const blob = new Blob([sections.join('\n\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const linkEl = document.createElement('a')
    linkEl.href = url
    linkEl.download = `placement-prep-${entry?.company || 'jd'}-${Date.now()}.txt`
    linkEl.click()
    URL.revokeObjectURL(url)
  }

  if (!entry) {
    return (
      <div className="space-y-6">
        <button
          onClick={() => navigate('/dashboard/analyze')}
          className="flex items-center gap-2 text-primary hover:text-primary-hover"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Analyzer
        </button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No analysis found.</p>
            <p className="text-sm text-gray-500 mt-1">Analyze a job description first.</p>
            <button
              onClick={() => navigate('/dashboard/analyze')}
              className="mt-4 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
            >
              Analyze JD
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { company, role, extractedSkills, checklist, plan7Days, plan, questions } = entry
  const displayPlan = plan7Days ?? plan
  const hasAny = [extractedSkills?.coreCS, extractedSkills?.languages, extractedSkills?.web, extractedSkills?.data, extractedSkills?.cloud, extractedSkills?.testing]
    .some((arr) => Array.isArray(arr) && arr.length > 0)

  const companyIntel = useMemo(() => {
    if (!company?.trim()) return null
    return (
      entry.companyIntel ||
      generateCompanyIntel(company, entry.jdText, extractedSkills || { categories: {} })
    )
  }, [company, entry.companyIntel, entry.jdText, extractedSkills])

  const roundMapping = useMemo(
    () =>
      entry.roundMapping ||
      generateRoundMapping(companyIntel, extractedSkills || {}),
    [entry.roundMapping, companyIntel, extractedSkills]
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/dashboard/analyze')}
          className="flex items-center gap-2 text-primary hover:text-primary-hover text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={() => navigate('/dashboard/history')}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          View History
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {company && <span className="font-medium text-gray-900">{company}</span>}
        {role && <span className="text-gray-500">— {role}</span>}
      </div>

      {/* Company Intel */}
      {companyIntel && (
        <Card>
          <CardHeader>
            <CardTitle>{companyIntel.companyName}</CardTitle>
            <CardDescription>
              Industry: {companyIntel.industry} · {companyIntel.sizeLabel}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Typical Hiring Focus</p>
              <p className="text-sm text-gray-600">{companyIntel.hiringFocus}</p>
            </div>
            <p className="text-xs text-gray-500 italic">
              Demo Mode: Company intel generated heuristically.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Round Mapping */}
      {roundMapping?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Interview Round Flow</CardTitle>
            <CardDescription>Expected rounds based on company and JD</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {roundMapping.map((r, i) => (
                <div key={r.round ?? i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium shrink-0">
                      {r.round ?? i + 1}
                    </div>
                    {i < roundMapping.length - 1 && (
                      <div className="w-0.5 h-12 bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pb-6 last:pb-0">
                    <h4 className="font-medium text-gray-900">{r.roundTitle || r.title}</h4>
                    <p className="text-sm text-primary font-medium mt-0.5">{(r.focusAreas || (r.content ? [r.content] : [])).join(', ')}</p>
                    <p className="text-sm text-gray-600 mt-2">{r.whyItMatters || r.whyMatters}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Readiness Score (live) */}
      <Card>
        <CardHeader>
          <CardTitle>Readiness Score</CardTitle>
          <CardDescription>
            Base score + self-assessment. Toggle skills below to update.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="hsl(245, 58%, 90%)"
                  strokeWidth="8"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="hsl(245, 58%, 51%)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - liveScore / 100)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-900">{liveScore}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600">/ 100</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Skills Extracted (with toggles) */}
      <Card>
        <CardHeader>
          <CardTitle>Key Skills Extracted</CardTitle>
          <CardDescription>
            {hasAny
              ? 'Toggle each skill: "I know this" or "Need practice". Updates score live.'
              : 'General fresher stack (no specific keywords detected)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {(hasAny || extractedSkills?.other?.length) ? (
            <div className="space-y-4">
              {Object.entries(extractedSkills || {}).map(([key, skills]) => {
                if (!Array.isArray(skills) || skills.length === 0) return null
                const label = SKILL_LABELS[key] || key
                return (
                <div key={key}>
                  <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => {
                      const status = skillConfidenceMap[skill] || 'practice'
                      return (
                        <div
                          key={skill}
                          className="flex items-center gap-1.5 rounded-md overflow-hidden border border-gray-200"
                        >
                          <span
                            className={`px-2.5 py-1 text-sm ${
                              status === 'know'
                                ? 'bg-primary text-white'
                                : 'bg-primary-light text-primary'
                            }`}
                          >
                            {skill}
                          </span>
                          <div className="flex bg-gray-50">
                            <button
                              type="button"
                              onClick={() => setSkillConfidence(skill, 'practice')}
                              className={`px-2 py-1 text-xs ${
                                status === 'practice'
                                  ? 'bg-primary text-white font-medium'
                                  : 'text-gray-500 hover:text-gray-700'
                              }`}
                              title="Need practice"
                            >
                              Practice
                            </button>
                            <button
                              type="button"
                              onClick={() => setSkillConfidence(skill, 'know')}
                              className={`px-2 py-1 text-xs ${
                                status === 'know'
                                  ? 'bg-primary text-white font-medium'
                                  : 'text-gray-500 hover:text-gray-700'
                              }`}
                              title="I know this"
                            >
                              Know
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <p className="text-gray-600">
              No specific tech stack detected. Focus on general DSA, aptitude, and core CS
              fundamentals.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Round-wise Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Round-wise Preparation Checklist</CardTitle>
          <CardDescription>Structured by interview round</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {checklist?.map((round) => (
            <div key={round.roundTitle || round.title}>
              <h4 className="font-medium text-gray-900 mb-3">{round.roundTitle || round.title}</h4>
              <ul className="space-y-2">
                {round.items?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-primary mt-0.5">□</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 7-day Plan */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Preparation Plan</CardTitle>
          <CardDescription>Adapted to detected skills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {displayPlan?.map((day) => (
            <div key={day.day}>
              <h4 className="font-medium text-gray-900 mb-2">{day.focus || day.title}</h4>
              <ul className="space-y-1">
                {(day.tasks || day.items)?.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 pl-4 border-l-2 border-primary/30">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 10 Likely Interview Questions */}
      <Card>
        <CardHeader>
          <CardTitle>10 Likely Interview Questions</CardTitle>
          <CardDescription>Based on skills in the JD</CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 list-decimal list-inside text-gray-700">
            {questions?.map((q, i) => (
              <li key={i} className="text-sm">
                {q}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Export tools */}
      <Card>
        <CardHeader>
          <CardTitle>Export</CardTitle>
          <CardDescription>Copy or download content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <CopyButton onClick={handleCopyPlan} label="Copy 7-day plan" />
            <CopyButton onClick={handleCopyChecklist} label="Copy round checklist" />
            <CopyButton onClick={handleCopyQuestions} label="Copy 10 questions" />
            <button
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download as TXT
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Action Next */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Action Next</CardTitle>
          <CardDescription>Focus areas and suggested next step</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {topWeakSkills.length > 0 && (
            <p className="text-sm text-gray-700">
              Top skills to practice: <strong>{topWeakSkills.join(', ')}</strong>
            </p>
          )}
          <p className="text-sm text-gray-600">Start Day 1 plan now.</p>
        </CardContent>
      </Card>
    </div>
  )
}

function CopyButton({ onClick, label }) {
  const [copied, setCopied] = useState(false)
  const handleClick = async () => {
    const ok = await onClick()
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }
  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
    >
      <Copy className="w-4 h-4" />
      {copied ? 'Copied' : label}
    </button>
  )
}
