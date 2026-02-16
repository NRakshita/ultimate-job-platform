import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  getProofSubmission,
  setProofStep,
  setProofLinks,
  isValidUrl,
  STEP_IDS,
  STEP_LABELS,
} from '../lib/proofStorage'
import { isShipped } from '../lib/shippedStatus'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Copy } from 'lucide-react'

export default function Proof() {
  const [submission, setSubmission] = useState(getProofSubmission)
  const [errors, setErrors] = useState({ lovable: '', github: '', deployed: '' })
  const [copied, setCopied] = useState(false)
  const shipped = isShipped()

  useEffect(() => {
    setSubmission(getProofSubmission())
  }, [])

  const handleStepToggle = (stepId, checked) => {
    setSubmission(setProofStep(stepId, checked))
  }

  const fieldToErrorKey = { lovableProjectLink: 'lovable', githubRepositoryLink: 'github', deployedUrl: 'deployed' }

  const handleLinkChange = (field, value) => {
    setSubmission(setProofLinks({ [field]: value }))
    const errKey = fieldToErrorKey[field]
    if (value.trim()) {
      setErrors((e) => ({ ...e, [errKey]: isValidUrl(value) ? '' : 'Enter a valid URL (http/https)' }))
    } else {
      setErrors((e) => ({ ...e, [errKey]: '' }))
    }
  }

  const validateLinks = () => {
    const s = getProofSubmission()
    const e = {
      lovable: s.lovableProjectLink && !isValidUrl(s.lovableProjectLink) ? 'Enter a valid URL' : '',
      github: s.githubRepositoryLink && !isValidUrl(s.githubRepositoryLink) ? 'Enter a valid URL' : '',
      deployed: s.deployedUrl && !isValidUrl(s.deployedUrl) ? 'Enter a valid URL' : '',
    }
    setErrors(e)
    return !e.lovable && !e.github && !e.deployed
  }

  const handleCopySubmission = useCallback(async () => {
    const text = [
      '------------------------------------------',
      'Placement Readiness Platform — Final Submission',
      '',
      `Lovable Project: ${submission.lovableProjectLink || '(not provided)'}`,
      `GitHub Repository: ${submission.githubRepositoryLink || '(not provided)'}`,
      `Live Deployment: ${submission.deployedUrl || '(not provided)'}`,
      '',
      'Core Capabilities:',
      '- JD skill extraction (deterministic)',
      '- Round mapping engine',
      '- 7-day prep plan',
      '- Interactive readiness scoring',
      '- History persistence',
      '------------------------------------------',
    ].join('\n')

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.warn('Copy failed:', e)
    }
  }, [submission])

  const completedSteps = STEP_IDS.filter((id) => submission.steps[id]).length

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-sm text-primary hover:text-primary-hover">
            ← Back to app
          </Link>
          <span
            className={`text-xs font-medium px-2 py-1 rounded ${
              shipped
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-gray-200 text-gray-700 border border-gray-300'
            }`}
          >
            {shipped ? 'Shipped' : 'In Progress'}
          </span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">Build Proof</h1>

        {shipped && (
          <Card className="border-green-200 bg-green-50/30">
            <CardContent className="py-8">
              <p className="text-lg font-medium text-gray-900 mb-2">
                You built a real product.
              </p>
              <p className="text-gray-700 mb-2">
                Not a tutorial. Not a clone.
              </p>
              <p className="text-gray-700 mb-4">
                A structured tool that solves a real problem.
              </p>
              <p className="font-medium text-gray-900">
                This is your proof of work.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Step Completion Overview</CardTitle>
            <CardDescription>
              {completedSteps} / 8 steps completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {STEP_IDS.map((id) => (
                <li key={id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id={id}
                    checked={!!submission.steps[id]}
                    onChange={(e) => handleStepToggle(id, e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor={id} className="flex-1 cursor-pointer">
                    <span className="font-medium text-gray-900">{STEP_LABELS[id]}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      {submission.steps[id] ? 'Completed' : 'Pending'}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Artifact Inputs</CardTitle>
            <CardDescription>
              Required for Ship status. All URLs must be valid (http/https).
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="lovable" className="block text-sm font-medium text-gray-700 mb-1">
                Lovable Project Link <span className="text-red-500">*</span>
              </label>
              <input
                id="lovable"
                type="url"
                value={submission.lovableProjectLink}
                onChange={(e) => handleLinkChange('lovableProjectLink', e.target.value)}
                onBlur={() => validateLinks()}
                placeholder="https://..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.lovable ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.lovable && <p className="text-sm text-red-600 mt-1">{errors.lovable}</p>}
            </div>
            <div>
              <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                GitHub Repository Link <span className="text-red-500">*</span>
              </label>
              <input
                id="github"
                type="url"
                value={submission.githubRepositoryLink}
                onChange={(e) => handleLinkChange('githubRepositoryLink', e.target.value)}
                onBlur={() => validateLinks()}
                placeholder="https://github.com/..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.github ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.github && <p className="text-sm text-red-600 mt-1">{errors.github}</p>}
            </div>
            <div>
              <label htmlFor="deployed" className="block text-sm font-medium text-gray-700 mb-1">
                Deployed URL <span className="text-red-500">*</span>
              </label>
              <input
                id="deployed"
                type="url"
                value={submission.deployedUrl}
                onChange={(e) => handleLinkChange('deployedUrl', e.target.value)}
                onBlur={() => validateLinks()}
                placeholder="https://..."
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.deployed ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.deployed && <p className="text-sm text-red-600 mt-1">{errors.deployed}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Final Submission Export</CardTitle>
            <CardDescription>
              Copy formatted submission text to clipboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <button
              onClick={handleCopySubmission}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied' : 'Copy Final Submission'}
            </button>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Link
            to="/prp/07-test"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Test Checklist
          </Link>
          <Link
            to="/prp/08-ship"
            className="text-sm text-primary hover:text-primary-hover"
          >
            Ship →
          </Link>
        </div>
      </div>
    </div>
  )
}
