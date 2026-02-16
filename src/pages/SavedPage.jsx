import { useMemo, useState } from 'react'
import { JOBS } from '../data/jobs'
import { useSavedJobs } from '../hooks/useSavedJobs'
import { useAllJobStatuses } from '../hooks/useJobStatus'
import JobCard from '../components/JobCard'
import Toast from '../components/Toast'

export default function SavedPage() {
  const { savedIds, removeSaved, isSaved } = useSavedJobs()
  const { refresh: refreshStatuses } = useAllJobStatuses()
  const [toast, setToast] = useState(null)

  const handleStatusChange = (newStatus) => {
    refreshStatuses()
    if (newStatus !== 'Not Applied') {
      setToast(`Status updated: ${newStatus}`)
    }
  }

  const savedJobs = useMemo(() => {
    const byId = new Map(JOBS.map((j) => [j.id, j]))
    return savedIds.map((id) => byId.get(id)).filter(Boolean)
  }, [savedIds])

  return (
    <section className="kn-page">
      <h1 className="kn-page__heading">Saved</h1>
      {savedJobs.length === 0 ? (
        <div className="kn-empty">
          <h2 className="kn-empty__title">No saved jobs</h2>
          <p className="kn-empty__message">
            Jobs you save will appear here. Save roles from your dashboard or digest to revisit them later.
          </p>
        </div>
      ) : (
        <div className="kn-job-list">
          {savedJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={true}
              onSave={() => {}}
              onUnsave={removeSaved}
              showSaveButton
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
      {toast && (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}
    </section>
  )
}
