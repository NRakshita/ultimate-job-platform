import { extractSkills } from './skillCategories'
import { OTHER_DEFAULT } from './schema'

const ROUND_TEMPLATES = {
  round1: [
    'Review quantitative aptitude (percentages, ratios, time & work)',
    'Brush up logical reasoning and verbal ability',
    'Practice time management for timed tests',
    'Review basic CS fundamentals (binary, number systems)',
    'Practice previous company aptitude patterns',
    'Prepare for psychometric if applicable',
    'Revise grammar and reading comprehension',
  ],
  round2: [
    'Solve 5-7 DSA problems (arrays, strings, trees)',
    'Review core CS: OOP, DBMS, OS concepts',
    'Practice system design basics if required',
    'Revise time/space complexity analysis',
    'Mock coding round with timer',
    'Brush up SQL queries and normalization',
    'Review networking and OS fundamentals',
    'Practice problem explaining approach aloud',
  ],
  round3: [
    'Prepare STAR format for project stories',
    'Align resume points with JD requirements',
    'Review tech stack from JD in depth',
    'Prepare for "Tell me about a project"',
    'Practice explaining technical decisions',
    'Prepare questions to ask interviewer',
    'Review system design basics',
    'Mock tech interview with peer',
  ],
  round4: [
    'Prepare "Tell me about yourself" (2 min)',
    'Review common HR questions (strengths, weaknesses)',
    'Prepare company research and culture fit',
    'Practice salary expectation response',
    'Prepare questions about team and role',
    'Review behavioral (conflict, failure) examples',
    'Prepare relocation/joining timeline',
  ],
}

const DAY_TEMPLATES = {
  day1_2: [
    'Aptitude: Quantitative basics and logical reasoning',
    'Core CS: OOP pillars, DBMS basics, OS concepts',
    'Networks: TCP/IP, HTTP, basic protocols',
    'Revise fundamentals from college notes',
  ],
  day3_4: [
    'DSA: Arrays, strings, hash maps, two pointers',
    'DSA: Trees, graphs, recursion, dynamic programming',
    'Practice 5-8 problems on LeetCode/GFG',
    'Time yourself on easy-medium problems',
    'Revise complexity analysis',
  ],
  day5: [
    'Review your top 2 projects in detail',
    'Align project tech stack with JD',
    'Update resume bullet points for JD',
    'Prepare project demos if applicable',
    'Document challenges and learnings',
  ],
  day6: [
    'Compile mock questions from JD skills',
    'Practice answering aloud (record yourself)',
    'Mock interview with friend or online',
    'Time your responses (2-3 min each)',
    'Prepare follow-up question answers',
  ],
  day7: [
    'Revision of weak areas identified',
    'Quick DSA revision (top 20 patterns)',
    'Final resume and JD alignment check',
    'Rest and stay confident',
  ],
}

const GENERAL_QUESTIONS = [
  'Tell me about a challenging project you worked on.',
  'How do you handle conflicting deadlines?',
  'Where do you see yourself in 5 years?',
  'Describe a time you solved a complex problem.',
  'How do you stay updated with technology?',
  'What are your strengths and weaknesses?',
  'Why do you want to join this company?',
  'How do you approach learning new skills?',
  'Describe your ideal work environment.',
  'What questions do you have for us?',
]

