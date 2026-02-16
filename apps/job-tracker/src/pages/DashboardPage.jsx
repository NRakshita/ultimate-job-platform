import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { JOBS } from '../data/jobs'
import { useSavedJobs } from '../hooks/useSavedJobs'
import { usePreferences } from '../hooks/usePreferences'
import { useAllJobStatuses } from '../hooks/useJobStatus'
import { computeMatchScore, getSalarySortKey } from '../utils/matchScore'
import { getJobStatus } from '../utils/jobStatus'
import FilterBar from '../components/FilterBar'
import JobCard from '../components/JobCard'
import Toast from '../components/Toast'

function getUniqueLocations(jobs) {
  const set = new Set(jobs.map((j) => j.location))
  return Array.from(set).sort()
}

function filterAndSortJobs(items, filters, sort, statuses) {
  const { keyword, location, mode, experience, source, status } = filters
  let result = [...items]
  const kw = keyword.trim().toLowerCase()

  if (kw) {
    result = result.filter(
      (item) =>
        item.job.title.toLowerCase().includes(kw) ||
        item.job.company.toLowerCase().includes(kw)
    )
  }
  if (location) result = result.filter((item) => item.job.location === location)
  if (mode) result = result.filter((item) => item.job.mode === mode)
  if (experience) result = result.filter((item) => item.job.experience === experience)
  if (source) result = result.filter((item) => item.job.source === source)
  if (status) {
    result = result.filter((item) => {
      const jobStatus = statuses[item.job.id] || 'Not Applied'
      return jobStatus === status
    })
  }

  if (sort === 'latest') {
    result.sort((a, b) => a.job.postedDaysAgo - b.job.postedDaysAgo)
  } else if (sort === 'oldest') {
    result.sort((a, b) => b.job.postedDaysAgo - a.job.postedDaysAgo)
  } else if (sort === 'company') {
    result.sort((a, b) => a.job.company.localeCompare(b.job.company))
  } else if (sort === 'score') {
    result.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
  } else if (sort === 'salary') {
    result.sort((a, b) => getSalarySortKey(b.job.salaryRange) - getSalarySortKey(a.job.salaryRange))
  }

  return result
}

export default function DashboardPage() {
  const { addSaved, removeSaved, isSaved } = useSavedJobs()
  const { preferences, hasPreferences } = usePreferences()
  const { statuses, refresh: refreshStatuses } = useAllJobStatuses()
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [mode, setMode] = useState('')
  const [experience, setExperience] = useState('')
  const [source, setSource] = useState('')
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState('latest')
  const [onlyAboveThreshold, setOnlyAboveThreshold] = useState(false)
  const [toast, setToast] = useState(null)

  const locations = useMemo(() => getUniqueLocations(JOBS), [])

  const minThreshold = preferences?.minMatchScore ?? 40

  const jobsWithScores = useMemo(() => {
    return JOBS.map((job) => ({
      job,
      matchScore: computeMatchScore(job, preferences || {}),
    }))
  }, [preferences])

  const filteredItems = useMemo(() => {
    let list = jobsWithScores
    if (onlyAboveThreshold) {
      list = list.filter((item) => (item.matchScore ?? 0) >= minThreshold)
    }
    return filterAndSortJobs(
      list,
      { keyword, location, mode, experience, source, status },
      sort,
      statuses
    )
  }, [jobsWithScores, onlyAboveThreshold, minThreshold, keyword, location, mode, experience, source, status, sort, statuses])

  const handleStatusChange = (newStatus) => {
    refreshStatuses()
    if (newStatus !== 'Not Applied') {
      setToast(`Status updated: ${newStatus}`)
    }
  }

  return (
    <section className="kn-page kn-page--dashboard">
      <h1 className="kn-page__heading">Dashboard</h1>

      {!hasPreferences && (
        <div className="kn-banner" role="status">
          <p className="kn-banner__text">
            Set your preferences to activate intelligent matching.
          </p>
          <Link to="/settings" className="kn-btn kn-btn--secondary kn-banner__cta">
            Go to Settings
          </Link>
        </div>
      )}

      <FilterBar
        keyword={keyword}
        onKeywordChange={setKeyword}
        location={location}
        onLocationChange={setLocation}
        mode={mode}
        onModeChange={setMode}
        experience={experience}
        onExperienceChange={setExperience}
        source={source}
        onSourceChange={setSource}
        status={status}
        onStatusChange={setStatus}
        sort={sort}
        onSortChange={setSort}
        locations={locations}
      />

      {hasPreferences && (
        <label className="kn-toggle">
          <input
            type="checkbox"
            checked={onlyAboveThreshold}
            onChange={(e) => setOnlyAboveThreshold(e.target.checked)}
          />
          <span className="kn-toggle__label">Show only jobs above my threshold</span>
        </label>
      )}

      <div className="kn-job-list">
        {filteredItems.length === 0 ? (
          <div className="kn-empty">
            <h2 className="kn-empty__title">No roles match your criteria</h2>
            <p className="kn-empty__message">
              Adjust filters or lower threshold.
            </p>
          </div>
        ) : (
          filteredItems.map(({ job, matchScore }) => (
            <JobCard
              key={job.id}
              job={job}
              matchScore={hasPreferences ? matchScore : null}
              isSaved={isSaved(job.id)}
              onSave={addSaved}
              onUnsave={removeSaved}
              showSaveButton
              onStatusChange={handleStatusChange}
            />
          ))
        )}
      </div>
      {toast && (
        <Toast message={toast} onClose={() => setToast(null)} />
      )}
    </section>
  )
}
