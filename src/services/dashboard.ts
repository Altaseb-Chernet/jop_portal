import { api } from './api'

export async function getJobSeekerDashboard(): Promise<Record<string, unknown>> {
  const { data } = await api.get('/api/dashboard/jobseeker')
  return data
}

export async function getEmployerDashboard(): Promise<Record<string, unknown>> {
  const { data } = await api.get('/api/dashboard/employer')
  return data
}

export async function getAdminDashboard(): Promise<Record<string, unknown>> {
  const { data } = await api.get('/api/dashboard/admin')
  return data
}
