import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Spinner } from '../components/Spinner'
import { Toast } from '../components/Toast'
import {
  createTemplate,
  deleteTemplate,
  getTemplates,
  toggleTemplateStatus,
  updateTemplate,
  type CvTemplate,
} from '../services/cvTemplates'

const emptyTemplate: Partial<CvTemplate> = {
  name: '',
  description: '',
  category: 'General',
  isActive: true,
  isPremium: false,
  thumbnailUrl: '',
  htmlContent: '',
  cssContent: '',
  fieldsConfig: '',
}

export function AdminCvTemplatesPage() {
  const qc = useQueryClient()
  const [editing, setEditing] = useState<CvTemplate | null>(null)
  const [form, setForm] = useState<Partial<CvTemplate>>(emptyTemplate)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const q = useQuery({ queryKey: ['cv-templates'], queryFn: getTemplates })

  const saveMut = useMutation({
    mutationFn: async () => {
      if (editing) return updateTemplate(editing.id, form)
      return createTemplate(form)
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['cv-templates'] })
      setToast({ type: 'success', message: editing ? 'Template updated' : 'Template created' })
      setEditing(null)
      setForm(emptyTemplate)
    },
    onError: (e: any) => setToast({ type: 'error', message: e?.response?.data?.error || 'Failed to save template' }),
  })

  const delMut = useMutation({
    mutationFn: (id: number) => deleteTemplate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cv-templates'] }),
  })

  const toggleMut = useMutation({
    mutationFn: (p: { id: number; isActive: boolean }) => toggleTemplateStatus(p.id, !p.isActive),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cv-templates'] }),
  })

  const templates = useMemo(() => q.data ?? [], [q.data])

  return (
    <div className="section">
      <div className="container">
        <h1 className="text-3xl">Admin • CV Templates</h1>
        <p className="mt-2 text-gray-600">Create/update templates used for CV building.</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="card">
              <h2 className="text-xl">{editing ? 'Edit template' : 'Create template'}</h2>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input className="input mt-1" value={String(form.name ?? '')} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Category</label>
                  <input className="input mt-1" value={String(form.category ?? '')} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={Boolean(form.isPremium)} onChange={(e) => setForm((p) => ({ ...p, isPremium: e.target.checked }))} />
                  Premium
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" checked={Boolean(form.isActive)} onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))} />
                  Active
                </label>
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <textarea className="input mt-1 min-h-[100px]" value={String(form.description ?? '')} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
                </div>

                <button className="btn btn-primary w-full" disabled={saveMut.isPending} onClick={() => saveMut.mutate()}>
                  {saveMut.isPending ? 'Saving…' : editing ? 'Update template' : 'Create template'}
                </button>
                {editing && (
                  <button
                    className="btn btn-secondary w-full"
                    onClick={() => {
                      setEditing(null)
                      setForm(emptyTemplate)
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="card">
              <h2 className="text-xl">Templates</h2>
              {q.isLoading ? (
                <Spinner label="Loading templates…" />
              ) : q.isError ? (
                <div className="mt-3 text-rose-700">Failed to load templates.</div>
              ) : templates.length ? (
                <div className="mt-4 grid gap-3">
                  {templates.map((t) => (
                    <div key={t.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold">{t.name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {t.category || 'General'} • Active: {String(t.isActive)} • Premium: {String(t.isPremium)}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setEditing(t)
                              setForm(t)
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-secondary"
                            disabled={toggleMut.isPending}
                            onClick={() => toggleMut.mutate({ id: t.id, isActive: Boolean(t.isActive) })}
                          >
                            {t.isActive ? 'Disable' : 'Enable'}
                          </button>
                          <button className="btn btn-secondary" disabled={delMut.isPending} onClick={() => delMut.mutate(t.id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 text-gray-600">No templates.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
