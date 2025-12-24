import { api } from './api'

export type Application = {
  id: number
  coverLetter?: string | null
  status?: string
  appliedAt?: string
  updatedAt?: string
  cv?: {
    id: number
    fileName?: string | null
    cvName?: string | null
  }
  job?: {
    id: number
    title?: string
    companyName?: string
    location?: string
  }
  jobSeeker?: {
    id: number
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
  }
}

export async function applyForJob(payload: { jobId: number; coverLetter?: string }): Promise<Application> {
  const { data } = await api.post<Application>('/api/applications', payload)
  return data
}

export async function getMyApplications(): Promise<Application[]> {
  const { data } = await api.get<Application[]>('/api/applications/my-applications')
  return data
}

export async function withdrawApplication(applicationId: number): Promise<void> {
  await api.delete(`/api/applications/${applicationId}`)
}

export async function getApplicationsByJob(jobId: number): Promise<any[]> {
  const { data } = await api.get(`/api/applications/job/${jobId}`)
  return data
}

export async function getEmployerApplications(): Promise<any[]> {
  const { data } = await api.get('/api/applications/employer')
  return data
}

export async function updateApplicationStatus(applicationId: number, status: string): Promise<void> {
  await api.patch(`/api/applications/${applicationId}/status`, null, { params: { status } })
}

export async function downloadApplicationCv(applicationId: number): Promise<{ blob: Blob; filename?: string }> {
  const res = await api.get(`/api/applications/${applicationId}/cv/download`, { responseType: 'blob' })
  const cd = res.headers['content-disposition'] as string | undefined
  const match = cd?.match(/filename="?([^\"]+)"?/)
  const filename = match?.[1]
  return { blob: res.data as Blob, filename }
}
