import { api } from './api'
import type { User } from '../types/auth'

export async function getProfile(): Promise<Record<string, unknown>> {
  const { data } = await api.get('/api/users/profile')
  return data
}

export async function updateProfile(updates: Record<string, unknown>): Promise<Record<string, unknown>> {
  const { data } = await api.put('/api/users/profile', updates)
  return data
}

export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  await api.put('/api/users/change-password', { oldPassword, newPassword })
}

export async function deactivateAccount(): Promise<void> {
  await api.put('/api/users/deactivate')
}

export type AdminUser = User & {
  address?: string
  city?: string
  country?: string
  updatedAt?: string
  companyDescription?: string
  companyWebsite?: string
}

export async function adminGetUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[]>('/api/admin/users')
  return data
}

export async function adminApproveEmployer(id: number): Promise<void> {
  await api.put(`/api/admin/users/${id}/approve`)
}

export async function adminDeactivateUser(id: number): Promise<void> {
  await api.put(`/api/admin/users/${id}/deactivate`)
}

export async function adminActivateUser(id: number): Promise<void> {
  await api.put(`/api/admin/users/${id}/activate`)
}
