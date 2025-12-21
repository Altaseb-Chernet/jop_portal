import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { filterJobs, getJobs, searchJobs } from '../services/jobs'
import type { Job } from '../types/job'
import { Spinner } from '../components/Spinner'

function JobCard({ job }: { job: Job }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-semibold text-gray-900">{job.title}</div>
          <div className="mt-1 text-sm text-gray-600">
            {job.companyName || 'Company'}
            {job.location ? ` • ${job.location}` : ''}
            {job.jobType ? ` • ${job.jobType}` : ''}
          </div>
          <div className="mt-3 text-sm text-gray-600 line-clamp-2">{job.description || 'No description provided.'}</div>
        </div>
        <Link className="btn btn-primary whitespace-nowrap" to={`/jobs/${job.id}`}>
          View
        </Link>
      </div>
      {(job.salaryMin || job.salaryMax) && (
        <div className="mt-4 text-sm text-gray-500">
          Salary:{' '}
          <span className="font-medium text-gray-700">
            {job.salaryMin ?? '—'} - {job.salaryMax ?? '—'} {job.salaryCurrency ?? ''}
          </span>
        </div>
      )}
    </div>
  )
}

export function JobsPage() {
  const [keyword, setKeyword] = useState('')
  const [location, setLocation] = useState('')
  const [jobType, setJobType] = useState('')
  const [minSalary, setMinSalary] = useState<string>('')
  const [maxSalary, setMaxSalary] = useState<string>('')

  const params = useMemo(() => {
    return {
      keyword: keyword.trim(),
      location: location.trim() || undefined,
      jobType: jobType || undefined,
      minSalary: minSalary ? Number(minSalary) : undefined,
      maxSalary: maxSalary ? Number(maxSalary) : undefined,
    }
  }, [keyword, location, jobType, minSalary, maxSalary])

  const query = useQuery({
    queryKey: ['jobs', params],
    queryFn: async () => {
      if (params.keyword) return searchJobs(params.keyword)
      if (params.location || params.jobType || params.minSalary || params.maxSalary) {
        return filterJobs({
          location: params.location,
          jobType: params.jobType,
          minSalary: params.minSalary,
          maxSalary: params.maxSalary,
        })
      }
      return getJobs()
    },
  })

  return (
    <div className="section">
      <div className="container">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-3xl">Jobs</h1>
            <p className="mt-2 text-gray-600">Search and filter active jobs from your backend.</p>
          </div>
        </div>

        <div className="card mt-6">
          <div className="grid gap-4 md:grid-cols-5">
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Search</label>
              <input
                className="input mt-1"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="keyword (title, company, etc.)"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Location</label>
              <input className="input mt-1" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Job type</label>
              <select className="input mt-1" value={jobType} onChange={(e) => setJobType(e.target.value)}>
                <option value="">All</option>
                <option value="FULL_TIME">Full time</option>
                <option value="PART_TIME">Part time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Min</label>
                <input className="input mt-1" inputMode="numeric" value={minSalary} onChange={(e) => setMinSalary(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Max</label>
                <input className="input mt-1" inputMode="numeric" value={maxSalary} onChange={(e) => setMaxSalary(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">Showing results from `/api/jobs` endpoints.</div>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setKeyword('')
                setLocation('')
                setJobType('')
                setMinSalary('')
                setMaxSalary('')
              }}
            >
              Reset
            </button>
          </div>
        </div>

        {query.isLoading ? (
          <Spinner label="Loading jobs…" />
        ) : query.isError ? (
          <div className="mt-6 card border-rose-200">
            <div className="text-rose-700 font-semibold">Failed to load jobs</div>
            <div className="mt-1 text-sm text-rose-700/80">Make sure your backend is running on http://localhost:8080</div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {query.data?.length ? query.data.map((j) => <JobCard key={j.id} job={j} />) : <div className="text-gray-600">No jobs found.</div>}
          </div>
        )}
      </div>
    </div>
  )
}
