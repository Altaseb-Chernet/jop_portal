import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { getMyApplications, withdrawApplication } from '../services/applications'
import { Spinner } from '../components/Spinner'

export function MyApplicationsPage() {
  const qc = useQueryClient()
  const q = useQuery({ queryKey: ['my-applications'], queryFn: getMyApplications })

  const withdraw = useMutation({
    mutationFn: (id: number) => withdrawApplication(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['my-applications'] }),
  })

  if (q.isLoading) return <Spinner label="Loading applied jobs…" />

  return (
    <div className="section">
      <div className="container">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl">Applied Jobs</h1>
            <p className="mt-2 text-gray-600">From `GET /api/applications/my-applications`</p>
          </div>
          <Link className="btn btn-secondary" to="/jobs">
            Browse jobs
          </Link>
        </div>

        {q.isError ? (
          <div className="mt-6 card border-rose-200">
            <div className="text-rose-700 font-semibold">Failed to load applications</div>
          </div>
        ) : (
          <div className="mt-6 grid gap-4">
            {q.data?.length ? (
              q.data.map((a) => (
                <div className="card" key={a.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-lg font-semibold">{a.job?.title ?? 'Job'}</div>
                      <div className="mt-1 text-sm text-gray-600">
                        {a.job?.companyName ?? 'Company'} {a.job?.location ? `• ${a.job.location}` : ''}
                      </div>
                      <div className="mt-2 text-sm text-gray-500">Status: {String(a.status ?? '—')}</div>
                    </div>
                    <div className="flex gap-2">
                      {a.job?.id ? (
                        <Link className="btn btn-secondary" to={`/jobs/${a.job.id}`}>
                          View job
                        </Link>
                      ) : null}
                      <button
                        className="btn btn-secondary"
                        disabled={withdraw.isPending}
                        onClick={() => withdraw.mutate(a.id)}
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-600">No applications yet.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
