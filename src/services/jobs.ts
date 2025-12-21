import { api } from './api'
import type { Job } from '../types/job'

export async function getJobs(): Promise<Job[]> {
  const { data } = await api.get<Job[]>('/api/jobs')
  return data
}

export async function getJob(id: number): Promise<Job> {
  const { data } = await api.get<Job>(`/api/jobs/${id}`)
  return data
}

export async function searchJobs(keyword: string): Promise<Job[]> {
  const { data } = await api.get<Job[]>('/api/jobs/search', { params: { keyword } })
  return data
}

export async function filterJobs(params: {
  location?: string
  jobType?: string
  minSalary?: number
  maxSalary?: number
}): Promise<Job[]> {
  const { data } = await api.get<Job[]>('/api/jobs/filter', { params })
  return data
}

export async function getEmployerJobs(employerId: number): Promise<Job[]> {
  const { data } = await api.get<Job[]>(`/api/jobs/employer/${employerId}`)
  return data
}

export async function createJob(payload: Partial<Job>): Promise<Job> {
  const { data } = await api.post<Job>('/api/jobs', payload)
  return data
}

export async function updateJob(id: number, payload: Partial<Job>): Promise<Job> {
  const { data } = await api.put<Job>(`/api/jobs/${id}`, payload)
  return data
}

export async function deleteJob(id: number): Promise<void> {
  await api.delete(`/api/jobs/${id}`)
}

export async function toggleJobStatus(id: number, isActive: boolean): Promise<void> {
  await api.patch(`/api/jobs/${id}/status`, null, { params: { isActive } })
}
