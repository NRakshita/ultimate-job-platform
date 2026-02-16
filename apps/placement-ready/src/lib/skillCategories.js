/**
 * JD Skill extraction - keyword categories (case-insensitive)
 */

export const SKILL_CATEGORIES = {
  coreCS: {
    label: 'Core CS',
    keywords: ['DSA', 'OOP', 'DBMS', 'OS', 'Networks'],
  },
  languages: {
    label: 'Languages',
    keywords: ['Java', 'Python', 'JavaScript', 'TypeScript', 'C++', 'C#', 'Go', 'C'],
  },
  web: {
    label: 'Web',
    keywords: ['React', 'Next.js', 'Node.js', 'Express', 'REST', 'GraphQL'],
  },
  data: {
    label: 'Data',
    keywords: ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
  },
  cloudDevOps: {
    label: 'Cloud/DevOps',
    keywords: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'CI/CD', 'Linux'],
  },
  testing: {
    label: 'Testing',
    keywords: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'PyTest'],
  },
}

export function extractSkills(jdText) {
  if (!jdText || typeof jdText !== 'string') {
    return { categories: {}, allSkills: [], hasAny: false }
  }

  const text = jdText.toLowerCase()
  const categories = {}
  const allSkills = []

  for (const [key, { label, keywords }] of Object.entries(SKILL_CATEGORIES)) {
    const found = []
    for (const kw of keywords) {
      let pattern
      if (kw === 'C') {
        pattern = /\bC(?!\+|#)\b/i
      } else {
        pattern = new RegExp(`\\b${escapeRegex(kw)}\\b`, 'i')
      }
      if (pattern.test(text)) found.push(kw)
    }
    if (found.length > 0) {
      categories[key] = { label, skills: found }
      allSkills.push(...found)
    }
  }

  return {
    categories,
    allSkills: [...new Set(allSkills)],
    hasAny: Object.keys(categories).length > 0,
  }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
