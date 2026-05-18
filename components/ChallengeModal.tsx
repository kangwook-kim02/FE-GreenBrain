'use client'

import { useState, useRef, useEffect } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import { apiFetch } from '@/lib/api'

interface ChallengeData {
  id: string
  category: 'transport' | 'diet' | 'energy'
  title: string
  description: string
  difficulty: 1 | 2 | 3
  status: 'pending_acceptance' | 'active' | 'completed'
  created_at: string
  completed_at: string | null
}

interface ChallengeModalProps {
  open: boolean
  onClose: () => void
  onReward?: (tokensRemaining: number) => void
}

const CATEGORY_COLORS: Record<ChallengeData['category'], string> = {
  transport: 'bg-blue-50 text-blue-700',
  diet: 'bg-orange-50 text-orange-700',
  energy: 'bg-yellow-50 text-yellow-700',
}

const CATEGORY_LABELS: Record<ChallengeData['category'], string> = {
  transport: '교통',
  diet: '식단',
  energy: '에너지',
}

const CATEGORY_ICONS: Record<ChallengeData['category'], string> = {
  transport: 'M8 17h.01M12 17h.01M16 17h.01M3 11l1.5-5A2 2 0 016.4 4h11.2a2 2 0 011.9 1.4L21 11M3 11v6a1 1 0 001 1h1m16-7v6a1 1 0 01-1 1h-1M3 11h18',
  diet: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
  energy: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z',
}

export default function ChallengeModal({ open, onClose, onReward }: ChallengeModalProps) {
  const [challenge, setChallenge] = useState<ChallengeData | null>(null)
  const [dailyCount, setDailyCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [step, setStep] = useState<1 | 2>(1)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fileError, setFileError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isAccepting, setIsAccepting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return

    let cancelled = false
    setIsLoading(true)
    setError('')
    setStep(1)
    setSelectedFile(null)
    setPreviewUrl(null)
    setFileError('')

    async function fetchChallenge() {
      try {
        const data = await apiFetch<{ challenge: ChallengeData | null; daily_count: number }>(
          '/api/challenges/current'
        )
        if (cancelled) return
        setDailyCount(data.daily_count)

        if (data.challenge) {
          setChallenge(data.challenge)
          if (data.challenge.status === 'active') setStep(2)
        } else if (data.daily_count < 3) {
          try {
            const genData = await apiFetch<{ challenge: ChallengeData; created: boolean }>(
              '/api/challenges/generate',
              { method: 'POST' }
            )
            if (cancelled) return
            setChallenge(genData.challenge)
          } catch (genErr) {
            const status = (genErr as { status?: number }).status
            if (status === 409) {
              setError('토큰이 남아있어 챌린지를 생성할 수 없습니다.')
            } else if (status !== 429) {
              setError('챌린지를 불러올 수 없습니다.')
            }
          }
        }
      } catch {
        if (!cancelled) setError('챌린지를 불러올 수 없습니다.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    fetchChallenge()
    return () => { cancelled = true }
  }, [open])

  if (!open) return null

  const isDailyLimitReached = dailyCount >= 3
  const cat = challenge?.category ?? 'transport'

  function handleClose() {
    setChallenge(null)
    setDailyCount(0)
    setError('')
    onClose()
  }

  async function handleAccept() {
    if (!challenge) return
    setIsAccepting(true)
    setError('')
    try {
      await apiFetch(`/api/challenges/${challenge.id}/accept`, { method: 'POST' })
      setChallenge({ ...challenge, status: 'active' })
      setStep(2)
    } catch {
      setError('챌린지 수락에 실패했습니다.')
    } finally {
      setIsAccepting(false)
    }
  }

  async function handleUpload() {
    if (!selectedFile || !challenge) return
    setIsUploading(true)
    setFileError('')
    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const data = await apiFetch<{
        reward: { tokens_remaining: number }
      }>(`/api/challenges/${challenge.id}/photo`, {
        method: 'POST',
        body: formData,
      })
      onReward?.(data.reward.tokens_remaining)
      handleClose()
    } catch {
      setFileError('업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsUploading(false)
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError('')
    const file = e.target.files?.[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setFileError('JPEG, PNG, WebP 형식만 가능합니다.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError('파일 크기는 10MB 이하여야 합니다.')
      return
    }

    setSelectedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">
            {isLoading ? '챌린지' : step === 1 ? '챌린지' : '인증 사진 업로드'}
          </h2>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="닫기"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-green-500">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-gray-600">{error}</p>
            </div>
          ) : isDailyLimitReached ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">오늘의 챌린지를 모두 완료했습니다</h3>
              <p className="text-gray-600">내일 새로운 챌린지가 기다리고 있어요!</p>
            </div>
          ) : !challenge ? null : step === 1 ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${CATEGORY_COLORS[challenge.category]}`}>
                  {CATEGORY_LABELS[challenge.category]}
                </span>
              </div>

              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={CATEGORY_ICONS[challenge.category]} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{challenge.title}</h3>
                  <p className="text-gray-600 mt-1">{challenge.description}</p>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-amber-800">보상 안내</p>
                    <p className="text-sm text-amber-700 mt-0.5">커뮤니티 좋아요 3개당 +20 토큰을 받을 수 있어요</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAccept}
                disabled={isAccepting}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isAccepting && <span className="text-white"><LoadingSpinner size="sm" /></span>}
                {isAccepting ? '처리 중...' : '챌린지 수락하기'}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={CATEGORY_ICONS[challenge.category]} />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{CATEGORY_LABELS[challenge.category]} 챌린지</p>
                    <p className="font-semibold text-gray-900">{challenge.title}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  인증 사진
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                {previewUrl ? (
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="업로드 미리보기"
                      className="w-full aspect-square object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                        if (fileInputRef.current) fileInputRef.current.value = ''
                      }}
                      className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 text-gray-600 hover:text-gray-900 transition-colors"
                      aria-label="사진 제거"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-green-400 hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-gray-500">사진을 선택하세요</span>
                    <span className="text-xs text-gray-400">JPEG, PNG, WebP (최대 10MB)</span>
                  </button>
                )}
              </div>

              {fileError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {fileError}
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {isUploading && <span className="text-white"><LoadingSpinner size="sm" /></span>}
                {isUploading ? '업로드 중...' : '인증 사진 업로드'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
