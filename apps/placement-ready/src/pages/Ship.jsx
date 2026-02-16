import { Link } from 'react-router-dom'
import { getAllTestsPassed } from '../lib/testChecklistStorage'
import { isShipped } from '../lib/shippedStatus'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Lock } from 'lucide-react'

export default function Ship() {
  const checklistUnlocked = getAllTestsPassed()
  const shipped = isShipped()

  if (!checklistUnlocked) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-md w-full">
          <Card className="border-amber-200 bg-amber-50/50">
            <CardHeader>
              <div className="flex items-center gap-2 text-amber-800">
                <Lock className="w-6 h-6 shrink-0" />
                <CardTitle>Ship Locked</CardTitle>
              </div>
              <CardDescription>
                Complete all 10 tests in the Test Checklist before shipping.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">
                Go to the Test Checklist and verify each item passes. Once all 10 are checked,
                this page will unlock.
              </p>
              <Link
                to="/prp/07-test"
                className="inline-block px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover"
              >
                Open Test Checklist
              </Link>
            </CardContent>
          </Card>
          <p className="text-center mt-4">
            <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
              ← Back to app
            </Link>
          </p>
        </div>
      </div>
    )
  }

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

        <Card className="border-green-200 bg-green-50/30">
          <CardHeader>
            <CardTitle className="text-green-800">Ready to Ship</CardTitle>
            <CardDescription>
              All tests passed. {shipped ? 'Proof submitted. Status: Shipped.' : 'Complete the Proof page to reach Shipped status.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 mb-4">
              The Test Checklist confirms core flows work. {!shipped && 'Add your proof links and complete all steps to unlock Shipped status.'}
            </p>
            <Link
              to="/prp/proof"
              className="inline-block px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-hover"
            >
              {shipped ? 'View Proof' : 'Complete Proof'}
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
