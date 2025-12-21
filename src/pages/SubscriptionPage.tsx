import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSubscriptionPlans, initializePayment, type PaymentInitRequest, type SubscriptionPlan } from '../services/payment'
import { useAuth } from '../context/AuthContext'
import { Toast } from '../components/Toast'

export function SubscriptionPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [plans, setPlans] = useState<Record<string, SubscriptionPlan>>({})
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    if (user?.role !== 'EMPLOYER') {
      setToast({ type: 'error', message: 'Subscription is only available for employers' })
      navigate('/dashboard')
      return
    }

    loadPlans()
  }, [isAuthenticated, user, navigate])

  async function loadPlans() {
    try {
      const plansData = await getSubscriptionPlans()
      setPlans(plansData)
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to load subscription plans' })
    } finally {
      setLoading(false)
    }
  }

  async function handleSubscribe(planType: string) {
    if (!planType) {
      setToast({ type: 'error', message: 'Please select a subscription plan' })
      return
    }

    setProcessing(true)
    try {
      const request: PaymentInitRequest = {
        subscriptionType: planType as 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
      }

      const paymentResponse = await initializePayment(request)
      
      if (paymentResponse.chapaCheckoutUrl) {
        // Redirect to Chapa payment page
        window.location.href = paymentResponse.chapaCheckoutUrl
      } else {
        setToast({ type: 'error', message: 'Payment initialization failed' })
      }
    } catch (error: any) {
      const message = error?.response?.data?.error || 'Failed to initialize payment'
      setToast({ type: 'error', message })
    } finally {
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="section">
        <div className="container max-w-4xl">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading subscription plans...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Subscription Plan</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock premium features to find the best talent for your company. 
            Choose the plan that fits your hiring needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {Object.entries(plans).map(([key, plan]) => (
            <div
              key={key}
              className={`card relative ${
                key === 'quarterly' ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {key === 'quarterly' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-600">/{plan.duration === 365 ? 'year' : plan.duration === 90 ? '3 months' : 'month'}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{plan.features.jobPostings} Job Postings</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{plan.features.featuredJobs} Featured Jobs</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{plan.features.candidateSearch} Candidate Search</span>
                </li>
                <li className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{plan.features.support} Support</span>
                </li>
              </ul>

              <button
                className={`btn w-full ${
                  key === 'quarterly' ? 'btn-primary' : 'btn-secondary'
                }`}
                onClick={() => handleSubscribe(key.toUpperCase())}
                disabled={processing}
              >
                {processing ? 'Processing...' : `Subscribe to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Why Choose Our Premium Plans?</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Unlimited Access</h4>
                <p className="text-sm text-gray-600">Post unlimited jobs and access our complete candidate database</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Priority Support</h4>
                <p className="text-sm text-gray-600">Get dedicated support to help you find the best talent</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Advanced Analytics</h4>
                <p className="text-sm text-gray-600">Track your job performance and optimize your hiring strategy</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Featured Listings</h4>
                <p className="text-sm text-gray-600">Make your jobs stand out with premium placement</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/dashboard" className="text-blue-600 hover:text-blue-500 font-medium">
            Back to Dashboard
          </Link>
        </div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
