export type UserRole = 'JOB_SEEKER' | 'EMPLOYER' | 'ADMIN'

export type User = {
  id: number
  firstName: string
  lastName: string
  email: string
  role: UserRole
  phone?: string | null
  companyName?: string | null
  companyIndustry?: string | null
  isApproved?: boolean | null
  isActive?: boolean | null
  createdAt?: string
}

export type AuthResponse = {
  token: string
  user: User
}

export type LoginRequest = {
  email: string
  password: string
}

export type RegisterRequest = {
  firstName: string
  lastName: string
  email: string
  password: string
  phone?: string
  role?: UserRole
  companyName?: string
  companyIndustry?: string
}

export type ForgotPasswordRequest = {
  email: string
}

export type VerifyOtpRequest = {
  email: string
  otpCode: string
}

export type ResetPasswordRequest = {
  email: string
  otpCode: string
  newPassword: string
}
