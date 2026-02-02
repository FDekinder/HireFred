'use client'

export function ReleaseSkeleton() {
  return (
    <div className="glass-card p-6 animate-pulse">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-16 h-6 skeleton rounded-full" />
            <div className="w-16 h-5 skeleton rounded" />
          </div>
          <div className="w-48 h-6 skeleton rounded mb-1" />
          <div className="w-32 h-4 skeleton rounded mt-2" />
          <div className="w-full h-4 skeleton rounded mt-3" />
        </div>
      </div>
    </div>
  )
}

export function ReleaseSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <ReleaseSkeleton key={i} />
      ))}
    </div>
  )
}
