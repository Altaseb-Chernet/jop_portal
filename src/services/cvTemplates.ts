import { api } from './api'
import type { Cv } from './cvs'

export type CvTemplate = {
  id: number
  name: string
  description?: string | null
  thumbnailUrl?: string | null
  htmlContent?: string | null
  cssContent?: string | null
  isActive?: boolean | null
  isPremium?: boolean | null
  category?: string | null
  fieldsConfig?: string | null
  createdAt?: string
  updatedAt?: string
  createdById?: number
  createdByName?: string
}

export async function getTemplates(): Promise<CvTemplate[]> {
  const { data } = await api.get<CvTemplate[]>('/api/cv-templates')
  return data
}

export async function getActiveTemplates(): Promise<CvTemplate[]> {
  const { data } = await api.get<CvTemplate[]>('/api/cv-templates/active')
  return data
}

export async function createTemplate(payload: Partial<CvTemplate>): Promise<CvTemplate> {
  const { data } = await api.post<CvTemplate>('/api/cv-templates', payload)
  return data
}

export async function updateTemplate(id: number, payload: Partial<CvTemplate>): Promise<CvTemplate> {
  const { data } = await api.put<CvTemplate>(`/api/cv-templates/${id}`, payload)
  return data
}

export async function deleteTemplate(id: number): Promise<void> {
  await api.delete(`/api/cv-templates/${id}`)
}

export async function toggleTemplateStatus(id: number, isActive: boolean): Promise<void> {
  await api.patch(`/api/cv-templates/${id}/status`, null, { params: { isActive } })
}

export async function buildCvFromTemplate(templateId: number, payload: Partial<Cv>): Promise<Cv> {
  const { data } = await api.post<Cv>(`/api/cv-templates/${templateId}/build-cv`, payload)
  return data
}
