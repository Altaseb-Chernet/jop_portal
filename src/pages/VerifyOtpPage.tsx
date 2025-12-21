import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { verifyOtp } from '../services/auth'
import { Toast } from '../components/Toast'

const otpSchema = z.object({
  email: z.string().email(),
  otpCode: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
})

type OtpFormValues = z.infer<typeof otpSchema>

export function VerifyOtpPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const emailFromParams = searchParams.get('email') || ''

  const otpForm = useForm<OtpFormValues>({ 
    resolver: zodResolver(otpSchema),
    defaultValues: { email: emailFromParams }
  })

  useEffect(() => {
    if (emailFromParams) {
      otpForm.setValue('email', emailFromParams)
    }
  }, [emailFromParams, otpForm])

  async function handleOtpSubmit(values: OtpFormValues) {
    try {
      await verifyOtp(values)
      setToast({ type: 'success', message: 'OTP verified successfully' })
      // Navigate to password reset page with email and OTP
      setTimeout(() => {
        navigate(`/reset-password?email=${encodeURIComponent(values.email)}&otp=${values.otpCode}`)
      }, 1500)
    } catch (e: any) {
      const msg = e?.response?.data?.error || 'Invalid or expired OTP'
      setToast({ type: 'error', message: msg })
    }
  }

  return (
    <div className="section">
      <div className="container max-w-lg">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900">Enter Verification Code</h1>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a 6-digit verification code to your email address.
          </p>

          <form className="mt-6 space-y-4" onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
            <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input 
                className="input mt-1" 
                value={emailFromParams}
                disabled
                type="email"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Verification Code</label>
              <input 
                className="input mt-1 text-center text-xl font-mono" 
                placeholder="000000" 
                maxLength={6}
                type="text"
                {...otpForm.register('otpCode')} 
              />
              {otpForm.formState.errors.otpCode && (
                <div className="mt-1 text-sm text-rose-600">{otpForm.formState.errors.otpCode.message}</div>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Enter the 6-digit code from your email
              </p>
            </div>

            <button 
              type="submit"
              className="btn btn-primary w-full" 
              disabled={otpForm.formState.isSubmitting}
            >
              {otpForm.formState.isSubmitting ? 'Verifying…' : 'Verify Code'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <div className="text-sm text-gray-600">
              Didn't receive the code?{' '}
              <Link 
                className="font-medium text-blue-600 hover:text-blue-500" 
                to="/forgot-password"
              >
                Send again
              </Link>
            </div>
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
