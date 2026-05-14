'use client'

import { useState } from 'react'

const SAMPLE_CHALLENGES = [
  {
    id: '1',
    title: '대중교통 이용하기',
    description: '오늘 이동 시 자가용 대신 대중교통을 이용하고 인증샷을 남겨주세요.',
    category: '교통',
    icon: '🚇',
  },
  {
    id: '2',
    title: '채식 식사하기',
    description: '오늘 점심이나 저녁에 채식 메뉴를 선택하고 사진을 찍어주세요.',
    category: '식단',
    icon: '🥗',
  },
  {
    id: '3',
    title: '에어컨 대신 창문 열기',
    description: '2시간 이상 에어컨을 끄고 자연 환기를 해보세요.',
    category: '에너지',
    icon: '💨',
  },
]

interface Props {
  onClose: () => void
}

export default function ChallengeModal({ onClose }: Props) {
  const [challenge] = useState(
    () => SAMPLE_CHALLENGES[Math.floor(Math.random() * SAMPLE_CHALLENGES.length)]
  )
  const [isAccepted, setIsAccepted] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [fileError, setFileError] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setFileError('')

    if (file.size > 10 * 1024 * 1024) {
      setFileError('파일 크기는 10MB 이하여야 합니다.')
      return
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFileError('JPEG, PNG, WebP 형식만 지원됩니다.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => setPreviewUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleUpload = () => {
    setIsUploading(true)
    // API 연동은 issue #14에서 구현
    setTimeout(() => {
      setIsUploading(false)
      onClose()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-300" />
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">오늘의 챌린지</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5">
          {!isAccepted ? (
            <div className="text-center">
              <div className="text-5xl mb-3">{challenge.icon}</div>
              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold mb-3">
                {challenge.category}
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{challenge.title}</h3>
              <p className="text-gray-600 mb-5">{challenge.description}</p>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-amber-800 font-semibold text-sm">💡 보상 안내</p>
                <p className="text-amber-700 text-sm mt-1">
                  커뮤니티 좋아요 3개당 <strong>+20 탄소 토큰</strong> 획득
                </p>
                <p className="text-amber-600 text-xs mt-0.5">하루 최대 50 토큰</p>
              </div>

              <button
                onClick={() => setIsAccepted(true)}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-xl transition-colors text-base"
              >
                챌린지 수락하기
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{challenge.icon}</span>
                <div>
                  <p className="font-bold text-gray-900">{challenge.title}</p>
                  <p className="text-sm text-gray-500">{challenge.description}</p>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 mb-4">
                {previewUrl ? (
                  <div className="text-center">
                    <img
                      src={previewUrl}
                      alt="미리보기"
                      className="max-w-full max-h-64 mx-auto rounded-lg mb-3 object-contain"
                    />
                    <button
                      onClick={() => { setPreviewUrl(''); setFileError('') }}
                      className="text-red-500 hover:text-red-600 text-sm font-medium"
                    >
                      다시 선택
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-500 text-sm mb-1">챌린지 인증 사진을 업로드하세요</p>
                    <p className="text-gray-400 text-xs mb-4">JPEG, PNG, WebP (최대 10MB)</p>
                    <label className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-lg cursor-pointer transition-colors text-sm">
                      사진 선택
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              {fileError && (
                <p className="text-red-500 text-sm mb-4">{fileError}</p>
              )}

              {previewUrl && (
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
                >
                  {isUploading ? '업로드 중...' : '인증 사진 업로드'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
