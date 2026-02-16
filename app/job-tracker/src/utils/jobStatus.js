/**
 * Job Status Tracking — localStorage: jobTrackerStatus
 * Status values: 'Not Applied' | 'Applied' | 'Rejected' | 'Selected'
 */

const STORAGE_KEY = 'jobTrackerStatus'
const DEFAULT_STATUS = 'Not Applied'

export function getJobStatus(jobId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STATUS
    const statuses = JSON.parse(raw)
    return statuses[jobId] || DEFAULT_STATUS
  } catch {
    return DEFAULT_STATUS
  }
}

export function setJobStatus(jobId, status) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const statuses = raw ? JSON.parse(raw) : {}
    statuses[jobId] = status
    localStorage.setItem(STORAGE_KEY, JSON.stringify(statuses))
    return status
  } catch {
    return null
  }
}

export function getAllStatuses() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function getStatusHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY + '_history')
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addStatusHistory(jobId, jobTitle, company, status) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY + '_history')
    const history = raw ? JSON.parse(raw) : []
    const entry = {
      jobId,
      jobTitle,
      company,
      status,
      dateChanged: new Date().toISOString(),
    }
    // Add to front, keep last 50
    history.unshift(entry)
    const trimmed = history.slice(0, 50)
    localStorage.setItem(STORAGE_KEY + '_history', JSON.stringify(trimmed))
    return entry
  } catch {
    return null
  }
}
