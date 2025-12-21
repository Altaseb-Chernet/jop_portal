import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { forgotPassword, verifyOtp, resetPassword } from '../services/auth'
import { Toast } from '../components/Toast'

const emailSchema = z.object({
  email: z.string().email(),
})

const otpSchema = z.object({
  email: z.string().email(),
  otpCode: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
})

const resetSchema = z.object({
  email: z.string().email(),
  otpCode: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
  newPassword: z.string().min(6),
})

type EmailFormValues = z.infer<typeof emailSchema>
type OtpFormValues = z.infer<typeof otpSchema>
type ResetFormValues = z.infer<typeof resetSchema>

export function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'email' | 'otp' | 'reset'>('email')
  const [email, setEmail] = useState('')
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const emailForm = useForm<EmailFormValues>({ resolver: zodResolver(emailSchema) })
  const otpForm = useForm<OtpFormValues>({ resolver: zodResolver(otpSchema) })
  const resetForm = useForm<ResetFormValues>({ resolver: zodResolver(resetSchema) })

  // Update OTP form when email changes
  React.useEffect(() => {
    if (email) {
      otpForm.setValue('email', email)
      resetForm.setValue('email', email)
    }
  }, [email, otpForm, resetForm])

  async function handleEmailSubmit(values: EmailFormValues) {
    console.log('Submitting email for OTP:', values)
    try {
      await forgotPassword(values)
      setEmail(values.email)
      setStep('otp')
      setToast({ type: 'success', message: 'OTP sent to your email' })
    } catch (e: any) {
      console.error('Email submission error:', e)
      const msg = e?.response?.data?.error || 'Failed to send OTP'
      setToast({ type: 'error', message: msg })
    }
  }

  async function handleOtpSubmit(values: OtpFormValues) {
    console.log('Submitting OTP verification:', values)
    alert('OTP form submitted with: ' + JSON.stringify(values))
    try {
      const response = await verifyOtp(values)
      console.log('OTP verification response:', response)
      setStep('reset')
      setToast({ type: 'success', message: 'OTP verified successfully' })
    } catch (e: any) {
      console.error('OTP verification error:', e)
      const msg = e?.response?.data?.error || 'Invalid OTP'
      setToast({ type: 'error', message: msg })
    }
  }

  async function handleResetSubmit(values: ResetFormValues) {
    try {
      await resetPassword(values)
      setToast({ type: 'success', message: 'Password reset successfully' })
      setTimeout(() => navigate('/login'), 2000)
    } catch (e: any) {
      const msg = e?.response?.data?.error || 'Failed to reset password'
      setToast({ type: 'error', message: msg })
    }
  }

  return (
    <div className="section">
      <div className="container max-w-lg">
        <div className="card">
          <h1 className="text-2xl">Forgot Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'email' && 'Enter your email to receive a password reset code'}
            {step === 'otp' && 'Enter the 6-digit code sent to your email'}
            {step === 'reset' && 'Enter your new password'}
          </p>

          {step === 'email' && (
            <form className="mt-6 space-y-4" onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input className="input mt-1" placeholder="you@example.com" {...emailForm.register('email')} />
                {emailForm.formState.errors.email && (
                  <div className="mt-1 text-sm text-rose-600">{emailForm.formState.errors.email.message}</div>
                )}
              </div>

              <button className="btn btn-primary w-full" disabled={emailForm.formState.isSubmitting}>
                {emailForm.formState.isSubmitting ? 'Sending OTP…' : 'Send OTP'}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form className="mt-6 space-y-4" onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input className="input mt-1" value={email} disabled />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">6-Digit Code</label>
                <input 
                  className="input mt-1" 
                  placeholder="123456" 
                  maxLength={6}
                  {...otpForm.register('otpCode')} 
                />
                {otpForm.formState.errors.otpCode && (
                  <div className="mt-1 text-sm text-rose-600">{otpForm.formState.errors.otpCode.message}</div>
                )}
              </div>

              <button 
                type="submit"
                className="btn btn-primary w-full" 
                disabled={otpForm.formState.isSubmitting}
              >
                {otpForm.formState.isSubmitting ? 'Verifying…' : 'Verify OTP'}
              </button>

              <button 
                type="button" 
                className="btn btn-secondary w-full" 
                onClick={() => setStep('email')}
              >
                Back to Email
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form className="mt-6 space-y-4" onSubmit={resetForm.handleSubmit(handleResetSubmit)}>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input className="input mt-1" value={email} disabled />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">6-Digit Code</label>
                <input 
                  className="input mt-1" 
                  placeholder="123456" 
                  maxLength={6}
                  {...resetForm.register('otpCode')} 
                />
                {resetForm.formState.errors.otpCode && (
                  <div className="mt-1 text-sm text-rose-600">{resetForm.formState.errors.otpCode.message}</div>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <input 
                  className="input mt-1" 
                  type="password" 
                  placeholder="Enter new password" 
                  {...resetForm.register('newPassword')} 
                />
                {resetForm.formState.errors.newPassword && (
                  <div className="mt-1 text-sm text-rose-600">{resetForm.formState.errors.newPassword.message}</div>
                )}
              </div>

              <button className="btn btn-primary w-full" disabled={resetForm.formState.isSubmitting}>
                {resetForm.formState.isSubmitting ? 'Resetting…' : 'Reset Password'}
              </button>

              <button 
                type="button" 
                className="btn btn-secondary w-full" 
                onClick={() => setStep('otp')}
              >
                Back to OTP
              </button>
            </form>
          )}

          <div className="mt-4 text-sm text-gray-600">
            Remember your password?{' '}
            <Link className="font-medium" to="/login">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
