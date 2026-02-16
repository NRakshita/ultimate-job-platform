import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  getProof,
  saveProof,
  validateUrl,
  canShip,
  formatSubmission,
  PROJECT_STEPS,
} from '../utils/proof'
import { getAllTestsPassed } from '../utils/testChecklist'

export default function ProofPage() {
  const [proof, setProof] = useState(() => getProof())
  const [errors, setErrors] = useState({})
  const [copied, setCopied] = useState(false)
  const allTestsPassed = getAllTestsPassed()

  useEffect(() => {
    const current = getProof()
    setProof(current)
  }, [])

  const handleInputChange = (field, value) => {
    const updated = { ...proof, [field]: value }
    setProof(updated)
    saveProof(updated)

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleBlur = (field, value) => {
    const trimmed = value.trim()
    if (trimmed && !validateUrl(trimmed)) {
      setErrors((prev) => ({
        ...prev,
        [field]: 'Please enter a valid URL (e.g., https://example.com)',
      }))
    } else {
      setErrors((prev) => ({ ...prev, [field]: null }))
    }
  }

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'Shipped') {
      if (!canShip(proof, allTestsPassed)) {
        alert('Cannot ship: All 3 links must be provided and all 10 tests must pass.')
        return
      }
    }
    const updated = { ...proof, status: newStatus }
    setProof(updated)
    saveProof(updated)
  }

  const handleCopySubmission = useCallback(() => {
    const text = formatSubmission(proof)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [proof])

  const completedSteps = PROJECT_STEPS.filter((s) => s.completed).length
  const canShipNow = canShip(proof, allTestsPassed)

  return (
    <section className="kn-page">
      <h1 className="kn-page__heading">Proof & Submission</h1>

      <div className="kn-proof-summary">
        <h2 className="kn-proof-summary__title">Project 1 — Job Notification Tracker</h2>
        <div className="kn-proof-summary__status">
          <span className={`kn-proof-badge kn-proof-badge--${proof.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {proof.status}
          </span>
        </div>
      </div>

      <div className="kn-proof-section">
        <h3 className="kn-proof-section__title">A) Step Completion Summary</h3>
        <div className="kn-step-list">
          {PROJECT_STEPS.map((step) => (
            <div key={step.id} className="kn-step-item">
              <span className="kn-step-item__status">
                {step.completed ? '✓' : '○'} {step.completed ? 'Completed' : 'Pending'}
              </span>
              <span className="kn-step-item__label">{step.label}</span>
            </div>
          ))}
        </div>
        <p className="kn-step-summary">
          {completedSteps} / {PROJECT_STEPS.length} steps completed
        </p>
      </div>

      <div className="kn-proof-section">
        <h3 className="kn-proof-section__title">B) Artifact Collection</h3>
        <div className="kn-proof-form">
          <div className="kn-form-group">
            <label className="kn-form-group__label" htmlFor="lovable-link">
              Lovable Project Link <span className="kn-form-group__required">*</span>
            </label>
            <input
              id="lovable-link"
              type="url"
              className={`kn-input ${errors.lovableLink ? 'kn-input--error' : ''}`}
              placeholder="https://lovable.app/project/..."
              value={proof.lovableLink}
              onChange={(e) => handleInputChange('lovableLink', e.target.value)}
              onBlur={(e) => handleBlur('lovableLink', e.target.value)}
            />
            {errors.lovableLink && (
              <span className="kn-form-group__error">{errors.lovableLink}</span>
            )}
          </div>

          <div className="kn-form-group">
            <label className="kn-form-group__label" htmlFor="github-link">
              GitHub Repository Link <span className="kn-form-group__required">*</span>
            </label>
            <input
              id="github-link"
              type="url"
              className={`kn-input ${errors.githubLink ? 'kn-input--error' : ''}`}
              placeholder="https://github.com/username/repo"
              value={proof.githubLink}
              onChange={(e) => handleInputChange('githubLink', e.target.value)}
              onBlur={(e) => handleBlur('githubLink', e.target.value)}
            />
            {errors.githubLink && (
              <span className="kn-form-group__error">{errors.githubLink}</span>
            )}
          </div>

          <div className="kn-form-group">
            <label className="kn-form-group__label" htmlFor="deployed-link">
              Deployed URL (Vercel or equivalent) <span className="kn-form-group__required">*</span>
            </label>
            <input
              id="deployed-link"
              type="url"
              className={`kn-input ${errors.deployedLink ? 'kn-input--error' : ''}`}
              placeholder="https://your-app.vercel.app"
              value={proof.deployedLink}
              onChange={(e) => handleInputChange('deployedLink', e.target.value)}
              onBlur={(e) => handleBlur('deployedLink', e.target.value)}
            />
            {errors.deployedLink && (
              <span className="kn-form-group__error">{errors.deployedLink}</span>
            )}
          </div>
        </div>
      </div>

      <div className="kn-proof-section">
        <h3 className="kn-proof-section__title">Status</h3>
        <div className="kn-status-selector">
          {['Not Started', 'In Progress', 'Shipped'].map((status) => (
            <button
              key={status}
              type="button"
              className={`kn-status-btn ${proof.status === status ? 'kn-status-btn--active' : ''} ${status === 'Shipped' && !canShipNow ? 'kn-status-btn--disabled' : ''}`}
              onClick={() => handleStatusChange(status)}
              disabled={status === 'Shipped' && !canShipNow}
            >
              {status}
            </button>
          ))}
        </div>
        {proof.status === 'Shipped' && (
          <p className="kn-ship-message">
            Project 1 Shipped Successfully.
          </p>
        )}
        {!canShipNow && proof.status !== 'Shipped' && (
          <p className="kn-ship-requirement">
            To ship: Provide all 3 links and complete all 10 test checklist items.
          </p>
        )}
      </div>

      <div className="kn-proof-actions">
        <button
          type="button"
          className="kn-btn kn-btn--primary"
          onClick={handleCopySubmission}
        >
          {copied ? 'Copied!' : 'Copy Final Submission'}
        </button>
        <Link to="/jt/07-test" className="kn-btn kn-btn--secondary">
          Go to Test Checklist
        </Link>
      </div>
    </section>
  )
}
