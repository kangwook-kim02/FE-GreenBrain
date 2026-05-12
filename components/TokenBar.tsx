'use client'

interface TokenBarProps {
  remaining: number
  max: number
}

export default function TokenBar({ remaining, max }: TokenBarProps) {
  const ratio = max > 0 ? remaining / max : 0
  const percent = Math.max(0, Math.min(100, ratio * 100))

  const colorClass =
    ratio > 0.5
      ? 'bg-green-500'
      : ratio > 0.2
        ? 'bg-amber-500'
        : 'bg-red-500'

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium tabular-nums">{remaining}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${colorClass}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-xs text-gray-500">{max}</span>
    </div>
  )
}
