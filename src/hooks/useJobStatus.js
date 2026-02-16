import { useState, useCallback, useEffect } from 'react'
import { getJobStatus, setJobStatus, getAllStatuses, addStatusHistory } from '../utils/jobStatus'

export function useJobStatus(jobId, jobTitle, company) {
  const [status, setStatusState] = useState(() => getJobStatus(jobId))

  useEffect(() => {
    setStatusState(getJobStatus(jobId))
  }, [jobId])

  const updateStatus = useCallback(
    (newStatus) => {
      setJobStatus(jobId, newStatus)
      setStatusState(newStatus)
      if (newStatus !== 'Not Applied') {
        addStatusHistory(jobId, jobTitle, company, newStatus)
      }
      return newStatus
    },
    [jobId, jobTitle, company]
  )

  return { status, updateStatus }
}

export function useAllJobStatuses() {
  const [statuses, setStatuses] = useState(() => getAllStatuses())

  const refresh = useCallback(() => {
    setStatuses(getAllStatuses())
  }, [])

  useEffect(() => {
    // Refresh when localStorage changes (from other tabs/components)
    const handleStorageChange = (e) => {
      if (e.key === 'jobTrackerStatus') {
        refresh()
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [refresh])

  return { statuses, refresh }
}
