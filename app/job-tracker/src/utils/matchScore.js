/**
 * Deterministic match score engine (0–100).
 * Rules exactly as specified.
 */

function parseKeywords(str) {
  if (!str || typeof str !== 'string') return []
  return str
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean)
}

/**
 * Compute match score for one job given user preferences.
 * Cap at 100.
 *
 * +25 if any roleKeyword in job.title (case-insensitive)
 * +15 if any roleKeyword in job.description
 * +15 if job.location in preferredLocations
 * +10 if job.mode in preferredMode
 * +10 if job.experience === experienceLevel
 * +15 if any overlap job.skills ∩ user skills
 * +5 if postedDaysAgo <= 2
 * +5 if source === LinkedIn
 */
export function computeMatchScore(job, preferences) {
  if (!job || !preferences) return 0

  let score = 0
  const roleKeywords = parseKeywords(preferences.roleKeywords)
  const userSkills = parseKeywords(preferences.skills)
  const preferredLocations = Array.isArray(preferences.preferredLocations) ? preferences.preferredLocations : []
  const preferredMode = Array.isArray(preferences.preferredMode) ? preferences.preferredMode : []
  const experienceLevel = (preferences.experienceLevel || '').trim()

  const titleLower = (job.title || '').toLowerCase()
  const descLower = (job.description || '').toLowerCase()

  if (roleKeywords.length > 0) {
    for (const kw of roleKeywords) {
      if (titleLower.includes(kw)) {
        score += 25
        break
      }
    }
  }

  if (roleKeywords.length > 0) {
    for (const kw of roleKeywords) {
      if (descLower.includes(kw)) {
        score += 15
        break
      }
    }
  }

  if (preferredLocations.length > 0 && job.location) {
    if (preferredLocations.includes(job.location)) score += 15
  }

  if (preferredMode.length > 0 && job.mode) {
    if (preferredMode.includes(job.mode)) score += 10
  }

  if (experienceLevel && job.experience === experienceLevel) score += 10

  if (userSkills.length > 0 && Array.isArray(job.skills)) {
    const jobSkillsLower = job.skills.map((s) => String(s).toLowerCase())
    const hasOverlap = userSkills.some((us) => jobSkillsLower.includes(us))
    if (hasOverlap) score += 15
  }

  if (typeof job.postedDaysAgo === 'number' && job.postedDaysAgo <= 2) score += 5

  if (job.source === 'LinkedIn') score += 5

  return Math.min(100, score)
}

/**
 * Extract first number from salaryRange for sorting (e.g. "6–10 LPA" -> 6, "₹40k–₹60k/month" -> 40).
 */
export function getSalarySortKey(salaryRange) {
  if (!salaryRange || typeof salaryRange !== 'string') return 0
  const m = salaryRange.match(/(\d+)/)
  return m ? Number(m[1]) : 0
}
