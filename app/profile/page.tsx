'use client'

import { useState, useRef, useEffect } from 'react'
import SidebarLayout from '@/components/SidebarLayout'
import OnboardingIcon from '@/components/icons/OnboardingIcons'
import type { OnboardingIconName } from '@/components/icons/OnboardingIcons'
import { useApp } from '@/contexts/AppContext'
import { apiFetch } from '@/lib/api'

const TRANSPORT_OPTIONS = [
  { value: 'transit', label: '대중교통', icon: 'publicTransit' as OnboardingIconName },
  { value: 'car', label: '자가용', icon: 'car' as OnboardingIconName },
  { value: 'bike', label: '자전거', icon: 'bike' as OnboardingIconName },
  { value: 'walk', label: '도보', icon: 'walk' as OnboardingIconName },
]

const DIET_OPTIONS = [
  { value: 'vegan', label: '비건', icon: 'vegan' as OnboardingIconName },
  { value: 'vegetarian', label: '채식 위주', icon: 'vegetarian' as OnboardingIconName },
  { value: 'omnivore', label: '균형 식단', icon: 'balanced' as OnboardingIconName },
  { value: 'flexitarian', label: '육식 위주', icon: 'meat' as OnboardingIconName },
]

const HOUSING_OPTIONS = [
  { value: 'apartment', label: '아파트', icon: 'apartment' as OnboardingIconName },
  { value: 'house', label: '단독주택', icon: 'house' as OnboardingIconName },
  { value: 'studio', label: '원룸/오피스텔', icon: 'studio' as OnboardingIconName },
  { value: 'dorm', label: '셰어하우스', icon: 'shared' as OnboardingIconName },
]

type EditingSection = 'transport' | 'diet' | 'housing' | null

interface UserMeResponse {
  id: string
  email: string
  nickname: string | null
  profile_image_url: string | null
  onboarding_completed: boolean
  profile: {
    transport_mode: string
    diet_type: string
    housing_type: string
  } | null
}

function findOption<T extends { value: string }>(options: T[], value: string): T {
  return options.find((o) => o.value === value) ?? options[0]
}

function OptionCard({
  option,
  selected,
  onSelect,
  disabled,
}: {
  option: { value: string; label: string; icon: OnboardingIconName }
  selected: boolean
  onSelect: () => void
  disabled: boolean
}) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center gap-4 cursor-pointer shadow-sm hover:shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
        selected
          ? 'border-green-500 bg-green-50 shadow-md'
          : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
      }`}
    >
      <span className="text-gray-700 shrink-0"><OnboardingIcon name={option.icon} /></span>
      <span className="font-medium text-gray-900 flex-1">{option.label}</span>
      {selected && (
        <span className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </span>
      )}
    </button>
  )
}

function SectionHeader({
  title,
  currentLabel,
  currentIcon,
  isEditing,
  onToggle,
}: {
  title: string
  currentLabel: string
  currentIcon: OnboardingIconName
  isEditing: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 font-medium mb-1">{title}</p>
        <div className="flex items-center gap-2">
          <span className="text-gray-700"><OnboardingIcon name={currentIcon} /></span>
          <span className="font-semibold text-gray-900">{currentLabel}</span>
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
          isEditing
            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            : 'bg-green-50 text-green-600 hover:bg-green-100'
        }`}
      >
        {isEditing ? '닫기' : '변경'}
      </button>
    </div>
  )
}

