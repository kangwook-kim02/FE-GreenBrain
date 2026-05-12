export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-100 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-1">
          <div className="h-3 bg-gray-200 rounded w-1/3" />
          <div className="h-3 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
      <div className="aspect-square bg-gray-200 rounded-lg" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
    </div>
  )
}
