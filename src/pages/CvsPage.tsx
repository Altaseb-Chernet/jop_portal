import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Spinner } from '../components/Spinner'
import { Toast } from '../components/Toast'
import {
  buildCv,
  deleteCv,
  downloadCv,
  getMyCvs,
  setDefaultCv,
  toggleCvStatus,
  uploadCv,
  type Cv,
} from '../services/cvs'

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

export function CvsPage() {
  const qc = useQueryClient()
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)

  const [tab, setTab] = useState<'upload' | 'build'>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [cvName, setCvName] = useState('')
  const [isDefault, setIsDefault] = useState(false)

  const [builder, setBuilder] = useState<Partial<Cv>>({ cvName: '', fullName: '', email: '', phone: '' })

  const q = useQuery({ queryKey: ['cvs'], queryFn: getMyCvs })

  const uploadMut = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('Select a file')
      return uploadCv({ file, cvName: cvName.trim() || undefined, isDefault })
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['cvs'] })
      setToast({ type: 'success', message: 'CV uploaded' })
      setFile(null)
      setCvName('')
      setIsDefault(false)
    },
    onError: (e: any) => setToast({ type: 'error', message: e?.message || 'Upload failed' }),
  })

  const buildMut = useMutation({
    mutationFn: () => buildCv({ ...builder, isDefault }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['cvs'] })
      setToast({ type: 'success', message: 'CV created' })
      setBuilder({ cvName: '', fullName: '', email: '', phone: '' })
      setIsDefault(false)
    },
    onError: (e: any) => setToast({ type: 'error', message: e?.response?.data?.error || 'Build failed' }),
  })

  const actions = useMemo(
    () => ({
      onDefault: async (id: number) => {
        await setDefaultCv(id)
        await qc.invalidateQueries({ queryKey: ['cvs'] })
      },
      onToggle: async (id: number, active: boolean) => {
        await toggleCvStatus(id, !active)
        await qc.invalidateQueries({ queryKey: ['cvs'] })
      },
      onDelete: async (id: number) => {
        await deleteCv(id)
        await qc.invalidateQueries({ queryKey: ['cvs'] })
      },
      onDownload: async (id: number) => {
        const { blob, filename } = await downloadCv(id)
        downloadBlob(blob, filename || `cv-${id}.pdf`)
      },
    }),
    [qc],
  )

  return (
    <div className="section">
      <div className="container">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl">My CVs</h1>
            <p className="mt-2 text-gray-600">Upload or build CV, set default, download.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex gap-2">
                <button className={`btn ${tab === 'upload' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('upload')}>
                  Upload CV
                </button>
                <button className={`btn ${tab === 'build' ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTab('build')}>
                  Build CV
                </button>
              </div>

              {tab === 'upload' ? (
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">CV name (optional)</label>
                    <input className="input mt-1" value={cvName} onChange={(e) => setCvName(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">File</label>
                    <input className="mt-2" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
                    Set as default
                  </label>
                  <button className="btn btn-primary" disabled={uploadMut.isPending} onClick={() => uploadMut.mutate()}>
                    {uploadMut.isPending ? 'Uploading…' : 'Upload'}
                  </button>
                </div>
              ) : (
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-700">CV name</label>
                    <input className="input mt-1" value={builder.cvName ?? ''} onChange={(e) => setBuilder((p) => ({ ...p, cvName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Full name</label>
                    <input className="input mt-1" value={builder.fullName ?? ''} onChange={(e) => setBuilder((p) => ({ ...p, fullName: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input className="input mt-1" value={builder.email ?? ''} onChange={(e) => setBuilder((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Phone</label>
                    <input className="input mt-1" value={builder.phone ?? ''} onChange={(e) => setBuilder((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Skills</label>
                    <input className="input mt-1" value={builder.skills ?? ''} onChange={(e) => setBuilder((p) => ({ ...p, skills: e.target.value }))} />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-700 sm:col-span-2">
                    <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} />
                    Set as default
                  </label>
                  <div className="sm:col-span-2">
                    <button className="btn btn-primary w-full" disabled={buildMut.isPending} onClick={() => buildMut.mutate()}>
                      {buildMut.isPending ? 'Creating…' : 'Create CV'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="card">
              <h2 className="text-xl">Saved CVs</h2>
              {q.isLoading ? (
                <Spinner label="Loading CVs…" />
              ) : q.isError ? (
                <div className="mt-4 text-rose-700">Failed to load CVs.</div>
              ) : q.data?.length ? (
                <div className="mt-4 space-y-3">
                  {q.data.map((cv) => (
                    <div key={cv.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="font-semibold">{cv.cvName || cv.originalFileName || `CV #${cv.id}`}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Default: {String(cv.isDefault)} • Active: {String(cv.isActive)}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button className="btn btn-secondary" onClick={() => actions.onDownload(cv.id)}>
                          Download
                        </button>
                        <button className="btn btn-secondary" onClick={() => actions.onDefault(cv.id)}>
                          Set default
                        </button>
                        <button className="btn btn-secondary" onClick={() => actions.onToggle(cv.id, Boolean(cv.isActive))}>
                          {cv.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button className="btn btn-secondary" onClick={() => actions.onDelete(cv.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-4 text-gray-600">No CVs yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
