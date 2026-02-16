import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllTestsPassed } from '../utils/testChecklist'

export default function ShipPage() {
  const navigate = useNavigate()

  useEffect(() => {
    if (!getAllTestsPassed()) {
      navigate('/jt/07-test', { replace: true })
    }
  }, [navigate])

  const allPassed = getAllTestsPassed()

  if (!allPassed) {
    return null // Will redirect
  }

  return (
    <section className="kn-page">
      <h1 className="kn-page__heading">Ship</h1>
      <div className="kn-empty">
        <h2 className="kn-empty__title">All tests passed</h2>
        <p className="kn-empty__message">
          Your application is ready to ship. All checklist items have been verified.
        </p>
      </div>
    </section>
  )
}
