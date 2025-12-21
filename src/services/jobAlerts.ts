import { api } from './api'

export type JobAlert = {
  id: number
  keywords?: string | null
  location?: string | null
  jobType?: string | null
  minSalary?: number | null
  maxSalary?: number | null
  experienceLevel?: string | null
  isActive?: boolean | null
  alertFrequency?: string | null
  createdAt?: string
  userId?: number
}

export async function createJobAlert(payload: Partial<JobAlert>): Promise<JobAlert> {
  const { data } = await api.post<JobAlert>('/api/job-alerts', payload)
  return data
}

export async function getJobAlerts(): Promise<JobAlert[]> {
  const { data } = await api.get<JobAlert[]>('/api/job-alerts')
  return data
}

export async function updateJobAlert(id: number, payload: Partial<JobAlert>): Promise<JobAlert> {
  const { data } = await api.put<JobAlert>(`/api/job-alerts/${id}`, payload)
  return data
}

export async function toggleJobAlertStatus(id: number, isActive: boolean): Promise<void> {
  await api.patch(`/api/job-alerts/${id}/status`, null, { params: { isActive } })
}

export async function deleteJobAlert(id: number): Promise<void> {
  await api.delete(`/api/job-alerts/${id}`)
}
