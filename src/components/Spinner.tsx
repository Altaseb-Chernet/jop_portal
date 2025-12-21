export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center gap-3 text-gray-600">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600" />
        <span className="text-sm">{label ?? 'Loading...'}</span>
      </div>
    </div>
  )
}
