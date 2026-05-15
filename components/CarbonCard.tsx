interface CarbonCardProps {
  carbonCost: number | null
  analogy?: { icon: string; text: string }
}

export default function CarbonCard({ carbonCost, analogy }: CarbonCardProps) {
  if (carbonCost === null) {
    return (
      <div className="text-xs text-gray-400 mt-1 px-2">탄소 계산 불가</div>
    )
  }

  return (
    <div className="mt-1 px-3 py-2 bg-gray-100 rounded-lg flex items-center gap-2">
      {analogy && <span className="text-lg">{analogy.icon}</span>}
      <div className="flex-1">
        {analogy && <p className="text-xs text-gray-600">{analogy.text}</p>}
        <p className="text-xs text-gray-500 mt-0.5">{carbonCost.toFixed(1)} gCO₂eq 배출</p>
      </div>
    </div>
  )
}
