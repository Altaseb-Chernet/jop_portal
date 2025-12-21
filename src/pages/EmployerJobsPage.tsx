import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Spinner } from '../components/Spinner'
import { Toast } from '../components/Toast'
import type { Job, JobType } from '../types/job'
import {
  createJob,
  deleteJob,
  getEmployerJobs,
  toggleJobStatus,
  updateJob,
} from '../services/jobs'
import { useAuth } from '../context/AuthContext'

const emptyJob: Partial<Job> = {
  title: '',
  description: '',
  location: '',
  jobType: 'FULL_TIME',
  salaryCurrency: 'USD',
  isRemote: false,
  vacancies: 1,
}

export function EmployerJobsPage() {
  const qc = useQueryClient()
  const { user } = useAuth()

  const [editing, setEditing] = useState<Job | null>(null)
  const [form, setForm] = useState<Partial<Job>>(emptyJob)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const employerId = user?.id

  const q = useQuery({
    queryKey: ['employer-jobs', employerId],
    queryFn: () => getEmployerJobs(Number(employerId)),
    enabled: Boolean(employerId),
  })

  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = { ...form }
      if (editing) return updateJob(editing.id, payload)
      return createJob(payload)
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['employer-jobs'] })
      setToast({ type: 'success', message: editing ? 'Job updated' : 'Job created' })
      setEditing(null)
      setForm(emptyJob)
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.error || 'Failed to save job'
      setToast({ type: 'error', message: msg })
    },
  })

  const delMut = useMutation({
    mutationFn: (id: number) => deleteJob(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employer-jobs'] }),
  })

  const toggleMut = useMutation({
    mutationFn: (p: { id: number; isActive: boolean }) => toggleJobStatus(p.id, !p.isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['employer-jobs'] }),
  })

  const jobTypeValue = useMemo(() => String(form.jobType ?? 'FULL_TIME') as JobType, [form.jobType])

  return (
    <div className="section">
      <div className="container">
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-3xl">Employer • Jobs</h1>
            <p className="mt-2 text-gray-600">Create and manage your job posts.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl">{editing ? 'Edit job' : 'Post a job'}</h2>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Title</label>
                  <input className="input mt-1" value={String(form.title ?? '')} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea className="input mt-1 min-h-[120px]" value={String(form.description ?? '')} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Location</label>
                  <input className="input mt-1" value={String(form.location ?? '')} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Type</label>
                    <select className="input mt-1" value={jobTypeValue} onChange={(e) => setForm((p) => ({ ...p, jobType: e.target.value as JobType }))}>
                      <option value="FULL_TIME">Full time</option>
                      <option value="PART_TIME">Part time</option>
                      <option value="CONTRACT">Contract</option>
                      <option value="INTERNSHIP">Internship</option>
                      <option value="REMOTE">Remote</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Vacancies</label>
                    <input className="input mt-1" inputMode="numeric" value={String(form.vacancies ?? 1)} onChange={(e) => setForm((p) => ({ ...p, vacancies: Number(e.target.value || 1) }))} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Salary min</label>
                    <input className="input mt-1" inputMode="decimal" value={String(form.salaryMin ?? '')} onChange={(e) => setForm((p) => ({ ...p, salaryMin: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Salary max</label>
                    <input className="input mt-1" inputMode="decimal" value={String(form.salaryMax ?? '')} onChange={(e) => setForm((p) => ({ ...p, salaryMax: e.target.value }))} />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={Boolean(form.isRemote)} onChange={(e) => setForm((p) => ({ ...p, isRemote: e.target.checked }))} />
                  Remote
                </label>

                <button className="btn btn-primary w-full" disabled={saveMut.isPending} onClick={() => saveMut.mutate()}>
                  {saveMut.isPending ? 'Saving…' : editing ? 'Update job' : 'Create job'}
                </button>
                {editing && (
                  <button
                    className="btn btn-secondary w-full"
                    onClick={() => {
                      setEditing(null)
                      setForm(emptyJob)
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl">My job posts</h2>
              {q.isLoading ? (
                <Spinner label="Loading your jobs…" />
              ) : q.isError ? (
                <div className="mt-4 text-rose-700">Failed to load jobs.</div>
              ) : q.data?.length ? (
                <div className="mt-4 grid gap-3">
                  {q.data.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold">{job.title}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {job.location} • {job.jobType} • Active: {String(job.isActive)}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setEditing(job)
                              setForm(job)
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-secondary"
                            disabled={toggleMut.isPending}
                            onClick={() => toggleMut.mutate({ id: job.id, isActive: Boolean(job.isActive) })}
                          >
                            {job.isActive ? 'Disable' : 'Enable'}
                          </button>
                          <button className="btn btn-secondary" disabled={delMut.isPending} onClick={() => delMut.mutate(job.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-gray-600">No jobs yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
