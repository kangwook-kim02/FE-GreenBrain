interface CarbonCardProps {
  carbonCost: number | null
}

export default function CarbonCard({ carbonCost }: CarbonCardProps) {
  if (carbonCost === null) {
    return (
      <div className="text-xs text-gray-400 mt-1 px-2">탄소 계산 불가</div>
    )
  }

  return (
    <div className="mt-1 px-3 py-2 bg-green-50 rounded-lg text-xs text-green-700">
      이 메시지로 <strong>{carbonCost.toFixed(2)} gCO₂eq</strong>가 발생했습니다
    </div>
  )
}
