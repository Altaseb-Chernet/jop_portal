import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { getAdminDashboard, getEmployerDashboard, getJobSeekerDashboard } from '../services/dashboard'
import { getMyApplications } from '../services/applications'
import { Spinner } from '../components/Spinner'

function StatCard({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) {
  return (
    <div className="card">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-gray-100">{value}</div>
      {subtitle && <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">{subtitle}</div>}
    </div>
  )
}

function Badge({ status }: { status: 'Active' | 'Pending' | 'Blocked' }) {
  const cls =
    status === 'Active'
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-900'
      : status === 'Pending'
        ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900'
        : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-900'

  return <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>{status}</span>
}

function SparkLine({ points }: { points: number[] }) {
  const w = 520
  const h = 180
  const pad = 12
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const step = (w - pad * 2) / Math.max(1, points.length - 1)
  const d = points
    .map((v, i) => {
      const x = pad + i * step
      const y = pad + (h - pad * 2) * (1 - (v - min) / range)
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
    })
    .join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44">
      <defs>
        <linearGradient id="sl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0ea5e9" stopOpacity="0.35" />
          <stop offset="1" stopColor="#0ea5e9" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />
      <path d={`${d} L ${w - pad} ${h - pad} L ${pad} ${h - pad} Z`} fill="url(#sl)" />
    </svg>
  )
}

function BarChart({ values }: { values: Array<{ label: string; value: number }> }) {
  const max = Math.max(...values.map((v) => v.value), 1)
  return (
    <div className="space-y-3">
      {values.map((v) => (
        <div key={v.label}>
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="font-medium text-gray-700 dark:text-gray-200">{v.label}</div>
            <div>{v.value}</div>
          </div>
          <div className="mt-2 h-2 rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-600"
              style={{ width: `${Math.round((v.value / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

function PieChart({ items }: { items: Array<{ label: string; value: number; color: string }> }) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1
  const r = 46
  const c = 56
  let acc = 0

  const slices = items.map((i) => {
    const a0 = (acc / total) * Math.PI * 2
    acc += i.value
    const a1 = (acc / total) * Math.PI * 2
    const x0 = c + r * Math.cos(a0)
    const y0 = c + r * Math.sin(a0)
    const x1 = c + r * Math.cos(a1)
    const y1 = c + r * Math.sin(a1)
    const large = a1 - a0 > Math.PI ? 1 : 0
    const d = `M ${c} ${c} L ${x0} ${y0} A ${r} ${r} 0 ${large} 1 ${x1} ${y1} Z`
    return { d, color: i.color, label: i.label, value: i.value }
  })

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 112 112" className="h-32 w-32 shrink-0">
        {slices.map((s) => (
          <path key={s.label} d={s.d} fill={s.color} />
        ))}
        <circle cx="56" cy="56" r="26" className="fill-white dark:fill-gray-950" />
      </svg>
      <div className="space-y-2">
        {items.map((i) => (
          <div key={i.label} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: i.color }} />
            <span className="text-gray-700 dark:text-gray-200">{i.label}</span>
            <span className="text-gray-500 dark:text-gray-400">({i.value})</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DashboardPage() {
  const { user } = useAuth()

  const dashQuery = useQuery({
    queryKey: ['dashboard', user?.role],
    queryFn: async () => {
      if (user?.role === 'JOB_SEEKER') return getJobSeekerDashboard()
      if (user?.role === 'EMPLOYER') return getEmployerDashboard()
      return getAdminDashboard()
    },
    enabled: Boolean(user?.role),
  })

  const myApps = useQuery({
    queryKey: ['my-applications'],
    queryFn: getMyApplications,
    enabled: user?.role === 'JOB_SEEKER',
  })

  const roleTitle = useMemo(() => {
    if (user?.role === 'JOB_SEEKER') return 'Job Seeker Dashboard'
    if (user?.role === 'EMPLOYER') return 'Employer Dashboard'
    return 'Admin Dashboard'
  }, [user?.role])

  const errorStatus = (dashQuery.error as any)?.response?.status
  const backendMsg =
    (dashQuery.error as any)?.response?.data?.message ||
    (dashQuery.error as any)?.response?.data?.error ||
    (dashQuery.error as any)?.message

  const d = (dashQuery.data as any) ?? {}

  const charts = useMemo(() => {
    const line =
      user?.role === 'JOB_SEEKER'
        ? [3, 5, 4, 7, 6, 9, 8]
        : user?.role === 'EMPLOYER'
          ? [2, 3, 5, 4, 6, 5, 7]
          : [4, 3, 4, 6, 5, 6, 8]

    const bars =
      user?.role === 'JOB_SEEKER'
        ? [
            { label: 'Applications', value: Number(d.applicationStats?.total ?? 0) },
            { label: 'Active alerts', value: Number(d.activeJobAlerts ?? 0) },
            { label: 'Completeness', value: Number(d.profileCompleteness ?? 0) },
          ]
        : user?.role === 'EMPLOYER'
          ? [
              { label: 'Active jobs', value: Number(d.activeJobs ?? 0) },
              { label: 'Today', value: Number(d.todaysApplications ?? 0) },
              { label: 'Pending', value: Number(d.pendingApplications ?? 0) },
            ]
          : [
              { label: 'Active users', value: Number(d.activeUsers ?? 0) },
              { label: 'Approvals', value: Number(d.pendingApprovals ?? 0) },
              { label: 'Total users', value: Number(d.systemStats?.totalUsers ?? 0) },
            ]

    const pie =
      user?.role === 'JOB_SEEKER'
        ? [
            { label: 'Applied', value: Number(d.applicationStats?.total ?? 0), color: '#0ea5e9' },
            { label: 'Accepted', value: Number(d.applicationStats?.accepted ?? 0), color: '#22c55e' },
            { label: 'Rejected', value: Number(d.applicationStats?.rejected ?? 0), color: '#f43f5e' },
          ]
        : user?.role === 'EMPLOYER'
          ? [
              { label: 'Active', value: Number(d.activeJobs ?? 0), color: '#0ea5e9' },
              { label: 'Pending', value: Number(d.pendingApplications ?? 0), color: '#f59e0b' },
              { label: 'Other', value: Math.max(0, Number(d.todaysApplications ?? 0) - Number(d.pendingApplications ?? 0)), color: '#22c55e' },
            ]
          : [
              { label: 'Active', value: Number(d.activeUsers ?? 0), color: '#22c55e' },
              { label: 'Pending', value: Number(d.pendingApprovals ?? 0), color: '#f59e0b' },
              {
                label: 'Inactive',
                value: Math.max(0, Number(d.systemStats?.totalUsers ?? 0) - Number(d.activeUsers ?? 0)),
                color: '#f43f5e',
              },
            ]

    return { line, bars, pie }
  }, [d, user?.role])

  const activity = useMemo(() => {
    if (user?.role === 'JOB_SEEKER' && myApps.data?.length) {
      return myApps.data.slice(0, 6).map((a) => {
        const raw = String(a.status ?? '').toUpperCase()
        const status: 'Active' | 'Pending' | 'Blocked' =
          raw.includes('PENDING') || raw.includes('SUBMITTED') ? 'Pending' : raw.includes('REJECT') ? 'Blocked' : 'Active'

        return {
          id: a.id,
          title: a.job?.title ?? 'Job Application',
          meta: `${a.job?.companyName ?? 'Company'}${a.job?.location ? ` • ${a.job.location}` : ''}`,
          status,
          date: a.appliedAt
            ? new Date(a.appliedAt).toLocaleDateString()
            : a.updatedAt
              ? new Date(a.updatedAt).toLocaleDateString()
              : '—',
        }
      })
    }

    if (user?.role === 'EMPLOYER') {
      return [
        { id: 1, title: 'Job post reviewed', meta: 'Backend Developer', status: 'Active' as const, date: 'Today' },
        { id: 2, title: 'New application received', meta: 'UI/UX Designer', status: 'Pending' as const, date: 'Today' },
        { id: 3, title: 'Candidate withdrawn', meta: 'QA Engineer', status: 'Blocked' as const, date: 'Yesterday' },
      ]
    }

    return [
      { id: 1, title: 'Employer approval request', meta: 'New employer', status: 'Pending' as const, date: 'Today' },
      { id: 2, title: 'User deactivated', meta: 'Policy enforcement', status: 'Blocked' as const, date: 'Yesterday' },
      { id: 3, title: 'System health check', meta: 'All services ok', status: 'Active' as const, date: 'This week' },
    ]
  }, [myApps.data, user?.role])

  return (
    <div className="section">
      <div className="container">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl">{roleTitle}</h1>
          </div>
        </div>

        {dashQuery.isLoading && (
          <div className="mt-4">
            <Spinner label="Loading dashboard…" />
          </div>
        )}

        {!dashQuery.isLoading && dashQuery.isError && (
          <div className="mt-6 card border-rose-200">
            <div className="text-rose-700 font-semibold">Dashboard data could not be loaded</div>
            {errorStatus === 403 && user?.role === 'EMPLOYER' && user?.isApproved === false ? (
              <div className="mt-1 text-sm text-rose-700/80">
                Your employer account is pending admin approval. Login as Admin and approve this employer, then try again.
              </div>
            ) : errorStatus === 401 ? (
              <div className="mt-1 text-sm text-rose-700/80">Your session expired. Please login again.</div>
            ) : errorStatus === 403 ? (
              <div className="mt-1 text-sm text-rose-700/80">You don’t have permission to access this dashboard.</div>
            ) : (
              <div className="mt-1 text-sm text-rose-700/80">Backend may be offline or blocked. The UI will still load with placeholders.</div>
            )}

            {backendMsg && <div className="mt-2 text-xs text-rose-700/70">{String(backendMsg)}</div>}

            <button className="btn btn-secondary mt-4" onClick={() => dashQuery.refetch()}>
              Retry
            </button>
          </div>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Trends</div>
                <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">Weekly activity</div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Last 7 days</div>
            </div>
            <div className="mt-4">
              <SparkLine points={charts.line} />
            </div>
          </div>

          <div className="card">
            <div className="text-sm text-gray-500 dark:text-gray-400">Breakdown</div>
            <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">Key metrics</div>
            <div className="mt-4">
              <BarChart values={charts.bars} />
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div className="card lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Insights</div>
                <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">Distribution</div>
              </div>
            </div>
            <div className="mt-4">
              <PieChart items={charts.pie} />
            </div>
          </div>

          <div className="card">
            <div className="text-sm text-gray-500 dark:text-gray-400">Recent activity</div>
            <div className="mt-1 font-semibold text-gray-900 dark:text-gray-100">Latest updates</div>
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-200/70 dark:border-gray-800">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr className="text-left text-xs text-gray-500 dark:text-gray-400">
                    <th className="px-3 py-2 font-semibold">Item</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                    <th className="px-3 py-2 font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.slice(0, 6).map((r) => (
                    <tr key={r.id} className="border-t border-gray-200/70 dark:border-gray-800">
                      <td className="px-3 py-2">
                        <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">{r.title}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{r.meta}</div>
                      </td>
                      <td className="px-3 py-2">
                        <Badge status={r.status} />
                      </td>
                      <td className="px-3 py-2 text-gray-500 dark:text-gray-400">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {user?.role === 'JOB_SEEKER' && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StatCard title="Profile completeness" value={`${d.profileCompleteness ?? 0}%`} />
            <StatCard title="Active job alerts" value={d.activeJobAlerts ?? 0} />
            <StatCard title="Applications" value={d.applicationStats?.total ?? 0} subtitle="Total" />
          </div>
        )}

        {user?.role === 'EMPLOYER' && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StatCard title="Active jobs" value={d.activeJobs ?? d.jobStats?.active ?? 0} />
            <StatCard title="Today’s applications" value={d.todaysApplications ?? 0} />
            <StatCard title="Pending applications" value={d.pendingApplications ?? d.applicationStats?.pending ?? 0} />
            <div className="md:col-span-3 flex flex-wrap gap-3">
              <a className="btn btn-secondary" href="/employer/applications">
                Review applications
              </a>
              <a className="btn btn-secondary" href="/employer/jobs">
                Manage jobs
              </a>
            </div>
          </div>
        )}

        {user?.role === 'ADMIN' && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <StatCard title="Active users" value={d.activeUsers ?? 0} />
            <StatCard title="Pending approvals" value={d.pendingApprovals ?? 0} />
            <StatCard title="Total users" value={d.systemStats?.totalUsers ?? '—'} />
          </div>
        )}

        {user?.role === 'JOB_SEEKER' && (
          <div className="mt-8">
            <h2 className="text-xl">My applications</h2>
            <div className="mt-4">
              {myApps.isLoading ? (
                <Spinner label="Loading applications…" />
              ) : myApps.isError ? (
                <div className="text-rose-700">Failed to load applications.</div>
              ) : myApps.data?.length ? (
                <div className="grid gap-3">
                  {myApps.data.map((a) => (
                    <div key={a.id} className="card">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold">{a.job?.title ?? 'Job'}</div>
                          <div className="text-sm text-gray-600">
                            {a.job?.companyName ?? 'Company'} {a.job?.location ? `• ${a.job.location}` : ''}
                          </div>
                          <div className="mt-2 text-sm text-gray-500">Status: {String(a.status ?? '—')}</div>
                        </div>
                        {a.job?.id && (
                          <a className="btn btn-secondary" href={`/jobs/${a.job.id}`}>
                            View job
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-600">No applications yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
