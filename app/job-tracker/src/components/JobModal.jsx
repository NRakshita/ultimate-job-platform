import { useEffect } from 'react'

export default function JobModal({ job, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [onClose])

  if (!job) return null

  return (
    <div
      className="kn-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="kn-modal-title"
    >
      <div
        className="kn-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="kn-modal__header">
          <h2 id="kn-modal-title" className="kn-modal__title">{job.title}</h2>
          <p className="kn-modal__company">{job.company}</p>
          <button
            type="button"
            className="kn-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="kn-modal__body">
          <h3 className="kn-modal__label">Description</h3>
          <p className="kn-modal__description">{job.description}</p>
          <h3 className="kn-modal__label">Skills</h3>
          <ul className="kn-modal__skills">
            {job.skills.map((skill) => (
              <li key={skill} className="kn-modal__skill">{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
