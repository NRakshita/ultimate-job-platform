/**
 * Round Mapping Engine - dynamic round flow based on company size + skills
 * Demo Mode: Company intel generated heuristically.
 */

export function generateRoundMapping(companyIntel, extractedSkills = {}) {
  const size = companyIntel?.size || 'startup'
  const categories = extractedSkills?.categories || {}
  const flat = extractedSkills?.coreCS !== undefined ? extractedSkills : {}
  const webSkills = categories.web?.skills || flat.web || []
  const hasDSA = !!(categories.coreCS || flat.coreCS?.length)
  const hasWeb = webSkills.some((s) => /react|node|express/i.test(s))
  const hasSystemDesign = !!(categories.cloudDevOps || categories.data || flat.cloud?.length || flat.data?.length)

  if (size === 'enterprise' && hasDSA) {
    return [
      {
        round: 1,
        roundTitle: 'Round 1: Online Test',
        focusAreas: ['DSA', 'Aptitude'],
        whyItMatters:
          'Filters candidates on fundamentals. Time management and accuracy matter as much as correctness.',
      },
      {
        round: 2,
        roundTitle: 'Round 2: Technical',
        focusAreas: ['DSA', 'Core CS'],
        whyItMatters:
          'Deep dive into problem-solving approach and CS fundamentals. Expect follow-ups on optimization and trade-offs.',
      },
      {
        round: 3,
        roundTitle: 'Round 3: Tech + Projects',
        focusAreas: ['System discussion', 'Project walkthrough'],
        whyItMatters:
          'Validates real-world application. Be ready to explain design decisions and scale challenges.',
      },
      {
        round: 4,
        roundTitle: 'Round 4: HR',
        focusAreas: ['Culture fit', 'Expectations'],
        whyItMatters:
          'Assesses alignment with company values and role. Prepare your story and questions.',
      },
    ]
  }

  if (size === 'startup' && hasWeb) {
    return [
      {
        round: 1,
        title: 'Round 1: Practical Coding',
        content: 'Live coding, stack-specific tasks',
        whyMatters:
          'They want to see you code. Expect hands-on problems in your primary stack rather than abstract DSA.',
      },
      {
        round: 2,
        title: 'Round 2: System Discussion',
        content: 'Architecture, trade-offs, past projects',
        whyMatters:
          'Focus on how you think about systems. Be ready to discuss your projects in depth.',
      },
      {
        round: 3,
        title: 'Round 3: Culture Fit',
        content: 'Working style, ownership, team fit',
        whyMatters:
          'Startups care about fit. Show enthusiasm, ownership, and ability to work with ambiguity.',
      },
    ]
  }

  if (size === 'enterprise') {
    return [
      {
        round: 1,
        title: 'Round 1: Online Test',
        content: 'Aptitude + Technical MCQ',
        whyMatters:
          'Screens for basic aptitude and CS knowledge. Accuracy under time pressure is key.',
      },
      {
        round: 2,
        title: 'Round 2: Technical',
        content: 'Core CS + Coding',
        whyMatters:
          'Assesses fundamentals. Expect a mix of theory and practical coding.',
      },
      {
        round: 3,
        title: 'Round 3: Technical Deep Dive',
        content: 'Projects, system design',
        whyMatters:
          'Validates depth. Prepare to discuss scalability and design choices.',
      },
      {
        round: 4,
        title: 'Round 4: HR',
        content: 'Behavioral, expectations',
        whyMatters:
          'Final fit assessment. Align your narrative with the role.',
      },
    ]
  }

  if (size === 'startup' && hasSystemDesign) {
    return [
      {
        round: 1,
        title: 'Round 1: Technical',
        content: 'Coding + system basics',
        whyMatters:
          'Tests both coding ability and system-thinking. Be concise and structured.',
      },
      {
        round: 2,
        title: 'Round 2: System Design',
        content: 'Architecture, scaling',
        whyMatters:
          'Startups need people who can build. Focus on trade-offs and iteration.',
      },
      {
        round: 3,
        title: 'Round 3: Team Fit',
        content: 'Projects, culture',
        whyMatters:
          'Assesses how you work with the team. Show ownership and curiosity.',
      },
    ]
  }

  return [
    {
      round: 1,
      title: 'Round 1: Aptitude / Basics',
      content: 'Quantitative, logical reasoning',
      whyMatters:
        'Standard first filter. Practice time-bound tests to improve speed.',
    },
    {
      round: 2,
      title: 'Round 2: Technical',
      content: 'DSA + Core CS',
      whyMatters:
        'Core technical validation. Balance correctness with clear communication.',
    },
    {
      round: 3,
      title: 'Round 3: Tech + Projects',
      content: 'Coding, project discussion',
      whyMatters:
        'Validates practical application. Connect projects to role requirements.',
    },
    {
      round: 4,
      title: 'Round 4: HR',
      content: 'Behavioral, fit',
      whyMatters:
        'Final alignment check. Prepare consistent, authentic responses.',
    },
  ]
}
