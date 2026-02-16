import { useEffect, useState } from 'react'
import { JOBS } from '../data/jobs'
import { usePreferences } from '../hooks/usePreferences'
import { getDefaultPreferences } from '../utils/preferences'

const MODES = ['Remote', 'Hybrid', 'Onsite']
const EXPERIENCE_OPTIONS = ['Fresher', '0-1', '1-3', '3-5']

function getUniqueLocations(jobs) {
  const set = new Set(jobs.map((j) => j.location))
  return Array.from(set).sort()
}

const defaults = getDefaultPreferences()

export default function SettingsPage() {
  const { preferences, savePreferences } = usePreferences()
  const [roleKeywords, setRoleKeywords] = useState(defaults.roleKeywords)
  const [preferredLocations, setPreferredLocations] = useState(defaults.preferredLocations)
  const [preferredMode, setPreferredMode] = useState(defaults.preferredMode)
  const [experienceLevel, setExperienceLevel] = useState(defaults.experienceLevel)
  const [skills, setSkills] = useState(defaults.skills)
  const [minMatchScore, setMinMatchScore] = useState(defaults.minMatchScore)
  const [saved, setSaved] = useState(false)

  const locations = getUniqueLocations(JOBS)

  useEffect(() => {
    if (!preferences) return
    setRoleKeywords(preferences.roleKeywords ?? '')
    setPreferredLocations(Array.isArray(preferences.preferredLocations) ? preferences.preferredLocations : [])
    setPreferredMode(Array.isArray(preferences.preferredMode) ? preferences.preferredMode : [])
    setExperienceLevel(preferences.experienceLevel ?? '')
    setSkills(preferences.skills ?? '')
    setMinMatchScore(typeof preferences.minMatchScore === 'number' ? preferences.minMatchScore : 40)
  }, [preferences])

  const handleLocationChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, (o) => o.value)
    setPreferredLocations(selected)
  }

  const toggleMode = (mode) => {
    setPreferredMode((prev) =>
      prev.includes(mode) ? prev.filter((m) => m !== mode) : [...prev, mode]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    savePreferences({
      roleKeywords,
      preferredLocations,
      preferredMode,
      experienceLevel,
      skills,
      minMatchScore,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <section className="kn-settings">
      <h1 className="kn-settings__heading">Settings</h1>
      <p className="kn-settings__subtext">
        Configure your job preferences. Matching uses these to score roles on the dashboard.
      </p>

      <form className="kn-settings__form" onSubmit={handleSubmit}>
        <div className="kn-form-group">
          <label className="kn-form-group__label" htmlFor="role-keywords">
            Role keywords
          </label>
          <input
            id="role-keywords"
            type="text"
            className="kn-input"
            placeholder="e.g. Frontend, React, Product Manager"
            value={roleKeywords}
            onChange={(e) => setRoleKeywords(e.target.value)}
          />
        </div>

        <div className="kn-form-group">
          <label className="kn-form-group__label" htmlFor="locations">
            Preferred locations
          </label>
          <select
            id="locations"
            multiple
            className="kn-input kn-input--multiselect"
            value={preferredLocations}
            onChange={handleLocationChange}
            aria-label="Preferred locations (multi-select)"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
          <span className="kn-form-group__hint">Hold Ctrl/Cmd to select multiple.</span>
        </div>

        <div className="kn-form-group">
          <span className="kn-form-group__label">Preferred mode</span>
          <div className="kn-form-group__checkboxes">
            {MODES.map((m) => (
              <label key={m} className="kn-checkbox">
                <input
                  type="checkbox"
                  checked={preferredMode.includes(m)}
                  onChange={() => toggleMode(m)}
                />
                <span>{m}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="kn-form-group">
          <label className="kn-form-group__label" htmlFor="experience">
            Experience level
          </label>
          <select
            id="experience"
            className="kn-input kn-input--select"
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            aria-label="Experience level"
          >
            <option value="">Any</option>
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="kn-form-group">
          <label className="kn-form-group__label" htmlFor="skills">
            Skills
          </label>
          <input
            id="skills"
            type="text"
            className="kn-input"
            placeholder="e.g. Java, React, SQL"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
        </div>

        <div className="kn-form-group">
          <label className="kn-form-group__label" htmlFor="min-match-score">
            Minimum match score: {minMatchScore}
          </label>
          <input
            id="min-match-score"
            type="range"
            min={0}
            max={100}
            value={minMatchScore}
            onChange={(e) => setMinMatchScore(Number(e.target.value))}
            className="kn-slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={minMatchScore}
          />
        </div>

        <div className="kn-settings__actions">
          <button type="submit" className="kn-btn kn-btn--primary">
            Save preferences
          </button>
          {saved && <span className="kn-settings__saved">Saved.</span>}
        </div>
      </form>
    </section>
  )
}
