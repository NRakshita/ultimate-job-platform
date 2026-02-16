import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { getDisplayScore, getValidHistoryWithCorrupted } from '../lib/storage'
import { History as HistoryIcon } from 'lucide-react'

export default function History() {
  const navigate = useNavigate()
  const { history, corruptedCount } = getValidHistoryWithCorrupted()

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleClick = (id) => {
    navigate(`/dashboard/results?id=${id}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Analysis History</h1>
        <p className="text-gray-600 mt-1">View and reopen past JD analyses.</p>
      </div>

      {corruptedCount > 0 && (
        <div className="p-3 text-sm text-amber-800 bg-amber-50 rounded-lg border border-amber-200">
          {corruptedCount === 1 ? "One" : corruptedCount} saved {corruptedCount === 1 ? "entry" : "entries"} couldn&apos;t be loaded. Create a new analysis.
        </div>
      )}

      {history.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <HistoryIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No analyses yet.</p>
            <p className="text-sm text-gray-500 mt-1">Analyze a job description to see your history here.</p>
            <button
              onClick={() => navigate('/dashboard/analyze')}
              className="mt-4 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors"
            >
              Analyze JD
            </button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((entry) => (
            <Card
              key={entry.id}
              className="cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
              onClick={() => handleClick(entry.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-base">
                    {entry.company || 'Unknown Company'}
                  </CardTitle>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-light text-primary">
                    {getDisplayScore(entry)}/100
                  </span>
                </div>
                <CardDescription>
                  {entry.role || 'No role specified'}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-500">{formatDate(entry.createdAt)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
