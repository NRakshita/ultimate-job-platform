import { useMemo } from 'react'
import { analyzeBullets } from '@/lib/bulletGuidance'

interface BulletGuidanceHintProps {
  text: string
}

export function BulletGuidanceHint({ text }: BulletGuidanceHintProps) {
  const hints = useMemo(() => {
    const feedback = analyzeBullets(text)
    const out: string[] = []
    feedback.forEach((f, i) => {
      if (f.needsActionVerb) out.push(`Line ${i + 1}: Start with a strong action verb.`)
      if (f.needsNumbers) out.push(`Line ${i + 1}: Add measurable impact (numbers).`)
    })
    return out
  }, [text])

  if (hints.length === 0) return null

  return (
    <p className="mt-1.5 text-xs text-slate-500">
      {hints.slice(0, 2).join(' ')}
    </p>
  )
}
