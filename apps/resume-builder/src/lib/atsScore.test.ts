import { describe, it, expect } from 'vitest'
import { computeAtsScore, getAtsScoreBand, ATS_BAND_LABELS } from './atsScore'
import type { ResumeData } from '@/types/resume'

function emptyData(): ResumeData {
  return {
    personal: { name: '', email: '', phone: '', location: '' },
    summary: '',
    education: [],
    experience: [],
    projects: [],
    skills: { technical: [], soft: [], tools: [] },
    links: { github: '', linkedin: '' },
  }
}

describe('computeAtsScore', () => {
  it('returns 0 for empty resume', () => {
    const result = computeAtsScore(emptyData())
    expect(result.score).toBe(0)
    expect(result.maxScore).toBe(100)
    expect(result.breakdown).toHaveLength(11)
  })

  it('adds 10 for name', () => {
    const data = emptyData()
    data.personal.name = 'Jane Doe'
    expect(computeAtsScore(data).score).toBe(10)
  })

  it('adds 10 for summary over 50 chars', () => {
    const data = emptyData()
    data.summary = 'A'.repeat(51)
    expect(computeAtsScore(data).score).toBe(10)
  })

  it('adds 15 for experience with bullets', () => {
    const data = emptyData()
    data.experience = [
      { id: '1', company: 'C', title: 'T', location: '', startDate: '', endDate: '', description: 'Built features.' },
    ]
    expect(computeAtsScore(data).score).toBe(15)
  })

  it('adds 10 for action verbs in summary', () => {
    const data = emptyData()
    data.summary = 'I built and led a team that designed the system.'
    expect(computeAtsScore(data).score).toBe(10)
  })
})

describe('getAtsScoreBand', () => {
  it('needsWork for 0-40', () => {
    expect(getAtsScoreBand(0)).toBe('needsWork')
    expect(getAtsScoreBand(40)).toBe('needsWork')
  })
  it('gettingThere for 41-70', () => {
    expect(getAtsScoreBand(41)).toBe('gettingThere')
    expect(getAtsScoreBand(70)).toBe('gettingThere')
  })
  it('strong for 71-100', () => {
    expect(getAtsScoreBand(71)).toBe('strong')
    expect(getAtsScoreBand(100)).toBe('strong')
  })
})

describe('ATS_BAND_LABELS', () => {
  it('has expected labels', () => {
    expect(ATS_BAND_LABELS.needsWork).toBe('Needs Work')
    expect(ATS_BAND_LABELS.gettingThere).toBe('Getting There')
    expect(ATS_BAND_LABELS.strong).toBe('Strong Resume')
  })
})
