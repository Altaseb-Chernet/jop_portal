import { api } from './api'

export type Cv = {
  id: number
  cvName?: string | null
  fullName?: string | null
  email?: string | null
  phone?: string | null
  address?: string | null
  summary?: string | null
  education?: string | null
  experience?: string | null
  skills?: string | null
  certifications?: string | null
  languages?: string | null
  fileName?: string | null
  originalFileName?: string | null
  fileType?: string | null
  fileSize?: number | null
  filePath?: string | null
  isUploadedCv?: boolean | null
  isDefault?: boolean | null
  isActive?: boolean | null
  createdAt?: string
  updatedAt?: string
  userId?: number
}

export async function getMyCvs(): Promise<Cv[]> {
  const { data } = await api.get<Cv[]>('/api/cvs')
  return data
}

export async function getCv(id: number): Promise<Cv> {
  const { data } = await api.get<Cv>(`/api/cvs/${id}`)
  return data
}

export async function getDefaultCv(): Promise<Cv> {
  const { data } = await api.get<Cv>('/api/cvs/default')
  return data
}

export async function buildCv(payload: Partial<Cv>): Promise<Cv> {
  const { data } = await api.post<Cv>('/api/cvs/build', payload)
  return data
}

export async function updateCv(id: number, payload: Partial<Cv>): Promise<Cv> {
  const { data } = await api.put<Cv>(`/api/cvs/${id}`, payload)
  return data
}

export async function deleteCv(id: number): Promise<void> {
  await api.delete(`/api/cvs/${id}`)
}

export async function toggleCvStatus(id: number, isActive: boolean): Promise<void> {
  await api.patch(`/api/cvs/${id}/status`, null, { params: { isActive } })
}

export async function setDefaultCv(id: number): Promise<void> {
  await api.patch(`/api/cvs/${id}/default`)
}

export async function uploadCv(payload: { file: File; cvName?: string; isDefault?: boolean }): Promise<Cv> {
  const form = new FormData()
  form.append('file', payload.file)
  if (payload.cvName) form.append('cvName', payload.cvName)
  if (payload.isDefault != null) form.append('isDefault', String(payload.isDefault))

  const { data } = await api.post<Cv>('/api/cvs/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function downloadCv(id: number): Promise<{ blob: Blob; filename?: string }> {
  const res = await api.get(`/api/cvs/${id}/download`, { responseType: 'blob' })
  const cd = res.headers['content-disposition'] as string | undefined
  const match = cd?.match(/filename="?([^\"]+)"?/)
  const filename = match?.[1]
  return { blob: res.data as Blob, filename }
}
