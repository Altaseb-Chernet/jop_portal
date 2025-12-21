import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminActivateUser, adminApproveEmployer, adminDeactivateUser, adminGetUsers } from '../services/users'
import { Spinner } from '../components/Spinner'

export function AdminUsersPage() {
  const qc = useQueryClient()

  const q = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminGetUsers,
  })

  const approve = useMutation({
    mutationFn: (id: number) => adminApproveEmployer(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const deactivate = useMutation({
    mutationFn: (id: number) => adminDeactivateUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  const activate = useMutation({
    mutationFn: (id: number) => adminActivateUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-users'] }),
  })

  if (q.isLoading) return <Spinner label="Loading users…" />
  if (q.isError) {
    return (
      <div className="section">
        <div className="container">
          <div className="card border-rose-200">
            <div className="text-rose-700 font-semibold">Failed to load admin users</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="text-3xl">Admin • Users</h1>
        <p className="mt-2 text-gray-600">This page uses `/api/admin/users/*` endpoints.</p>

        <div className="mt-6 card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Active</th>
                <th className="py-3 pr-4">Approved</th>
                <th className="py-3 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {q.data?.map((u) => (
                <tr key={u.id} className="border-b last:border-b-0">
                  <td className="py-3 pr-4 font-medium">
                    {u.firstName} {u.lastName}
                    {u.companyName ? <div className="text-xs text-gray-500">{u.companyName}</div> : null}
                  </td>
                  <td className="py-3 pr-4">{u.email}</td>
                  <td className="py-3 pr-4">{String(u.role)}</td>
                  <td className="py-3 pr-4">{String(u.isActive)}</td>
                  <td className="py-3 pr-4">{String(u.isApproved)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      {u.role === 'EMPLOYER' && u.isApproved === false && (
                        <button className="btn btn-primary" disabled={approve.isPending} onClick={() => approve.mutate(u.id)}>
                          Approve
                        </button>
                      )}
                      {u.isActive ? (
                        <button className="btn btn-secondary" disabled={deactivate.isPending} onClick={() => deactivate.mutate(u.id)}>
                          Deactivate
                        </button>
                      ) : (
                        <button className="btn btn-secondary" disabled={activate.isPending} onClick={() => activate.mutate(u.id)}>
                          Activate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
