import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPassword } from '../services/auth'
import { Toast } from '../components/Toast'

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type EmailFormValues = z.infer<typeof emailSchema>

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const emailForm = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema) })

  async function handleEmailSubmit(values: EmailFormValues) {
    try {
      await forgotPassword(values)
      setToast({ type: 'success', message: 'Password reset code sent to your email' })
      // Navigate to OTP verification page with email as parameter
      setTimeout(() => {
        navigate(`/verify-otp?email=${encodeURIComponent(values.email)}`)
      }, 1500)
    } catch (e: any) {
      const msg = e?.response?.data?.error || 'Failed to send OTP'
      setToast({ type: 'error', message: msg })
    }
  }

  return (
    <div className="section">
      <div className="container max-w-lg">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email address and we'll send you a code to reset your password.
          </p>

          <form className="mt-6 space-y-4" onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
            <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input 
                className="input mt-1" 
                placeholder="you@example.com" 
                type="email"
                {...emailForm.register('email')} 
              />
              {emailForm.formState.errors.email && (
                <div className="mt-1 text-sm text-rose-600">{emailForm.formState.errors.email.message}</div>
              )}
            </div>

            <button 
              className="btn btn-primary w-full" 
              disabled={emailForm.formState.isSubmitting}
            >
              {emailForm.formState.isSubmitting ? 'Sending Code…' : 'Send Reset Code'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              className="text-sm font-medium text-blue-600 hover:text-blue-500" 
              to="/login"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