const SKILL_QUESTIONS = {
  SQL: [
    'Explain indexing and when it helps.',
    'What is the difference between INNER JOIN and LEFT JOIN?',
    'How would you optimize a slow query?',
  ],
  React: [
    'Explain state management options (useState, Context, Redux).',
    'What is the virtual DOM and how does reconciliation work?',
    'When would you use useMemo vs useCallback?',
  ],
  DSA: [
    'How would you optimize search in sorted data?',
    'Explain when to use a hash map vs array for lookups.',
    'How would you detect a cycle in a linked list?',
  ],
  Java: [
    'Explain the difference between HashMap and HashTable.',
    'What is the JVM and how does garbage collection work?',
    'Explain multithreading and synchronization.',
  ],
  Python: [
    'Explain the difference between list and tuple.',
    'What are decorators and how do they work?',
    'Explain GIL and its impact on multithreading.',
  ],
  Node: [
    'Explain the event loop in Node.js.',
    'What is the difference between blocking and non-blocking I/O?',
    'How would you handle async error handling?',
  ],
  MongoDB: [
    'When would you choose MongoDB over SQL?',
    'Explain indexing in MongoDB.',
    'What is aggregation pipeline?',
  ],
  AWS: [
    'Explain EC2 vs Lambda use cases.',
    'What services would you use for a serverless API?',
    'How would you design for high availability?',
  ],
  Docker: [
    'Explain Docker vs VMs.',
    'What is the purpose of Dockerfile and docker-compose?',
    'How would you optimize image size?',
  ],
  Kubernetes: [
    'Explain pods, services, and deployments.',
    'How does Kubernetes handle scaling?',
    'What is the role of a container orchestrator?',
  ],
  SystemDesign: [
    'How would you design a URL shortener?',
    'Explain caching strategies.',
    'How would you scale a chat application?',
  ],
  OOP: [
    'Explain the four pillars of OOP.',
    'When would you use composition over inheritance?',
    'What is polymorphism and give an example.',
  ],
  DBMS: [
    'Explain ACID properties.',
    'What is normalization and when to denormalize?',
    'Explain transaction isolation levels.',
  ],
  OS: [
    'Explain process vs thread.',
    'What is deadlock and how to prevent it?',
    'Explain scheduling algorithms.',
  ],
}

export function runAnalysis({ company = '', role = '', jdText = '' }) {
  const extracted = extractSkills(jdText)
  const extractedSkills = toFlatSkills(extracted)
  const checklist = buildChecklist(extracted)
  const plan7Days = buildPlan(extracted)
  const questions = buildQuestions(extracted)
  const baseScore = calculateReadiness(company, role, jdText, extracted)

  return {
    extractedSkills,
    extractedWithCategories: extracted,
    checklist,
    plan7Days,
    questions,
    baseScore,
  }
}

