import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateProfile } from '../services/users'
import { Spinner } from '../components/Spinner'
import { Toast } from '../components/Toast'
import { clearProfilePhoto, getProfilePhoto, setProfilePhoto } from '../lib/storage'
import { useAuth } from '../context/AuthContext'

export function ProfilePage() {
  const qc = useQueryClient()
  const { user } = useAuth()
  const userId = user?.id
  const [form, setForm] = useState<Record<string, any>>({})
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  useEffect(() => {
    if (userId) {
      setPhotoUrl(getProfilePhoto(userId))
    }
  }, [userId])

  const displayName = useMemo(() => {
    const first = String(form.firstName ?? '').trim()
    const last = String(form.lastName ?? '').trim()
    const full = `${first} ${last}`.trim()
    return full || String(form.email ?? 'User')
  }, [form.email, form.firstName, form.lastName])

  async function onPhotoFile(file: File | null) {
    if (!file || !userId) return
    const maxBytes = 2_000_000
    if (file.size > maxBytes) {
      setToast({ type: 'error', message: 'Photo is too large (max 2 MB).' })
      return
    }
    if (!file.type.startsWith('image/')) {
      setToast({ type: 'error', message: 'Please upload an image file.' })
      return
    }

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onerror = () => reject(new Error('read failed'))
        reader.onload = () => resolve(String(reader.result ?? ''))
        reader.readAsDataURL(file)
      })
      if (!dataUrl.startsWith('data:image/')) {
        setToast({ type: 'error', message: 'Invalid image file.' })
        return
      }
      setProfilePhoto(userId, dataUrl)
      setPhotoUrl(dataUrl)
      setToast({ type: 'success', message: 'Profile photo updated.' })
    } catch {
      setToast({ type: 'error', message: 'Failed to upload photo.' })
    }
  }

  const q = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  })

  useEffect(() => {
    if (q.data) setForm(q.data)
  }, [q.data])

  const mut = useMutation({
    mutationFn: () => updateProfile(form),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['profile'] })
      setToast({ type: 'success', message: 'Profile updated' })
    },
    onError: (e: any) => {
      setToast({ type: 'error', message: e?.response?.data?.error || 'Failed to update profile' })
    },
  })

  if (q.isLoading) return <Spinner label="Loading profile…" />
  if (q.isError) {
    return (
      <div className="section">
        <div className="container">
          <div className="card border-rose-200">
            <div className="text-rose-700 font-semibold">Failed to load profile</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="section">
      <div className="container max-w-3xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl">Profile</h1>
          </div>
          <button className="btn btn-primary" disabled={mut.isPending} onClick={() => mut.mutate()}>
            {mut.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>

        <div className="mt-6 card">
          <div className="flex items-center gap-4">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="h-16 w-16 rounded-full object-cover border border-gray-200" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-primary-600 text-white flex items-center justify-center font-extrabold text-xl">
                {(String(form.firstName ?? 'U')[0] || 'U') + (String(form.lastName ?? '')[0] || '')}
              </div>
            )}
            <div className="min-w-0">
              <div className="font-semibold text-gray-900 truncate">{displayName}</div>
              <div className="text-sm text-gray-600 truncate">{String(form.email ?? '')}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <input
                  className="input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    void onPhotoFile(e.target.files?.[0] ?? null)
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  disabled={!userId || !photoUrl}
                  onClick={() => {
                    if (!userId) return
                    clearProfilePhoto(userId)
                    setPhotoUrl(null)
                    setToast({ type: 'info', message: 'Profile photo removed.' })
                  }}
                >
                  Remove photo
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500">Photo is stored locally in your browser for this user.</div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(form).map(([k, v]) => (
              <div key={k} className={k === 'email' ? 'sm:col-span-2' : ''}>
                <label className="text-sm font-medium text-gray-700">{k}</label>
                <input
                  className="input mt-1"
                  value={v ?? ''}
                  onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}
                />
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-gray-500">
            Note: your backend accepts a flexible Map&lt;String,Object&gt; for profile updates.
          </div>
        </div>
      </div>
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
    </div>
  )
}
