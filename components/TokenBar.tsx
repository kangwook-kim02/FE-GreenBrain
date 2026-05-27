'use client'

interface TokenBarProps {
  remaining: number
  max: number
}

export default function TokenBar({ remaining, max }: TokenBarProps) {
  const isOverflow = max > 0 && remaining > max
  const OVERFLOW_CAP = max * 1.5

  const ratio = max > 0 ? remaining / max : 0
  const baseColorClass =
    ratio > 0.5 ? 'bg-green-500' : ratio > 0.2 ? 'bg-amber-500' : 'bg-red-500'

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 h-2 rounded-full">
        {/* 회색 배경: 초과 시 기본 구간(0~max)만, 정상 시 전체 */}
        <div
          className="absolute inset-y-0 left-0 bg-gray-200 rounded-full"
          style={{ width: isOverflow ? `${(max / OVERFLOW_CAP) * 100}%` : '100%' }}
        />
        {isOverflow ? (
          <>
            {/* 기본 구간: 0 ~ max (항상 꽉 참) */}
            <div
              className="absolute inset-y-0 left-0 bg-green-500 transition-all"
              style={{ width: `${(max / OVERFLOW_CAP) * 100}%` }}
            />
            {/* 초과 구간: max ~ remaining */}
            <div
              className="absolute inset-y-0 bg-blue-400 rounded-r-full transition-all"
              style={{
                left: `${(max / OVERFLOW_CAP) * 100}%`,
                width: `${Math.min((remaining - max) / OVERFLOW_CAP, 1 - max / OVERFLOW_CAP) * 100}%`,
              }}
            />
          </>
        ) : (
          <div
            className={`absolute inset-y-0 left-0 rounded-full transition-all ${baseColorClass}`}
            style={{ width: `${Math.max(0, Math.min(100, ratio * 100))}%` }}
          />
        )}
      </div>
      <span className="text-xs text-gray-500">{max}</span>
    </div>
  )
}
