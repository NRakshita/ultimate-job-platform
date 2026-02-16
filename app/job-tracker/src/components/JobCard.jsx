import JobModal from './JobModal'
import { useState } from 'react'
import { useJobStatus } from '../hooks/useJobStatus'

function formatPosted(days) {
  if (days === 0) return 'Today'
  if (days === 1) return '1 day ago'
  return `${days} days ago`
}

function getScoreBadgeClass(score) {
  if (score == null) return ''
  if (score >= 80) return 'kn-job-card__score--high'
  if (score >= 60) return 'kn-job-card__score--medium'
  if (score >= 40) return 'kn-job-card__score--neutral'
  return 'kn-job-card__score--low'
}

function getStatusBadgeClass(status) {
  switch (status) {
    case 'Applied':
      return 'kn-job-card__status--applied'
    case 'Rejected':
      return 'kn-job-card__status--rejected'
    case 'Selected':
      return 'kn-job-card__status--selected'
    default:
      return 'kn-job-card__status--not-applied'
  }
}

const STATUS_OPTIONS = ['Not Applied', 'Applied', 'Rejected', 'Selected']

export default function JobCard({ job, isSaved, onSave, onUnsave, showSaveButton = true, matchScore = null, onStatusChange }) {
  const [modalOpen, setModalOpen] = useState(false)
  const { status, updateStatus } = useJobStatus(job.id, job.title, job.company)

  const handleSave = () => {
    if (isSaved) onUnsave(job.id)
    else onSave(job.id)
  }

  const handleApply = () => {
    if (job.applyUrl) window.open(job.applyUrl, '_blank', 'noopener,noreferrer')
  }

  const handleStatusChange = (newStatus) => {
    updateStatus(newStatus)
    if (onStatusChange) {
      onStatusChange(newStatus)
    }
  }

  return (
    <>
      <article className="kn-job-card">
        <div className="kn-job-card__main">
          <div className="kn-job-card__title-row">
            <h3 className="kn-job-card__title">{job.title}</h3>
            {matchScore != null && (
              <span className={`kn-job-card__score ${getScoreBadgeClass(matchScore)}`} title="Match score">
                {matchScore}
              </span>
            )}
          </div>
          <p className="kn-job-card__company">{job.company}</p>
          <p className="kn-job-card__meta">
            {job.location} · {job.mode}
          </p>
          <p className="kn-job-card__meta">
            {job.experience} · {job.salaryRange}
          </p>
          <div className="kn-job-card__badges">
            <span className="kn-job-card__source">{job.source}</span>
            <span className="kn-job-card__posted">{formatPosted(job.postedDaysAgo)}</span>
          </div>
          <div className="kn-job-card__status-group">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt}
                type="button"
                className={`kn-job-card__status-btn ${status === opt ? `kn-job-card__status-btn--active ${getStatusBadgeClass(opt)}` : ''}`}
                onClick={() => handleStatusChange(opt)}
                aria-pressed={status === opt}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
        <div className="kn-job-card__actions">
          <button
            type="button"
            className="kn-btn kn-btn--secondary"
            onClick={() => setModalOpen(true)}
          >
            View
          </button>
          {showSaveButton && (
            <button
              type="button"
              className={`kn-btn ${isSaved ? 'kn-btn--primary' : 'kn-btn--secondary'}`}
              onClick={handleSave}
            >
              {isSaved ? 'Saved' : 'Save'}
            </button>
          )}
          <button
            type="button"
            className="kn-btn kn-btn--primary"
            onClick={handleApply}
          >
            Apply
          </button>
        </div>
      </article>
      {modalOpen && (
        <JobModal job={job} onClose={() => setModalOpen(false)} />
      )}
    </>
  )
}
