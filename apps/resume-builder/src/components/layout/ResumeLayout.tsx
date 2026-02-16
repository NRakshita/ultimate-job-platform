import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { MainNav } from './MainNav'

interface ResumeLayoutProps {
  children: ReactNode
}

export function ResumeLayout({ children }: ResumeLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
      <header className="no-print h-14 flex items-center justify-between px-6 border-b border-slate-800/80">
        <Link to="/" className="text-base font-semibold text-slate-100">
          AI Resume Builder
        </Link>
        <MainNav />
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}
