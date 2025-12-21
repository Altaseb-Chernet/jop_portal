import { useEffect } from 'react'

export function Toast({
  message,
  type,
  onClose,
}: {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}) {
  useEffect(() => {
    const id = window.setTimeout(onClose, 4000)
    return () => window.clearTimeout(id)
  }, [onClose])

  const cls =
    type === 'success'
      ? 'bg-emerald-600'
      : type === 'error'
        ? 'bg-rose-600'
        : 'bg-slate-700'

  return (
    <div className="fixed right-4 top-4 z-50">
      <div className={`${cls} text-white shadow-lg rounded-xl px-4 py-3 flex items-start gap-3 max-w-sm`}>
        <div className="text-sm leading-5">{message}</div>
        <button
          className="ml-auto text-white/80 hover:text-white text-sm"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  )
}
