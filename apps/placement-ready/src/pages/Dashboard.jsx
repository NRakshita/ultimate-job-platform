import { Link } from 'react-router-dom'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '../components/ui/card'

const SKILL_DATA = [
  { subject: 'DSA', value: 75, fullMark: 100 },
  { subject: 'System Design', value: 60, fullMark: 100 },
  { subject: 'Communication', value: 80, fullMark: 100 },
  { subject: 'Resume', value: 85, fullMark: 100 },
  { subject: 'Aptitude', value: 70, fullMark: 100 },
]

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAYS_WITH_ACTIVITY = [0, 1, 2, 3] // Mon-Thu filled

const ASSESSMENTS = [
  { title: 'DSA Mock Test', time: 'Tomorrow, 10:00 AM' },
  { title: 'System Design Review', time: 'Wed, 2:00 PM' },
  { title: 'HR Interview Prep', time: 'Friday, 11:00 AM' },
]

function OverallReadiness() {
  const score = 72
  const max = 100
  const size = 160
  const strokeWidth = 12
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const progress = score / max
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Readiness</CardTitle>
        <CardDescription>Your placement preparation score</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            className="transform -rotate-90"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsl(245, 58%, 90%)"
              strokeWidth={strokeWidth}
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="hsl(245, 58%, 51%)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 0.5s ease-in-out',
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{score}/{max}</span>
            <span className="text-xs text-gray-500 mt-1">Readiness Score</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SkillBreakdown() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Breakdown</CardTitle>
        <CardDescription>Performance across key areas</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={SKILL_DATA}>
              <PolarGrid stroke="hsl(245, 58%, 90%)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#374151', fontSize: 12 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: '#6b7280', fontSize: 10 }}
              />
              <Radar
                name="Score"
                dataKey="value"
                stroke="hsl(245, 58%, 51%)"
                fill="hsl(245, 58%, 51%)"
                fillOpacity={0.3}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function ContinuePractice() {
  const completed = 3
  const total = 10
  const progress = (completed / total) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Continue Practice</CardTitle>
        <CardDescription>Pick up where you left off</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-medium text-gray-900 mb-3">Dynamic Programming</p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>{completed}/{total} completed</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <button className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-sm font-medium rounded-lg transition-colors">
          Continue
        </button>
      </CardFooter>
    </Card>
  )
}

function WeeklyGoals() {
  const solved = 12
  const goal = 20
  const progress = (solved / goal) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Goals</CardTitle>
        <CardDescription>This week&apos;s progress</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-700">Problems Solved</span>
            <span className="font-medium text-gray-900">{solved}/{goal} this week</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between items-center gap-2">
          {WEEK_DAYS.map((day, i) => (
            <div
              key={day}
              className="flex flex-col items-center gap-1"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  DAYS_WITH_ACTIVITY.includes(i)
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {day.slice(0, 1)}
              </div>
              <span className="text-xs text-gray-500">{day}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function UpcomingAssessments() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Assessments</CardTitle>
        <CardDescription>Your scheduled sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {ASSESSMENTS.map((item) => (
            <li
              key={item.title}
              className="flex justify-between items-start gap-4 py-2 border-b border-gray-100 last:border-0 last:pb-0 first:pt-0"
            >
              <span className="font-medium text-gray-900">{item.title}</span>
              <span className="text-sm text-gray-500 shrink-0">{item.time}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OverallReadiness />
        <SkillBreakdown />
        <ContinuePractice />
        <WeeklyGoals />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <Link to="/dashboard/analyze">
            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
              <CardContent className="py-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Analyze Job Description</h3>
                  <p className="text-sm text-gray-500 mt-0.5">Get a tailored preparation plan from any JD</p>
                </div>
                <span className="text-primary font-medium text-sm">Go →</span>
              </CardContent>
            </Card>
          </Link>
        </div>
        <div className="lg:col-span-2">
          <UpcomingAssessments />
        </div>
      </div>
    </div>
  )
}
