import { useState, useEffect } from 'react'
import {
  TEST_ITEMS,
  getTestChecklist,
  updateTestItem,
  getAllTestsPassed,
  getTestsPassedCount,
  resetTestChecklist,
} from '../utils/testChecklist'

export default function TestChecklistPage() {
  const [checklist, setChecklist] = useState(() => getTestChecklist())
  const [hoveredItem, setHoveredItem] = useState(null)

  // Calculate from current checklist state (updates when checklist changes)
  const testsPassed = TEST_ITEMS.filter((item) => checklist[item.id] === true).length
  const allPassed = TEST_ITEMS.every((item) => checklist[item.id] === true)

  useEffect(() => {
    const current = getTestChecklist()
    setChecklist(current)
  }, [])

  const handleToggle = (itemId) => {
    const newChecked = !checklist[itemId]
    updateTestItem(itemId, newChecked)
    const updated = getTestChecklist()
    setChecklist(updated)
  }

  const handleReset = () => {
    if (window.confirm('Reset all test checkboxes?')) {
      resetTestChecklist()
      setChecklist({})
    }
  }

  return (
    <section className="kn-page">
      <h1 className="kn-page__heading">Test Checklist</h1>

      <div className="kn-test-summary">
        <div className="kn-test-summary__header">
          <p className="kn-test-summary__count">
            Tests Passed: <strong>{testsPassed} / {TEST_ITEMS.length}</strong>
          </p>
          {!allPassed && (
            <p className="kn-test-summary__warning">
              Resolve all issues before shipping.
            </p>
          )}
        </div>
        <button
          type="button"
          className="kn-btn kn-btn--secondary kn-test-summary__reset"
          onClick={handleReset}
        >
          Reset Test Status
        </button>
      </div>

      <div className="kn-test-checklist">
        {TEST_ITEMS.map((item) => {
          const isChecked = checklist[item.id] === true
          return (
            <label
              key={item.id}
              className="kn-test-item"
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleToggle(item.id)}
                className="kn-test-item__checkbox"
              />
              <span className="kn-test-item__label">{item.label}</span>
              {hoveredItem === item.id && item.hint && (
                <span className="kn-test-item__hint" role="tooltip">
                  {item.hint}
                </span>
              )}
            </label>
          )
        })}
      </div>
    </section>
  )
}