function toFlatSkills(extracted) {
  const categories = extracted?.categories || {}
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

function buildChecklist(extracted) {
  const hasOther = !extracted.hasAny
  const rounds = [
    { roundTitle: 'Round 1: Aptitude / Basics', items: ROUND_TEMPLATES.round1.slice(0, 6) },
    { roundTitle: 'Round 2: DSA + Core CS', items: customizeRound2(ROUND_TEMPLATES.round2, extracted) },
    { roundTitle: 'Round 3: Tech Interview (Projects + Stack)', items: customizeRound3(ROUND_TEMPLATES.round3, extracted) },
    { roundTitle: 'Round 4: Managerial / HR', items: ROUND_TEMPLATES.round4.slice(0, 6) },
  ]
  if (hasOther) {
    rounds[1].items = [
      'Practice basic coding problems (arrays, strings)',
      'Review communication and problem-solving approach',
      'Prepare project descriptions',
      ...rounds[1].items.slice(0, 4),
    ].slice(0, 8)
  }
  return rounds
}

function customizeRound2(base, extracted) {
  const items = [...base]
  if (extracted.categories?.data) items.push('Practice SQL joins and subqueries')
  if (extracted.categories?.web) items.push('Review frontend/backend stack from JD')
  if (extracted.categories?.cloudDevOps) items.push('Brush up cloud and deployment concepts')
  return items.slice(0, 8)
}

function customizeRound3(base, extracted) {
  const items = [...base]
  if (extracted.categories?.web?.skills?.some((s) => /react|next/i.test(s))) {
    items.push('Prepare React/frontend deep-dive answers')
  }
  if (extracted.categories?.data) items.push('Prepare database design discussion')
  return items.slice(0, 8)
}

function buildPlan(extracted) {
  const hasOther = !extracted.hasAny
  const days = [
    { day: 1, focus: 'Day 1-2: Basics + Core CS', tasks: customizeDay1_2(DAY_TEMPLATES.day1_2, extracted) },
    { day: 3, focus: 'Day 3-4: DSA + Coding Practice', tasks: customizeDay3_4(DAY_TEMPLATES.day3_4, extracted) },
    { day: 5, focus: 'Day 5: Project + Resume Alignment', tasks: DAY_TEMPLATES.day5 },
    { day: 6, focus: 'Day 6: Mock Interview Questions', tasks: DAY_TEMPLATES.day6 },
    { day: 7, focus: 'Day 7: Revision + Weak Areas', tasks: customizeDay7(DAY_TEMPLATES.day7, extracted) },
  ]
  if (hasOther) {
    days[1].tasks = [
      'Basic coding: arrays, strings, loops',
      'Practice explaining approach clearly',
      'Review your projects',
      ...days[1].tasks.slice(0, 4),
    ].slice(0, 7)
  }
  return days
}

function customizeDay1_2(base, extracted) {
  const items = [...base]
  if (extracted.categories?.coreCS) items.push('Deep dive: OOP, DBMS, OS, Networks')
  return items.slice(0, 6)
}

function customizeDay3_4(base, extracted) {
  const items = [...base]
  if (extracted.categories?.web?.skills?.some((s) => /react/i.test(s))) {
    items.push('Frontend: React hooks and state revision')
  }
  if (extracted.categories?.languages?.skills?.some((s) => /python|java/i.test(s))) {
    items.push(`Language-specific: ${extracted.categories.languages.skills.join(', ')} syntax review`)
  }
  return items.slice(0, 7)
}

function customizeDay7(base, extracted) {
  const items = [...base]
  if (extracted.hasAny) items.push('Quick revision of JD-specific skills')
  return items
}

function buildQuestions(extracted) {
  const questions = []
  const added = new Set()

  const mapSkillToQuestionKey = (skill) => {
    const s = String(skill).toLowerCase()
    if (s.includes('sql') || s.includes('mysql') || s.includes('postgresql')) return 'SQL'
    if (s.includes('react')) return 'React'
    if (s.includes('java')) return 'Java'
    if (s.includes('python')) return 'Python'
    if (s.includes('node')) return 'Node'
    if (s.includes('mongo')) return 'MongoDB'
    if (s.includes('aws')) return 'AWS'
    if (s.includes('docker')) return 'Docker'
    if (s.includes('kubernetes')) return 'Kubernetes'
    if (s.includes('dsa') || s.includes('algorithm') || s.includes('data structure')) return 'DSA'
    if (s.includes('oop')) return 'OOP'
    if (s.includes('dbms') || s.includes('database')) return 'DBMS'
    if (s.includes('os') || s.includes('operating system')) return 'OS'
    return null
  }

  const categories = extracted?.categories || {}
  for (const [, { skills }] of Object.entries(categories)) {
    for (const skill of skills || []) {
      const key = mapSkillToQuestionKey(skill)
      if (key && SKILL_QUESTIONS[key]) {
        for (const q of SKILL_QUESTIONS[key]) {
          if (!added.has(q)) { added.add(q); questions.push(q) }
          if (questions.length >= 10) break
        }
      }
      if (questions.length >= 10) break
    }
    if (questions.length >= 10) break
  }

  if (categories.coreCS && questions.length < 10) {
    for (const q of SKILL_QUESTIONS.SystemDesign || []) {
      if (questions.length >= 10) break
      if (!added.has(q)) { added.add(q); questions.push(q) }
    }
  }

  while (questions.length < 10) {
    const q = GENERAL_QUESTIONS.find((x) => !added.has(x))
    if (!q) break
    added.add(q)
    questions.push(q)
  }

  return questions.slice(0, 10)
}

function calculateReadiness(company, role, jdText, extracted) {
  let score = 35
  const categoryCount = Object.keys(extracted?.categories || {}).length
  score += Math.min(categoryCount * 5, 30)
  if (company?.trim()) score += 10
  if (role?.trim()) score += 10
  if (jdText?.length > 800) score += 10
  return Math.min(score, 100)
}
