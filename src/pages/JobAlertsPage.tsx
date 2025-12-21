import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Spinner } from '../components/Spinner'
import { Toast } from '../components/Toast'
import { createJobAlert, deleteJobAlert, getJobAlerts, toggleJobAlertStatus, type JobAlert } from '../services/jobAlerts'

export function JobAlertsPage() {
  const qc = useQueryClient()
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const [form, setForm] = useState<Partial<JobAlert>>({
    keywords: '',
    location: '',
    jobType: undefined,
    alertFrequency: 'DAILY',
  })

  const q = useQuery({ queryKey: ['job-alerts'], queryFn: getJobAlerts })

  const createMut = useMutation({
    mutationFn: () => createJobAlert(form),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['job-alerts'] })
      setToast({ type: 'success', message: 'Alert created' })
      setForm({ keywords: '', location: '', jobType: undefined, alertFrequency: 'DAILY' })
    },
    onError: (e: any) => setToast({ type: 'error', message: e?.response?.data?.error || 'Failed to create alert' }),
  })

  const actions = useMemo(
    () => ({
      toggle: async (id: number, active: boolean) => {
        await toggleJobAlertStatus(id, !active)
        await qc.invalidateQueries({ queryKey: ['job-alerts'] })
      },
      remove: async (id: number) => {
        await deleteJobAlert(id)
        await qc.invalidateQueries({ queryKey: ['job-alerts'] })
      },
    }),
    [qc],
  )

  return (
    <div className="section">
      <div className="container">
        <h1 className="text-3xl">Job Alerts</h1>
        <p className="mt-2 text-gray-600">Create alerts and enable/disable them.</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl">Create alert</h2>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Keywords</label>
                  <input className="input mt-1" value={String(form.keywords ?? '')} onChange={(e) => setForm((p) => ({ ...p, keywords: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <input className="input mt-1" value={String(form.location ?? '')} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Job type</label>
                  <select className="input mt-1" value={String(form.jobType ?? '')} onChange={(e) => setForm((p) => ({ ...p, jobType: e.target.value || undefined }))}>
                    <option value="">Any</option>
                    <option value="FULL_TIME">Full time</option>
                    <option value="PART_TIME">Part time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="REMOTE">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Frequency</label>
                  <select className="input mt-1" value={String(form.alertFrequency ?? 'DAILY')} onChange={(e) => setForm((p) => ({ ...p, alertFrequency: e.target.value }))}>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="INSTANT">Instant</option>
                  </select>
                </div>

                <button className="btn btn-primary w-full" disabled={createMut.isPending} onClick={() => createMut.mutate()}>
                  {createMut.isPending ? 'Creating…' : 'Create'}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl">My alerts</h2>
              {q.isLoading ? (
                <Spinner label="Loading alerts…" />
              ) : q.isError ? (
                <div className="mt-4 text-rose-700">Failed to load alerts.</div>
              ) : q.data?.length ? (
                <div className="mt-4 grid gap-3">
                  {q.data.map((a) => (
                    <div key={a.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold">{a.keywords || 'Alert'}</div>
                          <div className="mt-1 text-sm text-gray-600">
                            {a.location ? `Location: ${a.location}` : 'Any location'}
                            {a.jobType ? ` • ${a.jobType}` : ''}
                          </div>
                          <div className="mt-2 text-xs text-gray-500">Active: {String(a.isActive)} • Frequency: {a.alertFrequency}</div>
                        </div>
                        <div className="flex gap-2">
                          <button className="btn btn-secondary" onClick={() => actions.toggle(a.id, Boolean(a.isActive))}>
                            {a.isActive ? 'Disable' : 'Enable'}
                          </button>
                          <button className="btn btn-secondary" onClick={() => actions.remove(a.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-gray-600">No alerts yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
