import { Link } from 'react-router-dom'
import { ResumeLayout } from '@/components/layout/ResumeLayout'

export function HomePage() {
  return (
    <ResumeLayout>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] px-6">
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-100 text-center max-w-xl leading-tight">
          Build a Resume That Gets Read.
        </h1>
        <p className="mt-4 text-slate-400 text-center max-w-md">
          Create a clean, professional resume with our simple builder.
        </p>
        <Link
          to="/builder"
          className="mt-8 px-6 py-3 text-sm font-medium rounded-md bg-slate-100 text-slate-900 hover:bg-white transition-colors"
        >
          Start Building
        </Link>
      </div>
    </ResumeLayout>
  )
}
