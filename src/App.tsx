import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminUsersPage } from './pages/AdminUsersPage'
import { AdminCvTemplatesPage } from './pages/AdminCvTemplatesPage'
import { AdminPaymentPage } from './pages/AdminPaymentPage'
import { DashboardPage } from './pages/DashboardPage'
import { CvsPage } from './pages/CvsPage'
import { EmployerApplicationsPage } from './pages/EmployerApplicationsPage'
import { EmployerJobsPage } from './pages/EmployerJobsPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordEmailPage'
import { VerifyOtpPage } from './pages/VerifyOtpPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'
import { SubscriptionPage } from './pages/SubscriptionPage'
import { PaymentSuccessPage } from './pages/PaymentSuccessPage'
import { HomePage } from './pages/HomePage'
import { JobAlertsPage } from './pages/JobAlertsPage'
import { JobDetailsPage } from './pages/JobDetailsPage'
import { JobsPage } from './pages/JobsPage'
import { LoginPage } from './pages/LoginPage'
import { MyApplicationsPage } from './pages/MyApplicationsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProfilePage } from './pages/ProfilePage'
import { RegisterPage } from './pages/RegisterPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public Pages (will show footer) */}
        <Route index element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/payment/success" element={<PaymentSuccessPage />} />

        {/* Protected Routes (no footer) */}
        <Route element={<ProtectedRoute roles={['JOB_SEEKER', 'EMPLOYER', 'ADMIN']} />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/subscription" element={<SubscriptionPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['JOB_SEEKER']} />}>
          <Route path="/jobseeker/applications" element={<MyApplicationsPage />} />
          <Route path="/jobseeker/cvs" element={<CvsPage />} />
          <Route path="/jobseeker/alerts" element={<JobAlertsPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['EMPLOYER']} />}>
          <Route path="/employer/jobs" element={<EmployerJobsPage />} />
          <Route path="/employer/applications" element={<EmployerApplicationsPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/cv-templates" element={<AdminCvTemplatesPage />} />
          <Route path="/admin/payments" element={<AdminPaymentPage />} />
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}