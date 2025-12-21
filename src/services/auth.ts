import { api } from './api'
import type { AuthResponse, LoginRequest, RegisterRequest, ForgotPasswordRequest, VerifyOtpRequest, ResetPasswordRequest } from '../types/auth'

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/login', payload)
  return data
}

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/api/auth/register', payload)
  return data
}

export async function forgotPassword(payload: ForgotPasswordRequest): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/api/auth/forgot-password', payload)
  return data
}

export async function verifyOtp(payload: VerifyOtpRequest): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/api/auth/verify-otp', payload)
  return data
}

export async function resetPassword(payload: ResetPasswordRequest): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/api/auth/reset-password', payload)
  return data
}