export default function ProfilePage() {
  const { user, setUser, logout } = useApp()

  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [isSavingName, setIsSavingName] = useState(false)
  const [nameError, setNameError] = useState('')

  const [transportation, setTransportation] = useState('transit')
  const [diet, setDiet] = useState('omnivore')
  const [housing, setHousing] = useState('apartment')
  const [editingSection, setEditingSection] = useState<EditingSection>(null)
  const [isSavingHabit, setIsSavingHabit] = useState(false)
  const [habitError, setHabitError] = useState('')

  const [avatarError, setAvatarError] = useState('')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user) {
      setNameInput(user.nickname ?? '')
      if (user.profile) {
        setTransportation(user.profile.transport_mode)
        setDiet(user.profile.diet_type)
        setHousing(user.profile.housing_type)
      }
      setIsLoading(false)
      return
    }

    let cancelled = false
    async function loadProfile() {
      try {
        const data = await apiFetch<UserMeResponse>('/api/users/me')
        if (cancelled) return
        setUser({
          id: data.id,
          email: data.email,
          nickname: data.nickname,
          profile_image_url: data.profile_image_url,
          onboarding_completed: data.onboarding_completed ?? true,
          profile: data.profile
            ? {
                transport_mode: data.profile.transport_mode as 'car' | 'transit' | 'walk' | 'bike' | 'mixed',
                diet_type: data.profile.diet_type as 'omnivore' | 'vegetarian' | 'vegan' | 'flexitarian',
                housing_type: data.profile.housing_type as 'apartment' | 'house' | 'studio' | 'dorm' | 'other',
              }
            : null,
        })
        setNameInput(data.nickname ?? '')
        if (data.profile) {
          setTransportation(data.profile.transport_mode)
          setDiet(data.profile.diet_type)
          setHousing(data.profile.housing_type)
        }
      } catch {
        // 401 is handled by apiFetch
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }
    loadProfile()
    return () => { cancelled = true }
  }, [user, setUser])

  const handleSaveName = async () => {
    const trimmed = nameInput.trim()
    if (!trimmed) return
    setIsSavingName(true)
    setNameError('')
    try {
      await apiFetch('/api/users/me', {
        method: 'PATCH',
        body: { nickname: trimmed },
      })
      setUser(user ? { ...user, nickname: trimmed } : null)
      setEditingName(false)
    } catch {
      setNameError('닉네임 저장에 실패했습니다.')
    } finally {
      setIsSavingName(false)
    }
  }

  const handleSelectHabit = async (section: 'transport' | 'diet' | 'housing', value: string) => {
    setIsSavingHabit(true)
    setHabitError('')

    const body: Record<string, string> = {}
    if (section === 'transport') body.transport_mode = value
    else if (section === 'diet') body.diet_type = value
    else body.housing_type = value

    try {
      await apiFetch('/api/users/profile', {
        method: 'PATCH',
        body,
      })
      if (section === 'transport') setTransportation(value)
      else if (section === 'diet') setDiet(value)
      else setHousing(value)
      if (user?.profile) {
        const updatedProfile = { ...user.profile }
        if (section === 'transport') updatedProfile.transport_mode = value as typeof updatedProfile.transport_mode
        else if (section === 'diet') updatedProfile.diet_type = value as typeof updatedProfile.diet_type
        else updatedProfile.housing_type = value as typeof updatedProfile.housing_type
        setUser({ ...user, profile: updatedProfile })
      }
      setEditingSection(null)
    } catch {
      setHabitError('저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSavingHabit(false)
    }
  }

  const handleAvatarClick = () => {
    if (avatarPreview) {
      setAvatarPreview(null)
      setAvatarError('')
      return
    }
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setAvatarError('JPEG, PNG, WebP 형식만 지원합니다.')
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setAvatarError('파일 크기는 10MB 이하여야 합니다.')
      return
    }

    setAvatarError('')
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarUpload = async () => {
    if (!avatarPreview || !fileInputRef.current?.files?.[0]) return

    setIsUploadingAvatar(true)
    setAvatarError('')
    const formData = new FormData()
    formData.append('avatar', fileInputRef.current.files[0])
    try {
      const data = await apiFetch<{ profile_image_url: string }>('/api/users/me', {
        method: 'PATCH',
        body: formData,
      })
      setUser(user ? { ...user, profile_image_url: data.profile_image_url } : null)
      setAvatarPreview(null)
    } catch {
      setAvatarError('프로필 사진 변경에 실패했습니다.')
    } finally {
      setIsUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSaveName()
    if (e.key === 'Escape') setEditingName(false)
  }

  const nickname = user?.nickname ?? ''
  const email = user?.email ?? ''
  const profileImageUrl = avatarPreview ?? user?.profile_image_url

  const currentTransport = findOption(TRANSPORT_OPTIONS, transportation)
  const currentDiet = findOption(DIET_OPTIONS, diet)
  const currentHousing = findOption(HOUSING_OPTIONS, housing)

  if (isLoading) {
    return (
      <SidebarLayout>
        {(toggleButton) => (
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            <header className="bg-white border-b border-gray-200 shrink-0">
              <div className="max-w-2xl mx-auto p-4 flex items-center gap-3">
                {toggleButton}
                <h1 className="text-2xl font-bold text-gray-900 flex-1">내 프로필</h1>
              </div>
            </header>
            <div className="flex-1 flex items-center justify-center">
              <div className="w-8 h-8 border-3 border-green-500 border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        )}
      </SidebarLayout>
    )
  }

  return (
    <SidebarLayout>
      {(toggleButton) => (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          <header className="bg-white border-b border-gray-200 shrink-0 z-10">
            <div className="max-w-2xl mx-auto p-4 flex items-center gap-3">
              {toggleButton}
              <h1 className="text-2xl font-bold text-gray-900 flex-1">내 프로필</h1>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-2xl mx-auto p-4 space-y-4 pb-4">
              {/* 프로필 카드 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-5">
                  {/* 아바타 */}
                  <div className="relative shrink-0">
                    {profileImageUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={profileImageUrl}
                        alt="프로필 사진"
                        className={`w-20 h-20 rounded-full object-cover ${avatarPreview ? 'ring-2 ring-green-400 ring-offset-2' : ''}`}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-linear-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-3xl font-bold select-none">
                        {nickname ? nickname[0] : '?'}
                      </div>
                    )}
                    {isUploadingAvatar && (
                      <div className="absolute inset-0 rounded-full bg-white/60 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                    {!isUploadingAvatar && (
                      <button
                        type="button"
                        onClick={handleAvatarClick}
                        className="absolute bottom-0 right-0 w-7 h-7 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
                        title={avatarPreview ? '미리보기 취소' : '프로필 사진 변경'}
                      >
                        <svg className="w-3.5 h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* 닉네임 + 이메일 */}
                  <div className="flex-1 min-w-0">
                    {editingName ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            onKeyDown={handleNameKeyDown}
                            className="flex-1 min-w-0 px-3 py-2 border-2 border-green-400 rounded-lg text-gray-900 font-semibold focus:outline-none focus:border-green-500 text-lg"
                            autoFocus
                            disabled={isSavingName}
                          />
                          <button
                            onClick={handleSaveName}
                            disabled={isSavingName || !nameInput.trim()}
                            className="shrink-0 whitespace-nowrap px-3 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
                          >
                            저장
                          </button>
                        </div>
                        {nameError && <p className="text-sm text-red-600">{nameError}</p>}
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-gray-900 truncate">
                            {nickname || '닉네임 없음'}
                          </span>
                          <button
                            onClick={() => {
                              setNameInput(nickname)
                              setNameError('')
                              setEditingName(true)
                            }}
                            className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                            title="닉네임 변경"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-0.5">{email}</p>
                      </div>
                    )}
                  </div>
                </div>
                {avatarError && <p className="text-sm text-red-600 mt-3">{avatarError}</p>}
                {avatarPreview && (
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => { setAvatarPreview(null); setAvatarError('') }}
                      className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleAvatarUpload}
                      disabled={isUploadingAvatar}
                      className="text-sm text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-300 font-semibold px-4 py-1.5 rounded-lg transition-colors"
                    >
                      사진 저장
                    </button>
                  </div>
                )}
              </div>

              {/* 생활 습관 프로필 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 pt-5 pb-3">
                  <h2 className="text-base font-bold text-gray-900">생활 습관 프로필</h2>
                  <p className="text-sm text-gray-500 mt-0.5">챌린지 추천에 활용되는 정보입니다.</p>
                </div>

                {habitError && (
                  <div className="mx-6 mb-2 text-sm text-red-600">{habitError}</div>
                )}

                <div className="divide-y divide-gray-100">
                  {/* 교통수단 */}
                  <div className="px-6 py-4">
                    <SectionHeader
                      title="교통수단"
                      currentLabel={currentTransport.label}
                      currentIcon={currentTransport.icon}
                      isEditing={editingSection === 'transport'}
                      onToggle={() => setEditingSection((prev) => (prev === 'transport' ? null : 'transport'))}
                    />
                    {editingSection === 'transport' && (
                      <div className="mt-3 space-y-2">
                        {TRANSPORT_OPTIONS.map((opt) => (
                          <OptionCard
                            key={opt.value}
                            option={opt}
                            selected={transportation === opt.value}
                            onSelect={() => handleSelectHabit('transport', opt.value)}
                            disabled={isSavingHabit}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 식단 */}
                  <div className="px-6 py-4">
                    <SectionHeader
                      title="식단"
                      currentLabel={currentDiet.label}
                      currentIcon={currentDiet.icon}
                      isEditing={editingSection === 'diet'}
                      onToggle={() => setEditingSection((prev) => (prev === 'diet' ? null : 'diet'))}
                    />
                    {editingSection === 'diet' && (
                      <div className="mt-3 space-y-2">
                        {DIET_OPTIONS.map((opt) => (
                          <OptionCard
                            key={opt.value}
                            option={opt}
                            selected={diet === opt.value}
                            onSelect={() => handleSelectHabit('diet', opt.value)}
                            disabled={isSavingHabit}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 주거 형태 */}
                  <div className="px-6 py-4">
                    <SectionHeader
                      title="주거 형태"
                      currentLabel={currentHousing.label}
                      currentIcon={currentHousing.icon}
                      isEditing={editingSection === 'housing'}
                      onToggle={() => setEditingSection((prev) => (prev === 'housing' ? null : 'housing'))}
                    />
                    {editingSection === 'housing' && (
                      <div className="mt-3 space-y-2">
                        {HOUSING_OPTIONS.map((opt) => (
                          <OptionCard
                            key={opt.value}
                            option={opt}
                            selected={housing === opt.value}
                            onSelect={() => handleSelectHabit('housing', opt.value)}
                            disabled={isSavingHabit}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 로그아웃 */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <button
                  onClick={() => logout()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-red-500 font-semibold hover:bg-red-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  )
}
