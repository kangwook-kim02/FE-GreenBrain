'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import OnboardingIcon from '@/components/icons/OnboardingIcons'
import type { OnboardingIconName } from '@/components/icons/OnboardingIcons'

const STEPS = [
  {
    title: '주로 사용하는 교통수단은 무엇인가요?',
    description: '일상적으로 가장 자주 이용하는 교통수단을 선택해주세요.',
    options: [
      { value: 'public', label: '대중교통', icon: 'publicTransit' as OnboardingIconName },
      { value: 'car', label: '자가용', icon: 'car' as OnboardingIconName },
      { value: 'bike', label: '자전거', icon: 'bike' as OnboardingIconName },
      { value: 'walk', label: '도보', icon: 'walk' as OnboardingIconName },
    ],
  },
  {
    title: '식단 유형은 어떻게 되나요?',
    description: '평소 주로 섭취하는 식단을 선택해주세요.',
    options: [
      { value: 'vegan', label: '비건', icon: 'vegan' as OnboardingIconName },
      { value: 'vegetarian', label: '채식 위주', icon: 'vegetarian' as OnboardingIconName },
      { value: 'balanced', label: '균형 식단', icon: 'balanced' as OnboardingIconName },
      { value: 'meat', label: '육식 위주', icon: 'meat' as OnboardingIconName },
    ],
  },
  {
    title: '주거 형태는 어떻게 되나요?',
    description: '현재 거주하고 계신 주거 형태를 선택해주세요.',
    options: [
      { value: 'apartment', label: '아파트', icon: 'apartment' as OnboardingIconName },
      { value: 'house', label: '단독주택', icon: 'house' as OnboardingIconName },
      { value: 'studio', label: '원룸/오피스텔', icon: 'studio' as OnboardingIconName },
      { value: 'shared', label: '셰어하우스', icon: 'shared' as OnboardingIconName },
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
                <span className="text-gray-700 flex-shrink-0"><OnboardingIcon name={option.icon} /></span>
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

