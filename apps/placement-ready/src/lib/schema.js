/**
 * Placement Readiness Platform — Standardized Analysis Entry Schema
 * All history entries conform to this shape.
 */

const EMPTY_SKILLS = {
  coreCS: [],
  languages: [],
  web: [],
  data: [],
  cloud: [],
  testing: [],
  other: [],
}

const OTHER_DEFAULT = [
  'Communication',
  'Problem solving',
  'Basic coding',
  'Projects',
]

function toFlatSkills(extracted) {
  if (!extracted) return { ...EMPTY_SKILLS, other: [...OTHER_DEFAULT] }
  const categories = extracted.categories || {}
  const flat = {
    coreCS: (categories.coreCS?.skills || []).slice(),
    languages: (categories.languages?.skills || []).slice(),
    web: (categories.web?.skills || []).slice(),
    data: (categories.data?.skills || []).slice(),
    cloud: (categories.cloudDevOps?.skills || []).slice(),
    testing: (categories.testing?.skills || []).slice(),
    other: [],
  }
  const hasAny = [flat.coreCS, flat.languages, flat.web, flat.data, flat.cloud, flat.testing]
    .some((arr) => arr.length > 0)
  if (!hasAny) {
    flat.other = [...OTHER_DEFAULT]
  }
  return flat
}

function toRoundMapping(rm) {
  if (!Array.isArray(rm) || rm.length === 0) return []
  return rm.map((r) => ({
    roundTitle: r.roundTitle ?? r.title ?? `Round ${r.round ?? ''}`.trim(),
    focusAreas: Array.isArray(r.focusAreas)
      ? r.focusAreas
      : r.content
        ? [r.content]
        : [],
    whyItMatters: r.whyItMatters ?? r.whyMatters ?? '',
  }))
}

function toChecklist(cl) {
  if (!Array.isArray(cl) || cl.length === 0) return []
  return cl.map((r) => ({
    roundTitle: r.roundTitle ?? r.title ?? '',
    items: Array.isArray(r.items) ? r.items : [],
  }))
}

function toPlan7Days(plan) {
  if (!Array.isArray(plan) || plan.length === 0) return []
  return plan.map((d) => ({
    day: d.day ?? 0,
    focus: d.focus ?? d.title ?? '',
    tasks: Array.isArray(d.tasks) ? d.tasks : Array.isArray(d.items) ? d.items : [],
  }))
}

function computeFinalScore(baseScore, skillConfidenceMap, allSkills) {
  let delta = 0
  for (const skill of allSkills) {
    delta += (skillConfidenceMap[skill] || 'practice') === 'know' ? 2 : -2
  }
  return Math.max(0, Math.min(100, (baseScore ?? 0) + delta))
}

function getAllSkillsFromFlat(extractedSkills) {
  if (!extractedSkills) return []
  const { coreCS = [], languages = [], web = [], data = [], cloud = [], testing = [], other = [] } = extractedSkills
  return [...coreCS, ...languages, ...web, ...data, ...cloud, ...testing, ...other]
}

export function normalizeEntry(raw) {
  if (!raw || typeof raw !== 'object') return null
  try {
    const extractedSkills = toFlatSkills(raw.extractedSkills)
    const allSkills = getAllSkillsFromFlat(extractedSkills)
    const baseScore = typeof raw.baseScore === 'number' ? raw.baseScore : (raw.readinessScore ?? 0)
    const skillConfidenceMap = raw.skillConfidenceMap && typeof raw.skillConfidenceMap === 'object'
      ? raw.skillConfidenceMap
      : {}
    const finalScore = typeof raw.finalScore === 'number'
      ? raw.finalScore
      : computeFinalScore(baseScore, skillConfidenceMap, allSkills)

    return {
      id: String(raw.id ?? `jd_${Date.now()}`),
      createdAt: raw.createdAt ?? new Date().toISOString(),
      company: typeof raw.company === 'string' ? raw.company : '',
      role: typeof raw.role === 'string' ? raw.role : '',
      jdText: typeof raw.jdText === 'string' ? raw.jdText : '',
      extractedSkills,
      roundMapping: toRoundMapping(raw.roundMapping),
      checklist: toChecklist(raw.checklist),
      plan7Days: toPlan7Days(raw.plan ?? raw.plan7Days),
      questions: Array.isArray(raw.questions) ? raw.questions : [],
      baseScore,
      skillConfidenceMap,
      finalScore,
      updatedAt: raw.updatedAt ?? raw.createdAt ?? new Date().toISOString(),
      companyIntel: raw.companyIntel ?? null,
    }
  } catch (e) {
    console.warn('normalizeEntry failed:', e)
    return null
  }
}

export function isValidEntry(entry) {
  if (!entry || typeof entry !== 'object') return false
  if (!entry.id || typeof entry.id !== 'string') return false
  if (typeof entry.jdText !== 'string') return false
  if (!entry.extractedSkills || typeof entry.extractedSkills !== 'object') return false
  return true
}

export { getAllSkillsFromFlat, computeFinalScore, OTHER_DEFAULT, EMPTY_SKILLS }
