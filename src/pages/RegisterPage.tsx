import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { register as registerApi } from '../services/auth'
import { initializeEmployerPayment } from '../services/payment'
import { useAuth } from '../context/AuthContext'
import { Toast } from '../components/Toast'
import type { UserRole } from '../types/auth'

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  role: z.enum(['JOB_SEEKER', 'EMPLOYER', 'ADMIN']).optional(),
  companyName: z.string().optional(),
  companyIndustry: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const nav = useNavigate()
  const [searchParams] = useSearchParams()
  const { signIn } = useAuth()
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const {
    register,
    watch,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'EMPLOYER' },
  })

  const role = watch('role') as UserRole | undefined

  const selectedPlan = (searchParams.get('plan') || 'MONTHLY') as 'MONTHLY' | 'QUARTERLY' | 'YEARLY'

  async function onSubmit(values: FormValues) {
    try {
      const res = await registerApi({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
        role: values.role,
        companyName: values.companyName,
        companyIndustry: values.companyIndustry,
      })

      if (values.role === 'EMPLOYER') {
        setToast({ type: 'info', message: 'Account created. Redirecting to payment...' })
        const paymentResponse = await initializeEmployerPayment({
          email: values.email,
          subscriptionType: selectedPlan,
        })
        if (paymentResponse.chapaCheckoutUrl) {
          window.location.href = paymentResponse.chapaCheckoutUrl
          return
        }
        setToast({ type: 'error', message: 'Payment initialization failed' })
        return
      }

      signIn(res)
      setToast({ type: 'success', message: 'Account created successfully!' })
      nav('/dashboard', { replace: true })
    } catch (e: any) {  
      const msg = e?.response?.data?.error || 'Registration failed'
      setToast({ type: 'error', message: msg })
    }
  }

  return (
    <div className="section">
      <div className="container max-w-2xl">
        <div className="card">
          <h1 className="text-2xl">Create account</h1>
          <p className="mt-2 text-sm text-gray-600">Register and start using your Job Portal backend.</p>

          <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-sm font-medium text-gray-700">First name</label>
              <input className="input mt-1" {...register('firstName')} />
              {errors.firstName && <div className="mt-1 text-sm text-rose-600">{errors.firstName.message}</div>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Last name</label>
              <input className="input mt-1" {...register('lastName')} />
              {errors.lastName && <div className="mt-1 text-sm text-rose-600">{errors.lastName.message}</div>}
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input className="input mt-1" placeholder="you@example.com" {...register('email')} />
              {errors.email && <div className="mt-1 text-sm text-rose-600">{errors.email.message}</div>}
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input className="input mt-1" type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && <div className="mt-1 text-sm text-rose-600">{errors.password.message}</div>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Phone (optional)</label>
              <input className="input mt-1" {...register('phone')} />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Role(Employer)</label>
              <select className="input mt-1" {...register('role')}>
                <option value="EMPLOYER">Employer</option>
                <option value="JOB_SEEKER">Job Seeker</option>
              </select>
              <div className="mt-1 text-xs text-gray-500">Employer accounts may require admin approval.</div>
            </div>

            {role === 'EMPLOYER' && (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700">Company name</label>
                  <input className="input mt-1" {...register('companyName')} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Industry</label>
                  <input className="input mt-1" {...register('companyIndustry')} />
                </div>
              </>
            )}

            <div className="sm:col-span-2">
              <button className="btn btn-primary w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Creating…' : 'Create account'}
              </button>
            </div>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            Already have an account?{' '}
            <Link className="font-medium" to="/login">
              Login
            </Link>
          </div>
        </div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
