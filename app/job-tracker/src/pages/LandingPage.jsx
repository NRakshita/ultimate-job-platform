import { Link } from 'react-router-dom'

export default function LandingPage() {
  return (
    <section className="kn-landing">
      <h1 className="kn-landing__headline">Stop Missing The Right Jobs.</h1>
      <p className="kn-landing__subtext">
        Precision-matched job discovery delivered daily at 9AM.
      </p>
      <div className="kn-landing__cta">
        <Link to="/settings" className="kn-btn kn-btn--primary">
          Start Tracking
        </Link>
      </div>
    </section>
  )
}
