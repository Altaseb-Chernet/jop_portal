import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getJob } from '../services/jobs'
import { applyForJob } from '../services/applications'
import { Spinner } from '../components/Spinner'
import { Toast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'

export function JobDetailsPage() {
  const { id } = useParams()
  const jobId = Number(id)
  const nav = useNavigate()
  const qc = useQueryClient()
  const { isAuthenticated, user } = useAuth()

  const [coverLetter, setCoverLetter] = useState('')
  const [coverLetterFileName, setCoverLetterFileName] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  async function onCoverLetterFile(file: File | null) {
    if (!file) return
    const maxBytes = 200_000
    if (file.size > maxBytes) {
      setToast({ type: 'error', message: 'Cover letter file is too large (max 200 KB).' })
      return
    }

    const name = file.name.toLowerCase()
    const allowed = ['.txt', '.md', '.text']
    if (!allowed.some((ext) => name.endsWith(ext))) {
      setToast({ type: 'error', message: 'Please upload a .txt or .md file.' })
      return
    }

    try {
      const text = await file.text()
      setCoverLetter(text)
      setCoverLetterFileName(file.name)
      setToast({ type: 'success', message: 'Cover letter loaded from file.' })
    } catch {
      setToast({ type: 'error', message: 'Failed to read cover letter file.' })
    }
  }

  const q = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => getJob(jobId),
    enabled: Number.isFinite(jobId),
  })

  const canApply = useMemo(() => {
    return isAuthenticated && user?.role === 'JOB_SEEKER'
  }, [isAuthenticated, user?.role])

  const applyMut = useMutation({
    mutationFn: () => applyForJob({ jobId, coverLetter: coverLetter.trim() || undefined }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['my-applications'] })
      setToast({ type: 'success', message: 'Applied successfully!' })
      nav('/dashboard')
    },
    onError: (e: any) => {
      const msg = e?.response?.data?.error || e?.response?.data?.message || 'Failed to apply'
      setToast({ type: 'error', message: msg })
    },
  })

  if (q.isLoading) return <Spinner label="Loading job…" />
  if (q.isError || !q.data)
    return (
      <div className="section">
        <div className="container">
          <div className="card">
            <div className="text-rose-700 font-semibold">Job not found</div>
            <Link className="btn btn-secondary mt-4 inline-block" to="/jobs">
              Back to jobs
            </Link>
          </div>
        </div>
      </div>
    )

  const job = q.data

  return (
    <div className="section">
      <div className="container">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl">{job.title}</h1>
            <div className="mt-2 text-gray-600">
              {job.companyName || 'Company'}
              {job.location ? ` • ${job.location}` : ''}
              {job.jobType ? ` • ${job.jobType}` : ''}
            </div>
          </div>
          <Link className="btn btn-secondary" to="/jobs">
            Back
          </Link>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl">Description</h2>
              <div className="mt-3 text-gray-700 whitespace-pre-line">{job.description || 'No description provided.'}</div>
            </div>
            <div className="card">
              <h2 className="text-xl">Skills</h2>
              <div className="mt-3 text-gray-700 whitespace-pre-line">
                {job.requiredSkills || job.preferredSkills
                  ? `Required: ${job.requiredSkills ?? '—'}\n\nPreferred: ${job.preferredSkills ?? '—'}`
                  : 'No skills provided.'}
              </div>
            </div>
            <div className="card">
              <h2 className="text-xl">Benefits</h2>
              <div className="mt-3 text-gray-700 whitespace-pre-line">{job.benefits || 'No benefits provided.'}</div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-lg">Details</h3>
              <div className="mt-3 text-sm text-gray-700 space-y-2">
                <div>
                  <span className="text-gray-500">Location:</span> {job.location || '—'}
                </div>
                <div>
                  <span className="text-gray-500">Type:</span> {job.jobType || '—'}
                </div>
                <div>
                  <span className="text-gray-500">Salary:</span>{' '}
                  {job.salaryMin || job.salaryMax
                    ? `${job.salaryMin ?? '—'} - ${job.salaryMax ?? '—'} ${job.salaryCurrency ?? ''}`
                    : '—'}
                </div>
                <div>
                  <span className="text-gray-500">Company email:</span> {job.employerEmail || '—'}
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="text-lg">Apply</h3>
              {!isAuthenticated ? (
                <div className="mt-3">
                  <div className="text-sm text-gray-600">You need to login to apply.</div>
                  <Link className="btn btn-primary mt-3 inline-block" to={`/login?redirect=/jobs/${jobId}`}>
                    Login
                  </Link>
                </div>
              ) : !canApply ? (
                <div className="mt-3 text-sm text-gray-600">Only Job Seekers can apply for jobs.</div>
              ) : (
                <div className="mt-3">
                  <label className="text-sm font-medium text-gray-700">Cover letter (optional)</label>
                  <textarea
                    className="input mt-1 min-h-[120px]"
                    value={coverLetter}
                    onChange={(e) => {
                      setCoverLetterFileName(null)
                      setCoverLetter(e.target.value)
                    }}
                    placeholder="Write a short message..."
                  />

                  <div className="mt-3">
                    <label className="text-sm font-medium text-gray-700">Upload cover letter file (optional)</label>
                    <input
                      className="input mt-1"
                      type="file"
                      accept=".txt,.md,.text,text/plain"
                      onChange={(e) => {
                        void onCoverLetterFile(e.target.files?.[0] ?? null)
                      }}
                    />
                    {coverLetterFileName && <div className="mt-1 text-xs text-gray-500">Loaded: {coverLetterFileName}</div>}
                    <div className="mt-1 text-xs text-gray-500">We’ll send the file text as your cover letter.</div>
                  </div>

                  <button
                    className="btn btn-primary w-full mt-3"
                    disabled={applyMut.isPending}
                    onClick={() => applyMut.mutate()}
                  >
                    {applyMut.isPending ? 'Applying…' : 'Apply now'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
