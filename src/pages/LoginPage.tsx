import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { login } from '../services/auth'
import { useAuth } from '../context/AuthContext'
import { Toast } from '../components/Toast'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const nav = useNavigate()
  const loc = useLocation()
  const { signIn, isAuthenticated } = useAuth()
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const redirectTo = useMemo(() => {
    const sp = new URLSearchParams(loc.search)
    return sp.get('redirect') || '/dashboard'
  }, [loc.search])

  useEffect(() => {
    if (isAuthenticated) {
      nav('/dashboard', { replace: true })
    }
  }, [isAuthenticated, nav])

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    try {
      const res = await login(values)
      signIn(res)
      setToast({ type: 'success', message: 'Welcome back!' })
      if (typeof window !== 'undefined') {
        window.location.assign(redirectTo)
      } else {
        nav(redirectTo)
      }
    } catch (e: any) {
      const msg = e?.response?.data?.error || 'Invalid email or password'
      setToast({ type: 'error', message: msg })
    }
  }

  return (
    <div className="section">
      <div className="container max-w-lg">
        <div className="card">
          <h1 className="text-2xl">Login</h1>
          <p className="mt-2 text-sm text-gray-600">Sign in with the account you created in your Spring Boot backend.</p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input className="input mt-1" placeholder="you@example.com" {...register('email')} />
              {errors.email && <div className="mt-1 text-sm text-rose-600">{errors.email.message}</div>}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input className="input mt-1" type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && <div className="mt-1 text-sm text-rose-600">{errors.password.message}</div>}
            </div>

            <button className="btn btn-primary w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in…' : 'Login'}
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600">
            <Link className="font-medium text-blue-600 hover:text-blue-500" to="/forgot-password">
              Forgot your password?
            </Link>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <Link className="font-medium" to="/register">
              Register
            </Link>
          </div>
        </div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
