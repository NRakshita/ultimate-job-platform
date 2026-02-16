import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/saved', label: 'Saved' },
  { to: '/digest', label: 'Digest' },
  { to: '/settings', label: 'Settings' },
  { to: '/proof', label: 'Proof' },
]

export default function TopNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `kn-nav__link${isActive ? ' kn-nav__link--active' : ''}`

  return (
    <header className="kn-nav">
      <Link to="/" className="kn-nav__brand">Job Notification Tracker</Link>

      <button
        type="button"
        className="kn-nav__toggle"
        onClick={() => setMenuOpen((o) => !o)}
        aria-expanded={menuOpen}
        aria-label="Toggle menu"
      >
        <span className="kn-nav__hamburger" aria-hidden />
      </button>

      <nav className={`kn-nav__menu${menuOpen ? ' kn-nav__menu--open' : ''}`}>
        <ul className="kn-nav__list">
          {NAV_ITEMS.map(({ to, label }) => (
            <li key={to} className="kn-nav__item">
              <NavLink
                to={to}
                className={linkClass}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
