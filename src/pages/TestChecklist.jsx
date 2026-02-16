import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  getTestChecklist,
  setTestChecked,
  resetTestChecklist,
  TEST_IDS,
} from '../lib/testChecklistStorage'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

const TESTS = [
  {
    id: 'jd-required',
    label: 'JD required validation works',
    hint: 'Try submitting the Analyze form with empty JD. Button should be disabled.',
  },
  {
    id: 'short-jd-warning',
    label: 'Short JD warning shows for <200 chars',
    hint: 'Paste fewer than 200 characters in JD. Amber warning should appear.',
  },
  {
    id: 'skills-extraction',
    label: 'Skills extraction groups correctly',
    hint: 'Analyze a JD with React, DSA, SQL. Check Results shows skills by category.',
  },
  {
    id: 'round-mapping',
    label: 'Round mapping changes based on company + skills',
    hint: 'Compare: Amazon + DSA vs AcmeLabs + React. Round flow should differ.',
  },
  {
    id: 'score-deterministic',
    label: 'Score calculation is deterministic',
    hint: 'Same JD twice should yield same base score.',
  },
  {
    id: 'skill-toggles-live',
    label: 'Skill toggles update score live',
    hint: 'Toggle skills to Know/Practice on Results. Score updates immediately.',
  },
  {
    id: 'persist-after-refresh',
    label: 'Changes persist after refresh',
    hint: 'Toggle skills, refresh page, reopen from History. Toggles should remain.',
  },
  {
    id: 'history-saves-loads',
    label: 'History saves and loads correctly',
    hint: 'Analyze a JD, go to History. Entry should appear. Click to reopen Results.',
  },
  {
    id: 'export-buttons',
    label: 'Export buttons copy the correct content',
    hint: 'Click Copy 7-day plan, paste in notepad. Verify content matches.',
  },
  {
    id: 'no-console-errors',
    label: 'No console errors on core pages',
    hint: 'Open DevTools console. Navigate Analyze, Results, History. No red errors.',
  },
]

export default function TestChecklist() {
  const [checklist, setChecklist] = useState(getTestChecklist)
  const passed = TEST_IDS.filter((id) => checklist[id]).length

  useEffect(() => {
    setChecklist(getTestChecklist())
  }, [])

  const handleToggle = (id, checked) => {
    const next = setTestChecked(id, checked)
    setChecklist(next)
  }

  const handleReset = () => {
    resetTestChecklist()
    setChecklist(getTestChecklist())
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm text-primary hover:text-primary-hover">
            ← Back to app
          </Link>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">Test Checklist</h1>

        <Card>
          <CardHeader>
            <CardTitle>Tests Passed: {passed} / 10</CardTitle>
            <CardDescription>
              {passed < 10 ? (
                <span className="text-amber-700 font-medium">Fix issues before shipping.</span>
              ) : (
                <span className="text-green-700">All tests passed. Ready to ship.</span>
              )}
            </CardDescription>
          </CardHeader>
        </Card>

        {passed < 10 && (
          <div className="p-3 text-sm text-amber-800 bg-amber-50 rounded-lg border border-amber-200">
            Fix issues before shipping.
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Placement Readiness Platform Tests</CardTitle>
            <CardDescription>Mark each item after verifying it works.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {TESTS.map((test) => (
              <div
                key={test.id}
                className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0"
              >
                <input
                  type="checkbox"
                  id={test.id}
                  checked={!!checklist[test.id]}
                  onChange={(e) => handleToggle(test.id, e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <div className="flex-1 min-w-0">
                  <label htmlFor={test.id} className="font-medium text-gray-900 cursor-pointer">
                    {test.label}
                  </label>
                  {test.hint && (
                    <p className="text-sm text-gray-500 mt-0.5">How to test: {test.hint}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Reset checklist
          </button>
          <Link
            to="/prp/proof"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Proof
          </Link>
          <Link
            to="/prp/08-ship"
            className={`px-4 py-2 text-sm font-medium rounded-lg ${
              passed >= 10
                ? 'bg-primary text-white hover:bg-primary-hover'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed pointer-events-none'
            }`}
          >
            Go to Ship
          </Link>
        </div>
      </div>
    </div>
  )
}
