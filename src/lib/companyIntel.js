/**
 * Company Intel - heuristic inference (no external APIs)
 * Demo Mode: Company intel generated heuristically.
 */

const ENTERPRISE_COMPANIES = [
  'amazon', 'microsoft', 'google', 'meta', 'apple', 'netflix',
  'infosys', 'tcs', 'tata consultancy', 'wipro', 'accenture',
  'hcl', 'capgemini', 'cognizant', 'tech mahindra', 'ltimindtree',
  'oracle', 'sap', 'ibm', 'dell', 'hp', 'intel', 'vmware',
  'salesforce', 'adobe', 'paypal', 'visa', 'goldman sachs',
  'jpmorgan', 'morgan stanley', 'deloitte', 'ey', 'pwc', 'kpmg',
]

const INDUSTRY_KEYWORDS = {
  fintech: ['finance', 'banking', 'payments', 'fintech', 'trading', 'insurance'],
  healthcare: ['health', 'medical', 'pharma', 'clinical', 'patient'],
  ecommerce: ['ecommerce', 'e-commerce', 'retail', 'marketplace'],
  edtech: ['education', 'edtech', 'learning', 'course'],
  saas: ['saas', 'software as a service', 'subscription'],
}

export function generateCompanyIntel(company, jdText = '', extractedSkills = {}) {
  if (!company?.trim()) return null

  const name = company.trim()
  const text = (jdText || '').toLowerCase()
  const categories = extractedSkills?.categories || {}
  const flat = extractedSkills?.coreCS !== undefined ? extractedSkills : {}
  const hasDSA = !!(categories.coreCS || flat.coreCS?.length) || text.includes('dsa') || text.includes('algorithm')
  const hasWeb = !!(categories.web || flat.web?.length)
  const hasData = !!(categories.data || flat.data?.length)
  const hasCloud = !!(categories.cloudDevOps || flat.cloud?.length)

  const size = inferSize(name)
  const industry = inferIndustry(text)
  const hiringFocus = inferHiringFocus(size, { hasDSA, hasWeb, hasData, hasCloud })

  return {
    companyName: name,
    industry,
    size,
    sizeLabel: getSizeLabel(size),
    hiringFocus,
  }
}

function inferSize(companyName) {
  const normalized = companyName.toLowerCase().trim()
  const isEnterprise = ENTERPRISE_COMPANIES.some((c) => normalized.includes(c))
  if (isEnterprise) return 'enterprise'
  return 'startup'
}

function getSizeLabel(size) {
  switch (size) {
    case 'enterprise':
      return 'Enterprise (2000+)'
    case 'midsize':
      return 'Mid-size (200–2000)'
    default:
      return 'Startup (<200)'
  }
}

function inferIndustry(text) {
  for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return industry.charAt(0).toUpperCase() + industry.slice(1)
    }
  }
  return 'Technology Services'
}

function inferHiringFocus(size, { hasDSA, hasWeb, hasData, hasCloud }) {
  if (size === 'enterprise') {
    return 'Structured DSA and core CS fundamentals. Expect multi-round technical interviews with emphasis on algorithms, system design basics, and behavioral fit. Aptitude and coding tests are standard.'
  }
  if (size === 'startup') {
    return 'Practical problem-solving and stack depth. Focus on hands-on coding, project relevance, and ability to ship. Less formal structure; more discussion of real-world scenarios and your past work.'
  }
  return 'Balanced focus on fundamentals and practical skills. Prepare for both structured technical rounds and project-based discussions.'
}
