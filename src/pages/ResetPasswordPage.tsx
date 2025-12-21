import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { resetPassword } from '../services/auth'
import { Toast } from '../components/Toast'

const resetSchema = z.object({
  email: z.string().email(),
  otpCode: z.string().regex(/^\d{6}$/, 'Invalid OTP'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type ResetFormValues = z.infer<typeof resetSchema>

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const emailFromParams = searchParams.get('email') || ''
  const otpFromParams = searchParams.get('otp') || ''

  const resetForm = useForm<ResetFormValues>({ 
    resolver: zodResolver(resetSchema),
    defaultValues: { 
      email: emailFromParams,
      otpCode: otpFromParams
    }
  })

  useEffect(() => {
    if (emailFromParams) {
      resetForm.setValue('email', emailFromParams)
    }
    if (otpFromParams) {
      resetForm.setValue('otpCode', otpFromParams)
    }
  }, [emailFromParams, otpFromParams, resetForm])

  async function handleResetSubmit(values: ResetFormValues) {
    try {
      await resetPassword({
        email: values.email,
        otpCode: values.otpCode,
        newPassword: values.newPassword
      })
      setToast({ type: 'success', message: 'Password reset successfully!' })
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (e: any) {
      const msg = e?.response?.data?.error || 'Failed to reset password'
      setToast({ type: 'error', message: msg })
    }
  }

  return (
    <div className="section">
      <div className="container max-w-lg">
        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below.
          </p>

          <form className="mt-6 space-y-4" onSubmit={resetForm.handleSubmit(handleResetSubmit)}>
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
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <input 
                className="input mt-1" 
                placeholder="Enter new password" 
                type="password"
                {...resetForm.register('newPassword')} 
              />
              {resetForm.formState.errors.newPassword && (
                <div className="mt-1 text-sm text-rose-600">{resetForm.formState.errors.newPassword.message}</div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <input 
                className="input mt-1" 
                placeholder="Confirm new password" 
                type="password"
                {...resetForm.register('confirmPassword')} 
              />
              {resetForm.formState.errors.confirmPassword && (
                <div className="mt-1 text-sm text-rose-600">{resetForm.formState.errors.confirmPassword.message}</div>
              )}
            </div>

            <button 
              type="submit"
              className="btn btn-primary w-full" 
              disabled={resetForm.formState.isSubmitting}
            >
              {resetForm.formState.isSubmitting ? 'Resetting…' : 'Reset Password'}
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
