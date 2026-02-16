import { useState, useCallback, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { JOBS } from '../data/jobs'
import { usePreferences } from '../hooks/usePreferences'
import { getStatusHistory } from '../utils/jobStatus'
import {
  getTodayKey,
  getStoredDigest,
  setStoredDigest,
  generateDigest,
  resolveDigestItems,
} from '../utils/digest'

function formatDigestDate(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function digestToPlainText(items, dateLabel) {
  const lines = [
    'Top 10 Jobs For You — 9AM Digest',
    dateLabel,
    '',
    ...items.map(({ job, matchScore }, i) => {
      return [
        `${i + 1}. ${job.title}`,
        `   ${job.company} · ${job.location} · ${job.experience}`,
        `   Match: ${matchScore} | Apply: ${job.applyUrl || '—'}`,
        '',
      ].join('\n')
    }),
    'This digest was generated based on your preferences.',
  ]
  return lines.join('\n')
}

export default function DigestPage() {
  const { preferences } = usePreferences()
  // Allow digest generation even with empty preferences (will use defaults)
  const hasPreferences = true // Always allow generating digest
  const [digestItems, setDigestItems] = useState(null)
  const [digestDateKey, setDigestDateKey] = useState(null)

  const loadOrGenerate = useCallback(() => {
    const todayKey = getTodayKey()
    const stored = getStoredDigest(todayKey)
    if (stored?.items?.length) {
      const resolved = resolveDigestItems(stored, JOBS)
      setDigestItems(resolved)
      setDigestDateKey(todayKey)
      return
    }
    // Use preferences if available, otherwise use empty object (will generate digest sorted by recency)
    const prefsToUse = preferences || {}
    const generated = generateDigest(JOBS, prefsToUse)
    setStoredDigest(todayKey, generated)
    setDigestItems(generated)
    setDigestDateKey(todayKey)
  }, [preferences])

  useEffect(() => {
    if (!hasPreferences) return
    const todayKey = getTodayKey()
    const stored = getStoredDigest(todayKey)
    if (stored?.items?.length) {
      const resolved = resolveDigestItems(stored, JOBS)
      setDigestItems(resolved)
      setDigestDateKey(todayKey)
    }
  }, [hasPreferences])

  const handleCopy = useCallback(() => {
    if (!digestItems?.length) return
    const text = digestToPlainText(digestItems, formatDigestDate(digestDateKey))
    navigator.clipboard.writeText(text).catch(() => {})
  }, [digestItems, digestDateKey])

  const handleEmailDraft = useCallback(() => {
    if (!digestItems?.length) return
    const body = digestToPlainText(digestItems, formatDigestDate(digestDateKey))
    const mailto = `mailto:?subject=${encodeURIComponent('My 9AM Job Digest')}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }, [digestItems, digestDateKey])

  const todayKey = getTodayKey()
  const hasDigestForToday = digestDateKey === todayKey && digestItems !== null
  const hasSavedPreferences = preferences !== null

  const recentStatusUpdates = useMemo(() => {
    const history = getStatusHistory()
    return history.slice(0, 10) // Show last 10 updates
  }, [])

  const formatStatusDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <section className="kn-page">
      <h1 className="kn-page__heading">Digest</h1>

      {!hasDigestForToday && (
        <div className="kn-digest-actions">
          <button
            type="button"
            className="kn-btn kn-btn--primary"
            onClick={loadOrGenerate}
          >
            Generate Today's 9AM Digest (Simulated)
          </button>
        </div>
      )}

      {hasDigestForToday && digestItems.length === 0 && (
        <div className="kn-empty">
          <h2 className="kn-empty__title">No matching roles today</h2>
          <p className="kn-empty__message">
            Check again tomorrow.
          </p>
        </div>
      )}

      {hasDigestForToday && digestItems.length > 0 && (
        <>
          <div className="kn-digest-card">
            <header className="kn-digest-card__header">
              <h2 className="kn-digest-card__title">Top 10 Jobs For You — 9AM Digest</h2>
              <p className="kn-digest-card__date">{formatDigestDate(digestDateKey)}</p>
            </header>
            <ul className="kn-digest-card__list">
              {digestItems.map(({ job, matchScore }) => (
                <li key={job.id} className="kn-digest-card__item">
                  <div className="kn-digest-card__item-main">
                    <h3 className="kn-digest-card__item-title">{job.title}</h3>
                    <p className="kn-digest-card__item-meta">
                      {job.company} · {job.location} · {job.experience}
                    </p>
                    <span className={`kn-digest-card__score kn-digest-card__score--${matchScore >= 80 ? 'high' : matchScore >= 60 ? 'medium' : matchScore >= 40 ? 'neutral' : 'low'}`}>
                      Match: {matchScore}
                    </span>
                  </div>
                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="kn-btn kn-btn--primary kn-digest-card__apply"
                  >
                    Apply
                  </a>
                </li>
              ))}
            </ul>
            <footer className="kn-digest-card__footer">
              This digest was generated based on your preferences.
            </footer>
          </div>
          <div className="kn-digest-actions kn-digest-actions--secondary">
            <button type="button" className="kn-btn kn-btn--secondary" onClick={handleCopy}>
              Copy Digest to Clipboard
            </button>
            <button type="button" className="kn-btn kn-btn--secondary" onClick={handleEmailDraft}>
              Create Email Draft
            </button>
          </div>
        </>
      )}

      {!hasDigestForToday && digestItems === null && (
        <p className="kn-digest-hint">
          {hasSavedPreferences 
            ? "Click the button above to generate today's digest. If you've already generated it, it will load from storage."
            : "Click the button above to generate today's digest. For personalized matching, set your preferences in Settings."}
        </p>
      )}

      {recentStatusUpdates.length > 0 && (
        <div className="kn-status-updates">
          <h2 className="kn-status-updates__title">Recent Status Updates</h2>
          <ul className="kn-status-updates__list">
            {recentStatusUpdates.map((update, idx) => (
              <li key={`${update.jobId}-${update.dateChanged}-${idx}`} className="kn-status-updates__item">
                <div className="kn-status-updates__item-main">
                  <h3 className="kn-status-updates__item-title">{update.jobTitle}</h3>
                  <p className="kn-status-updates__item-company">{update.company}</p>
                </div>
                <div className="kn-status-updates__item-meta">
                  <span className={`kn-status-updates__status kn-status-updates__status--${update.status.toLowerCase().replace(' ', '-')}`}>
                    {update.status}
                  </span>
                  <span className="kn-status-updates__date">{formatStatusDate(update.dateChanged)}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="kn-digest-demo-note">
        Demo Mode: Daily 9AM trigger simulated manually.
      </p>
    </section>
  )
}
