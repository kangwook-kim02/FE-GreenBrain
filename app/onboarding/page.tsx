'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STEPS = [
  {
    title: '주로 사용하는 교통수단은 무엇인가요?',
    description: '일상적으로 가장 자주 이용하는 교통수단을 선택해주세요.',
    options: [
      { value: 'public', label: '대중교통', icon: <PublicTransitIcon /> },
      { value: 'car', label: '자가용', icon: <CarIcon /> },
      { value: 'bike', label: '자전거', icon: <BikeIcon /> },
      { value: 'walk', label: '도보', icon: <WalkIcon /> },
    ],
  },
  {
    title: '식단 유형은 어떻게 되나요?',
    description: '평소 주로 섭취하는 식단을 선택해주세요.',
    options: [
      { value: 'vegan', label: '비건', icon: <VeganIcon /> },
      { value: 'vegetarian', label: '채식 위주', icon: <VegetarianIcon /> },
      { value: 'balanced', label: '균형 식단', icon: <BalancedIcon /> },
      { value: 'meat', label: '육식 위주', icon: <MeatIcon /> },
    ],
  },
  {
    title: '주거 형태는 어떻게 되나요?',
    description: '현재 거주하고 계신 주거 형태를 선택해주세요.',
    options: [
      { value: 'apartment', label: '아파트', icon: <ApartmentIcon /> },
      { value: 'house', label: '단독주택', icon: <HouseIcon /> },
      { value: 'studio', label: '원룸/오피스텔', icon: <StudioIcon /> },
      { value: 'shared', label: '셰어하우스', icon: <SharedIcon /> },
    ],
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [transportation, setTransportation] = useState('')
  const [diet, setDiet] = useState('')
  const [housing, setHousing] = useState('')

  const selectedValues = [transportation, diet, housing]
  const currentValue = selectedValues[step]
  const setter = [setTransportation, setDiet, setHousing][step]
  const canNext = currentValue !== ''

  const handleNext = () => {
    if (!canNext) return
    if (step < 2) {
      setStep(step + 1)
    } else {
      router.push('/chat')
    }
  }

  const handleBack = () => {
    if (step > 0) setStep(step - 1)
  }

  const currentStep = STEPS[step]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        {/* Header + Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">생활 습관 프로필</h1>
            <span className="text-sm text-gray-500">{step + 1} / 3</span>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  i <= step ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {currentStep.title}
            </h2>
            <p className="text-gray-600 mb-6">{currentStep.description}</p>
          </div>

          <div className="space-y-3">
            {currentStep.options.map((option) => (
              <button
                key={option.value}
                onClick={() => setter(option.value)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] ${
                  currentValue === option.value
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                }`}
              >
                <span className="text-gray-700 flex-shrink-0">{option.icon}</span>
                <span className="font-medium text-gray-900 flex-1">{option.label}</span>
                {currentValue === option.value && (
                  <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-lg border-2 border-gray-300 hover:border-gray-400 text-gray-700 font-medium transition-colors"
            >
              이전
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canNext}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {step === 2 ? '시작하기' : '다음'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* Inline SVG icons */

function PublicTransitIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
    </svg>
  )
}

function CarIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H2.25c-.621 0-1.125-.504-1.125-1.125v-1.5c0-1.036.84-1.875 1.875-1.875H5.25l1.406-3.75A2.25 2.25 0 0 1 8.764 7.5h6.472a2.25 2.25 0 0 1 2.108 1.476L18.75 12h2.625c1.035 0 1.875.84 1.875 1.875v1.5c0 .621-.504 1.125-1.125 1.125H18.75m-3-3h-9" />
    </svg>
  )
}

function BikeIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2M3 18a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm12 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0ZM6 18h2l4-8h2l2.5 4.5M14 10l2-4" />
    </svg>
  )
}

function WalkIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  )
}

function VeganIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c.53 0 1.04.21 1.41.59l.82.82c.37.37.88.59 1.41.59h.36a2 2 0 0 1 2 2v.36c0 .53.22 1.04.59 1.41l.82.82a2 2 0 0 1 0 2.82l-.82.82c-.37.38-.59.88-.59 1.41v.36a2 2 0 0 1-2 2h-.36c-.53 0-1.04.22-1.41.59l-.82.82a2 2 0 0 1-2.82 0l-.82-.82c-.38-.37-.88-.59-1.41-.59h-.36a2 2 0 0 1-2-2v-.36c0-.53-.22-1.04-.59-1.41l-.82-.82a2 2 0 0 1 0-2.82l.82-.82c.37-.37.59-.88.59-1.41V5.99a2 2 0 0 1 2-2h.36c.53 0 1.04-.22 1.41-.59l.82-.82A2 2 0 0 1 12 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
    </svg>
  )
}

function VegetarianIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M3 12c0-4.97 4.03-9 9-9s9 4.03 9 9-4.03 9-9 9" />
    </svg>
  )
}

function BalancedIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.47 0-2.78-.63-3.71-1.64M12 20.25c1.47 0 2.78-.63 3.71-1.64M3.75 12h16.5M4.5 9.75h15M4.5 14.25h15" />
    </svg>
  )
}

function MeatIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
    </svg>
  )
}

function ApartmentIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21" />
    </svg>
  )
}

function HouseIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
  )
}

function StudioIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l5.736-5.736a2.25 2.25 0 0 1 3.182 0L13.5 8.646m-3-3L15.736 2.736a2.25 2.25 0 0 1 3.182 0L21.75 7.5M3.75 21h16.5a1.5 1.5 0 0 0 1.5-1.5V12a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 12v7.5A1.5 1.5 0 0 0 3.75 21Z" />
    </svg>
  )
}

function SharedIcon() {
  return (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  )
}
