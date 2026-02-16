import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { runAnalysis } from '../lib/analysisEngine'
import { saveAnalysis } from '../lib/storage'
import { generateCompanyIntel } from '../lib/companyIntel'
import { generateRoundMapping } from '../lib/roundMapping'
import { normalizeEntry } from '../lib/schema'

export default function Analyze() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jdText, setJdText] = useState('')
  const [loading, setLoading] = useState(false)

  const jdTrimmed = jdText.trim()
  const jdTooShort = jdTrimmed.length > 0 && jdTrimmed.length < 200
  const canSubmit = jdTrimmed.length >= 200

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    setLoading(true)

    const result = runAnalysis({ company, role, jdText })
    const companyTrimmed = company.trim()
    const extractedForIntel = result.extractedWithCategories ?? { categories: {} }
    const companyIntel = companyTrimmed
      ? generateCompanyIntel(companyTrimmed, jdText.trim(), extractedForIntel)
      : null
    const roundMapping = generateRoundMapping(companyIntel, extractedForIntel)

    const savedEntry = {
      company: companyTrimmed,
      role: role.trim(),
      jdText: jdTrimmed,
      extractedSkills: result.extractedSkills,
      plan7Days: result.plan7Days,
      checklist: result.checklist,
      questions: result.questions,
      baseScore: result.baseScore,
      companyIntel,
      roundMapping,
    }
    const id = saveAnalysis(savedEntry)
    if (!id) {
      setLoading(false)
      return
    }
    const entryWithId = normalizeEntry({ ...savedEntry, id, createdAt: new Date().toISOString() })

    setLoading(false)
    navigate(`/dashboard/results?id=${id}`, { replace: true, state: { entry: entryWithId } })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">JD Analyzer</h1>
        <p className="text-gray-600 mt-1">Paste a job description to get a tailored preparation plan.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Company and role help improve your readiness score.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company (optional)
              </label>
              <input
                id="company"
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, Microsoft"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role (optional)
              </label>
              <input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. SDE, Full Stack Developer"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="jd" className="block text-sm font-medium text-gray-700 mb-1">
                Job Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="jd"
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                placeholder="Paste the full job description here..."
                rows={12}
                required
                minLength={200}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary font-mono text-sm"
              />
              {jdTooShort && (
                <p className="text-sm text-amber-700 mt-2 p-2 bg-amber-50 rounded border border-amber-200">
                  This JD is too short to analyze deeply. Paste full JD for better output.
                </p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {jdText.length} characters. Min 200 required. Longer JDs (&gt;800 chars) improve your readiness score.
              </p>
            </div>
            <button
              type="submit"
              disabled={loading || !canSubmit}
              className="px-6 py-2.5 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
