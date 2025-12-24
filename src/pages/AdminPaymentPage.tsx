import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Toast } from '../components/Toast'

interface Payment {
  id: number
  transactionId: string
  user: {
    id: number
    email: string
    firstName: string
    lastName: string
    role: string
  }
  subscriptionType: string
  amount: number
  currency: string
  status: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'EXPIRED'
  startedAt: string
  completedAt?: string
  expiresAt: string
  failureReason?: string
  chapaReference?: string
}

interface PaymentStats {
  pending: number
  successful: number
  failed: number
  expired: number
  total: number
}

export function AdminPaymentPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [stats, setStats] = useState<PaymentStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending')
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectionModal, setShowRejectionModal] = useState<number | null>(null)

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      setToast({ type: 'error', message: 'Access denied. Admin role required.' })
      return
    }

    loadPayments()
    loadStats()
  }, [user, activeTab])

  async function loadPayments() {
    try {
      setLoading(true)
      const endpoint = activeTab === 'pending' ? '/api/admin/payments/pending' : '/api/admin/payments/all'
      const { data } = await api.get(endpoint)
      const anyData = data as any
      const list: Payment[] = Array.isArray(anyData) ? anyData : Array.isArray(anyData?.content) ? anyData.content : []
      setPayments(list)
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to load payments' })
    } finally {
      setLoading(false)
    }
  }

  async function loadStats() {
    try {
      const { data } = await api.get<PaymentStats>('/api/admin/payments/stats')
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  async function approvePayment(paymentId: number) {
    setProcessing(paymentId)
    try {
      await api.post(`/api/admin/payments/${paymentId}/approve`)
      setToast({ type: 'success', message: 'Payment approved successfully' })
      loadPayments()
      loadStats()
    } catch (error: any) {
      const message = error?.response?.data?.error || 'Failed to approve payment'
      setToast({ type: 'error', message })
    } finally {
      setProcessing(null)
    }
  }

  async function rejectPayment(paymentId: number) {
    if (!rejectionReason.trim()) {
      setToast({ type: 'error', message: 'Please provide a rejection reason' })
      return
    }

    setProcessing(paymentId)
    try {
      await api.post(`/api/admin/payments/${paymentId}/reject`, { reason: rejectionReason })
      setToast({ type: 'success', message: 'Payment rejected successfully' })
      setShowRejectionModal(null)
      setRejectionReason('')
      loadPayments()
      loadStats()
    } catch (error: any) {
      const message = error?.response?.data?.error || 'Failed to reject payment'
      setToast({ type: 'error', message })
    } finally {
      setProcessing(null)
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50'
      case 'SUCCESSFUL': return 'text-green-600 bg-green-50'
      case 'FAILED': return 'text-red-600 bg-red-50'
      case 'EXPIRED': return 'text-gray-600 bg-gray-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="section">
        <div className="container max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">Admin role required to access this page.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Management</h1>
          
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg shadow">
                <div className="text-2xl font-bold text-gray-600">{stats.expired}</div>
                <div className="text-sm text-gray-600">Expired</div>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'pending'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending ({stats?.pending || 0})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Payments
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading payments...</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No payments found.</p>
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transaction ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.transactionId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{payment.user.firstName} {payment.user.lastName}</div>
                          <div className="text-gray-500">{payment.user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.subscriptionType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.currency} {payment.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(payment.startedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {payment.status === 'PENDING' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => approvePayment(payment.id)}
                              disabled={processing === payment.id}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              {processing === payment.id ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => setShowRejectionModal(payment.id)}
                              disabled={processing === payment.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        {payment.status === 'FAILED' && payment.failureReason && (
                          <span className="text-xs text-gray-500" title={payment.failureReason}>
                            Failed
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rejection Modal */}
        {showRejectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Payment</h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={3}
              />
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => {
                    setShowRejectionModal(null)
                    setRejectionReason('')
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => rejectPayment(showRejectionModal)}
                  disabled={processing === showRejectionModal}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {processing === showRejectionModal ? 'Processing...' : 'Reject Payment'}
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  )
}
