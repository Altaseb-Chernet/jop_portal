import { Fragment, useEffect, useMemo, useState } from 'react'
import type React from 'react'
import { useQuery } from '@tanstack/react-query'
import { Menu, Transition } from '@headlessui/react'
import {
  BellIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../hooks/useTheme'
import { getJobSeekerDashboard, getEmployerDashboard, getAdminDashboard } from '../services/dashboard'
import { getJobAlerts } from '../services/jobAlerts'
import { getMyApplications } from '../services/applications'
import { getProfilePhoto, getProfilePhotoEventName } from '../lib/storage'

const SEEN_NOTIFS_KEY = 'jp_seen_notifs'

function getSeenNotificationIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(SEEN_NOTIFS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

function setSeenNotificationIds(ids: string[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(SEEN_NOTIFS_KEY, JSON.stringify(ids))
}

function IconButton({
  onClick,
  children,
  ariaLabel,
}: {
  onClick?: () => void
  children: React.ReactNode
  ariaLabel: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="btn btn-secondary !px-3 !py-2 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800 dark:hover:bg-gray-800"
    >
      {children}
    </button>
  )
}

export function TopNavbar({ onMobileMenu }: { onMobileMenu: () => void }) {
  const { user, isAuthenticated, signOut } = useAuth()
  const navigate = useNavigate()
  const { isDark, toggle } = useTheme()
  const [q, setQ] = useState('')
  const [seenIds, setSeenIds] = useState<string[]>(() => getSeenNotificationIds())
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (user?.id) {
      setPhotoUrl(getProfilePhoto(user.id))
    } else {
      setPhotoUrl(null)
    }

    const evName = getProfilePhotoEventName()
    const handler = (e: Event) => {
      if (!user?.id) return
      const anyEv = e as any
      const changedUserId = anyEv?.detail?.userId
      if (changedUserId === user.id) {
        setPhotoUrl(getProfilePhoto(user.id))
      }
    }
    window.addEventListener(evName, handler)
    return () => window.removeEventListener(evName, handler)
  }, [user?.id])

  const dashQ = useQuery({
    queryKey: ['navbar-dashboard', user?.role],
    queryFn: async () => {
      if (user?.role === 'JOB_SEEKER') return getJobSeekerDashboard()
      if (user?.role === 'EMPLOYER') return getEmployerDashboard()
      return getAdminDashboard()
    },
    enabled: Boolean(isAuthenticated && user?.role),
    staleTime: 15_000,
  })

  const alertsQ = useQuery({
    queryKey: ['navbar-job-alerts'],
    queryFn: getJobAlerts,
    enabled: isAuthenticated && user?.role === 'JOB_SEEKER',
    staleTime: 15_000,
  })

  const myAppsQ = useQuery({
    queryKey: ['navbar-my-applications'],
    queryFn: getMyApplications,
    enabled: isAuthenticated && user?.role === 'JOB_SEEKER',
    staleTime: 15_000,
  })

  const notifications = useMemo(() => {
    if (!isAuthenticated) return [] as Array<{ id: string; title: string; body: string; action?: () => void }>

    const d: any = dashQ.data ?? {}

    if (user?.role === 'JOB_SEEKER') {
      const activeAlerts = Number(d.activeJobAlerts ?? alertsQ.data?.filter((a) => a.isActive).length ?? 0)
      const totalApps = Number(d.applicationStats?.total ?? myAppsQ.data?.length ?? 0)
      const recentApp = myAppsQ.data?.[0]

      const items = [] as Array<{ id: string; title: string; body: string; action?: () => void }>
      items.push({
        id: `alerts:${activeAlerts}`,
        title: 'Job alerts',
        body: `${activeAlerts} active alerts. Click to manage alerts.`,
        action: () => navigate('/jobseeker/alerts'),
      })
      items.push({
        id: `apps:${totalApps}`,
        title: 'Applications',
        body: `${totalApps} total applications. Click to view applied jobs.`,
        action: () => navigate('/jobseeker/applications'),
      })
      if (recentApp?.job?.id) {
        items.push({
          id: `recent-app:${recentApp.id ?? recentApp.job.id}:${String(recentApp.status ?? '')}`,
          title: 'Latest application',
          body: `${recentApp.job.title ?? 'Job'} • Status: ${String(recentApp.status ?? '—')}`,
          action: () => navigate(`/jobs/${recentApp.job!.id}`),
        })
      }
      return items
    }

    if (user?.role === 'EMPLOYER') {
      const pending = Number(d.pendingApplications ?? d.applicationStats?.pending ?? 0)
      const todays = Number(d.todaysApplications ?? 0)
      const activeJobs = Number(d.activeJobs ?? d.jobStats?.active ?? 0)
      return [
        {
          id: `employer-pending:${pending}`,
          title: 'Pending applications',
          body: `${pending} pending applications to review.`,
          action: () => navigate('/employer/applications'),
        },
        {
          id: `employer-today:${todays}`,
          title: 'Today’s applications',
          body: `${todays} applications received today.`,
          action: () => navigate('/employer/applications'),
        },
        {
          id: `employer-jobs:${activeJobs}`,
          title: 'Active jobs',
          body: `${activeJobs} active job posts.`,
          action: () => navigate('/employer/jobs'),
        },
      ]
    }

    const pendingApprovals = Number((d as any).pendingApprovals ?? 0)
    const activeUsers = Number((d as any).activeUsers ?? (d as any).systemStats?.activeUsers ?? 0)
    return [
      {
        id: `admin-approvals:${pendingApprovals}`,
        title: 'Pending approvals',
        body: `${pendingApprovals} employer approvals waiting.`,
        action: () => navigate('/admin/users'),
      },
      {
        id: `admin-users:${activeUsers}`,
        title: 'Active users',
        body: `${activeUsers} active users on the platform.`,
        action: () => navigate('/admin/users'),
      },
    ]
  }, [alertsQ.data, dashQ.data, isAuthenticated, myAppsQ.data, navigate, user?.role])

  const unseenCount = useMemo(() => {
    if (!isAuthenticated) return 0
    const current = notifications.map((n) => n.id)
    return current.filter((id) => !seenIds.includes(id)).length
  }, [isAuthenticated, notifications, seenIds])

  function markAllNotificationsSeen() {
    const current = notifications.map((n) => n.id)
    const merged = Array.from(new Set([...seenIds, ...current]))
    setSeenIds(merged)
    setSeenNotificationIds(merged)
  }

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200/70 dark:border-gray-800 bg-white/80 dark:bg-gray-950/70 backdrop-blur">
      <div className="h-16 px-4 sm:px-6 flex items-center gap-3">
        <button
          type="button"
          className="md:hidden btn btn-secondary !px-3 !py-2 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800 dark:hover:bg-gray-800"
          onClick={onMobileMenu}
          aria-label="Open navigation"
        >
          <span className="text-lg font-bold">≡</span>
        </button>

        <div className="flex-1">
          <div className="relative max-w-xl">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              className="input !pl-10 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-800"
              placeholder="Search jobs, companies, skills…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') navigate(`/jobs?search=${encodeURIComponent(q)}`)
              }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <IconButton onClick={toggle} ariaLabel="Toggle theme">
            {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
          </IconButton>

          <Menu as="div" className="relative">
            <Menu.Button className="relative" onClick={markAllNotificationsSeen}>
              <IconButton ariaLabel="Notifications">
                <BellIcon className="h-5 w-5" />
              </IconButton>
              {unseenCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-rose-600 text-white text-[11px] leading-5 text-center">
                  {unseenCount}
                </span>
              )}
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-80 origin-top-right rounded-xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg focus:outline-none overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-200/70 dark:border-gray-800">
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">Notifications</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Latest updates</div>
                </div>

                <div className="p-2">
                  {notifications.length ? (
                    notifications.map((n) => (
                      <Menu.Item key={n.id}>
                        {({ active }) => (
                          <button
                            type="button"
                            className={
                              (active ? 'bg-gray-50 dark:bg-gray-900' : '') +
                              ' w-full text-left rounded-lg px-3 py-2'
                            }
                            onClick={() => n.action?.()}
                          >
                            <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{n.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{n.body}</div>
                          </button>
                        )}
                      </Menu.Item>
                    ))
                  ) : (
                    <div className="px-3 py-6 text-sm text-gray-600 dark:text-gray-400">No notifications.</div>
                  )}
                </div>

                <div className="px-4 py-3 border-t border-gray-200/70 dark:border-gray-800">
                  <button
                    type="button"
                    className="text-sm font-medium text-primary-700 dark:text-primary-200"
                    onClick={() => navigate('/dashboard')}
                  >
                    View dashboard
                  </button>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>

          <Menu as="div" className="relative">
            <Menu.Button className="btn btn-secondary !px-3 !py-2 flex items-center gap-2 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800 dark:hover:bg-gray-800">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="h-8 w-8 rounded-full object-cover border border-gray-200/70 dark:border-gray-800" />
              ) : (
                <div className="h-8 w-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                  {(user?.firstName?.[0] || 'U') + (user?.lastName?.[0] || '')}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <div className="text-sm font-semibold leading-4">{user?.firstName || 'User'}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'GUEST'}</div>
              </div>
              <ChevronDownIcon className="h-4 w-4 opacity-80" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-lg focus:outline-none overflow-hidden">
                <div className="p-2">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={
                          (active ? 'bg-gray-50 dark:bg-gray-900' : '') +
                          ' w-full text-left rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-100'
                        }
                        onClick={() => navigate('/profile')}
                      >
                        Profile
                      </button>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        className={
                          (active ? 'bg-rose-50 dark:bg-rose-950/40' : '') +
                          ' w-full text-left rounded-lg px-3 py-2 text-sm text-rose-700 dark:text-rose-300'
                        }
                        onClick={() => {
                          signOut()
                        }}
                      >
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </div>
    </header>
  )
}
