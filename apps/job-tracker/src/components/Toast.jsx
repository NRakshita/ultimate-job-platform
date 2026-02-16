import { useEffect } from 'react'

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="kn-toast" role="status" aria-live="polite">
      <p className="kn-toast__message">{message}</p>
      <button
        type="button"
        className="kn-toast__close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
    </div>
  )
}
