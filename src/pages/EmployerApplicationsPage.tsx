import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Spinner } from '../components/Spinner'
import { Toast } from '../components/Toast'
import { downloadApplicationCv, getApplicationsByJob, getEmployerApplications, updateApplicationStatus } from '../services/applications'
import { getEmployerJobs } from '../services/jobs'
import { getEmployerDashboard } from '../services/dashboard'
import { useAuth } from '../context/AuthContext'

const UI_STATUS_OPTIONS = [
  { label: 'Pending', ui: 'PENDING', api: 'PENDING' },
  { label: 'Reviewed', ui: 'REVIEWED', api: 'REVIEWED' },
  { label: 'Approved', ui: 'APPROVED', api: 'SHORTLISTED' },
] as const

function toUiStatus(status: unknown): string {
  const raw = String(status ?? '').toUpperCase()
  if (raw === 'SHORTLISTED') return 'APPROVED'
  return raw
}

function toApiStatus(uiStatus: string): string {
  const raw = String(uiStatus ?? '').toUpperCase()
  if (raw === 'APPROVED') return 'SHORTLISTED'
  return raw
}

function openBlobInNewTab(blob: Blob) {
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank', 'noopener,noreferrer')
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export function EmployerApplicationsPage() {
  const qc = useQueryClient()
  const { user } = useAuth()
  const employerId = user?.id

  const [view, setView] = useState<'ALL' | 'JOB'>('ALL')
  const [jobId, setJobId] = useState<number | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const jobsQ = useQuery({
    queryKey: ['employer-jobs', employerId],
    queryFn: () => getEmployerJobs(Number(employerId)),
    enabled: Boolean(employerId),
  })

  useEffect(() => {
    if (view === 'JOB' && !jobId && jobsQ.data?.length) {
      setJobId(jobsQ.data[0].id)
    }
  }, [jobId, jobsQ.data, view])

  const appsQ = useQuery({
    queryKey: view === 'ALL' ? ['employer-applications-all'] : ['job-applications', jobId],
    queryFn: () => (view === 'ALL' ? getEmployerApplications() : getApplicationsByJob(Number(jobId))),
    enabled: view === 'ALL' || Boolean(jobId),
  })

  const dashQ = useQuery({
    queryKey: ['employer-dashboard-lite'],
    queryFn: getEmployerDashboard,
    enabled: true,
    staleTime: 15_000,
  })

  const updateMut = useMutation({
    mutationFn: (p: { applicationId: number; status: string }) => updateApplicationStatus(p.applicationId, p.status),
    onSuccess: async () => {
      if (view === 'ALL') {
        await qc.invalidateQueries({ queryKey: ['employer-applications-all'] })
      } else {
        await qc.invalidateQueries({ queryKey: ['job-applications', jobId] })
      }
      setToast({ type: 'success', message: 'Status updated' })
    },
    onError: (e: any) => setToast({ type: 'error', message: e?.response?.data?.error || 'Failed to update status' }),
  })

  const jobs = useMemo(() => jobsQ.data ?? [], [jobsQ.data])

  return (
    <div className="section">
      <div className="container">
        <h1 className="text-3xl">Employer • Applications</h1>
        <p className="mt-2 text-gray-600">Select a job to view applications.</p>

        <div className="mt-6 card">
          <label className="text-sm font-medium text-gray-700">Job</label>
          {jobsQ.isLoading ? (
            <Spinner label="Loading jobs…" />
          ) : jobsQ.isError ? (
            <div className="mt-2 text-rose-700">
              Failed to load your jobs. {(jobsQ.error as any)?.response?.data?.error || (jobsQ.error as any)?.message || ''}
            </div>
          ) : !jobs.length ? (
            <div className="mt-2 text-gray-600">You have no job posts yet. Create a job first.</div>
          ) : (
            <select
              className="input mt-2"
              value={view === 'ALL' ? '__all__' : jobId ?? ''}
              onChange={(e) => {
                if (e.target.value === '__all__') {
                  setView('ALL')
                  setJobId(null)
                } else {
                  setView('JOB')
                  setJobId(e.target.value ? Number(e.target.value) : null)
                }
              }}
            >
              <option value="__all__">All jobs</option>
              <option value="">Select job</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="mt-6 card">
          <h2 className="text-xl">Applications</h2>

          {(() => {
            const d = (dashQ.data as any) ?? {}
            const pending = Number(d.pendingApplications ?? d.applicationStats?.pending ?? 0)
            if (appsQ.isLoading || appsQ.isError) return null
            if (view === 'JOB' && !jobId) return null
            if (view === 'JOB' && pending > 0 && (!appsQ.data || appsQ.data.length === 0)) {
              return (
                <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  You have {pending} pending applications overall, but none for this selected job. Try selecting another job from the dropdown.
                </div>
              )
            }
            return null
          })()}

          {view === 'JOB' && !jobId ? (
            <div className="mt-3 text-gray-600">Pick a job to see applications.</div>
          ) : appsQ.isLoading ? (
            <Spinner label="Loading applications…" />
          ) : appsQ.isError ? (
            <div className="mt-3 text-rose-700">
              Failed to load applications. {(appsQ.error as any)?.response?.data?.error || (appsQ.error as any)?.message || ''}
            </div>
          ) : appsQ.data?.length ? (
            <div className="mt-4 grid gap-3">
              {appsQ.data.map((a) => (
                <div key={a.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs text-gray-500">Job: {a.job?.title ?? '—'}</div>
                      <div className="font-semibold">
                        {a.jobSeeker?.firstName ?? ''} {a.jobSeeker?.lastName ?? ''}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">{a.jobSeeker?.email}</div>
                      <div className="text-sm text-gray-500 mt-2">Current status: {String(a.status ?? '—')}</div>
                      {a.coverLetter ? <div className="mt-3 text-sm text-gray-700 whitespace-pre-line">{a.coverLetter}</div> : null}
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          className="btn btn-secondary"
                          onClick={async () => {
                            try {
                              const { blob } = await downloadApplicationCv(a.id)
                              openBlobInNewTab(blob)
                            } catch (e: any) {
                              const msg = e?.response?.data?.message || e?.response?.data?.error || 'Failed to open CV'
                              setToast({ type: 'error', message: msg })
                            }
                          }}
                        >
                          View CV
                        </button>
                      </div>
                    </div>
                    <div className="min-w-[180px]">
                      <label className="text-xs text-gray-500">Update status</label>
                      <select
                        className="input mt-1"
                        value={toUiStatus(a.status)}
                        onChange={(e) =>
                          updateMut.mutate({
                            applicationId: a.id,
                            status: toApiStatus(e.target.value),
                          })
                        }
                      >
                        {(() => {
                          const current = toUiStatus(a.status)
                          const hasCurrent = UI_STATUS_OPTIONS.some((o) => o.ui === current)
                          return (
                            <>
                              {!hasCurrent && current ? (
                                <option value={current} disabled>
                                  {current}
                                </option>
                              ) : null}
                              {UI_STATUS_OPTIONS.map((o) => (
                                <option key={o.ui} value={o.ui}>
                                  {o.label}
                                </option>
                              ))}
                            </>
                          )
                        })()}
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3">
              <div className="text-gray-600">No applications for this job.</div>
              <button className="btn btn-secondary mt-3" onClick={() => appsQ.refetch()}>
                Refresh
              </button>
            </div>
          )}
        </div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
