import { NavLink } from 'react-router-dom'

const links = [
  { to: '/builder', label: 'Builder' },
  { to: '/preview', label: 'Preview' },
  { to: '/proof', label: 'Proof' },
]

export function MainNav() {
  return (
    <nav className="flex items-center gap-8">
      {links.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `text-sm font-medium transition-colors ${
              isActive
                ? 'text-slate-100'
                : 'text-slate-400 hover:text-slate-200'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
