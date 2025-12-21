import { NavLink } from 'react-router-dom'
import type React from 'react'
// Add ChevronLeft and ChevronRight to your existing imports
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  BriefcaseIcon,
  BuildingOffice2Icon,
  ChartBarIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  BellAlertIcon,
  UserCircleIcon,
  UsersIcon,
  ArrowLeftOnRectangleIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../context/AuthContext'

type NavItem = {
  to: string
  label: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  roles?: Array<'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN'>
}

const navItems: NavItem[] = [
  { to: '/dashboard', label: 'Dashboard', icon: ChartBarIcon, roles: ['JOB_SEEKER', 'EMPLOYER', 'ADMIN'] },
  { to: '/jobs', label: 'Jobs', icon: BriefcaseIcon },
  { to: '/profile', label: 'Profile', icon: UserCircleIcon, roles: ['JOB_SEEKER', 'EMPLOYER', 'ADMIN'] },

  { to: '/jobseeker/applications', label: 'Applied Jobs', icon: DocumentTextIcon, roles: ['JOB_SEEKER'] },
  { to: '/jobseeker/cvs', label: 'My CVs', icon: DocumentTextIcon, roles: ['JOB_SEEKER'] },
  { to: '/jobseeker/alerts', label: 'Job Alerts', icon: BellAlertIcon, roles: ['JOB_SEEKER'] },

  { to: '/employer/jobs', label: 'My Jobs', icon: BuildingOffice2Icon, roles: ['EMPLOYER'] },
  { to: '/employer/applications', label: 'Applications', icon: DocumentTextIcon, roles: ['EMPLOYER'] },

  { to: '/admin/users', label: 'Users', icon: UsersIcon, roles: ['ADMIN'] },
  { to: '/admin/cv-templates', label: 'CV Templates', icon: Cog6ToothIcon, roles: ['ADMIN'] },
]

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { user, isAuthenticated, signOut } = useAuth()

  const role = user?.role

  const filtered = navItems.filter((i) => {
    if (!i.roles) return true
    if (!isAuthenticated) return false
    return Boolean(role && i.roles.includes(role))
  })

  return (
    <aside
      className={
        'h-screen sticky top-0 z-40 border-r border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-950 ' +
        (collapsed ? 'w-[76px]' : 'w-[264px]')
      }
    >
      <div className="h-full flex flex-col">
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200/70 dark:border-gray-800">
          <div className="flex items-center gap-2 overflow-hidden">
            {/* Logo Image */}
            <img 
              src="/ethiocareer.png" 
              alt="Job Portal Logo" 
              className="h-40 w-40 object-contain"
            />
            {!collapsed && (
              <div className="leading-tight">
               
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn btn-secondary !px-2 !py-2 hidden md:inline-flex dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800 dark:hover:bg-gray-800"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronDoubleRightIcon className="h-5 w-5" /> : <ChevronDoubleLeftIcon className="h-5 w-5" />}
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {filtered.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => {
                  ;(window as any).__jpCloseMobileSidebar?.()
                }}
                className={({ isActive }) =>
                  [
                    'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-950/40 dark:text-primary-200'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-900',
                  ].join(' ')
                }
              >
                <Icon className="h-5 w-5 shrink-0 opacity-90" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        <div className="p-3 border-t border-gray-200/70 dark:border-gray-800">
          {!collapsed && isAuthenticated && (
            <div className="mb-3 rounded-xl border border-gray-200/70 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 px-5 py-2 ">
              <div className="text-2xl text-green-500 dark:text-green-400">Signed in as</div>
              <div className="text-xl font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.firstName + ' ' + user?.lastName}</div>
              <div className="text-xl text-black dark:text-gray-400">{user?.role}</div>
            </div>
          )}

          {/* Sign out button removed as per your request to not change anything else */}
        </div>
      </div>
    </aside>
  )
}