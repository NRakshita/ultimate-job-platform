const MODES = ['Remote', 'Hybrid', 'Onsite']
const EXPERIENCES = ['Fresher', '0-1', '1-3', '3-5']
const SOURCES = ['LinkedIn', 'Naukri', 'Indeed']
const STATUSES = ['Not Applied', 'Applied', 'Rejected', 'Selected']
const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'company', label: 'Company A–Z' },
  { value: 'score', label: 'Match Score' },
  { value: 'salary', label: 'Salary' },
]

export default function FilterBar({
  keyword,
  onKeywordChange,
  location,
  onLocationChange,
  mode,
  onModeChange,
  experience,
  onExperienceChange,
  source,
  onSourceChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  locations,
}) {
  return (
    <div className="kn-filter-bar">
      <input
        type="search"
        className="kn-input kn-filter-bar__keyword"
        placeholder="Search by title or company"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        aria-label="Keyword search"
      />
      <select
        className="kn-input kn-filter-bar__select"
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        aria-label="Location"
      >
        <option value="">All locations</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
      <select
        className="kn-input kn-filter-bar__select"
        value={mode}
        onChange={(e) => onModeChange(e.target.value)}
        aria-label="Mode"
      >
        <option value="">All modes</option>
        {MODES.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <select
        className="kn-input kn-filter-bar__select"
        value={experience}
        onChange={(e) => onExperienceChange(e.target.value)}
        aria-label="Experience"
      >
        <option value="">All experience</option>
        {EXPERIENCES.map((exp) => (
          <option key={exp} value={exp}>{exp}</option>
        ))}
      </select>
      <select
        className="kn-input kn-filter-bar__select"
        value={source}
        onChange={(e) => onSourceChange(e.target.value)}
        aria-label="Source"
      >
        <option value="">All sources</option>
        {SOURCES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      {onStatusChange && (
        <select
          className="kn-input kn-filter-bar__select"
          value={status || ''}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Status"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}
      <select
        className="kn-input kn-filter-bar__select"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort by"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}
