import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { verifyPayment } from '../services/payment'
import { Toast } from '../components/Toast'

export function PaymentSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [verifying, setVerifying] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'pending'>('pending')
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  useEffect(() => {
    const transactionId = searchParams.get('tx_ref')
    
    if (!transactionId) {
      setToast({ type: 'error', message: 'Invalid payment reference' })
      navigate('/subscription')
      return
    }

    verifyPaymentStatus(transactionId)
  }, [searchParams, navigate])

  async function verifyPaymentStatus(transactionId: string) {
    try {
      const payment = await verifyPayment(transactionId)
      
      if (payment.status === 'SUCCESSFUL') {
        setPaymentStatus('success')
        setToast({ type: 'success', message: 'Payment successful! Your subscription is now active.' })
      } else if (payment.status === 'FAILED') {
        setPaymentStatus('failed')
        setToast({ type: 'error', message: 'Payment failed. Please try again.' })
      } else {
        setPaymentStatus('pending')
        setToast({ type: 'info', message: 'Payment is being processed...' })
      }
    } catch (error) {
      setPaymentStatus('failed')
      setToast({ type: 'error', message: 'Failed to verify payment status' })
    } finally {
      setVerifying(false)
    }
  }

  if (verifying) {
    return (
      <div className="section">
        <div className="container max-w-lg">
          <div className="card text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container max-w-lg">
        <div className="card text-center">
          {paymentStatus === 'success' ? (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your subscription is now active. You can start posting jobs and accessing premium features.
              </p>
              <div className="space-y-3">
                <button
                  className="btn btn-primary w-full"
                  onClick={() => navigate('/dashboard')}
                >
                  Go to Dashboard
                </button>
                <button
                  className="btn btn-secondary w-full"
                  onClick={() => navigate('/employer/jobs')}
                >
                  Post a Job
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h2>
              <p className="text-gray-600 mb-6">
                Unfortunately, your payment could not be processed. Please try again or contact support.
              </p>
              <div className="space-y-3">
                <button
                  className="btn btn-primary w-full"
                  onClick={() => navigate('/subscription')}
                >
                  Try Again
                </button>
                <button
                  className="btn btn-secondary w-full"
                  onClick={() => navigate('/dashboard')}
                >
                  Back to Dashboard
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
