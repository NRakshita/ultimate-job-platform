const ACTION_VERBS = [
  'built',
  'developed',
  'designed',
  'implemented',
  'led',
  'improved',
  'created',
  'optimized',
  'automated',
  'launched',
  'managed',
  'delivered',
  'achieved',
  'reduced',
  'increased',
  'established',
]

const NUMERIC_PATTERN = /[\d%€$£¥kKmMxX]+/

export function getFirstWord(s: string): string {
  const t = s.trim()
  const m = t.match(/^\S+/)
  return m ? m[0].toLowerCase() : ''
}

export function startsWithActionVerb(line: string): boolean {
  const first = getFirstWord(line)
  if (!first) return false
  return ACTION_VERBS.some((v) => first === v || first.startsWith(v))
}

export function hasNumericIndicator(line: string): boolean {
  return NUMERIC_PATTERN.test(line)
}

export interface BulletFeedback {
  lineIndex: number
  text: string
  needsActionVerb: boolean
  needsNumbers: boolean
}

export function analyzeBullets(text: string): BulletFeedback[] {
  const lines = text
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean)
  return lines.map((line, i) => ({
    lineIndex: i + 1,
    text: line,
    needsActionVerb: !startsWithActionVerb(line),
    needsNumbers: !hasNumericIndicator(line),
  }))
}
