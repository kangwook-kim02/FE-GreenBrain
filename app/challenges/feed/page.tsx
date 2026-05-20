'use client'

import { useState, useEffect, useCallback } from 'react'
import SidebarLayout from '@/components/SidebarLayout'
import SkeletonCard from '@/components/SkeletonCard'
import EmptyState from '@/components/EmptyState'
import { useApp } from '@/contexts/AppContext'
import { apiFetch } from '@/lib/api'

interface FeedItem {
  photo_id: string
  challenge_id: string
  user_id: string
  nickname: string | null
  profile_image_url: string | null
  title: string
  category: 'transport' | 'diet' | 'energy'
  photo_url: string
  like_count: number
  liked_by_me: boolean
  carbon_saved_gco2eq: number | null
  created_at: string
}

interface FeedResponse {
  items: FeedItem[]
  total: number | null
  limit: number
  offset: number
}

interface LikeResponse {
  liked: boolean
  photo_id: string
  like_count: number
  reward_given: boolean
  reward_amount: number
  tokens_remaining: number
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return '방금 전'
  if (diffMin < 60) return `${diffMin}분 전`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}시간 전`
  return `${Math.floor(diffHour / 24)}일 전`
}

function FeedCard({
  item,
  isOwner,
  onDelete,
  onLikeToggle,
}: {
  item: FeedItem
  isOwner: boolean
  onDelete: (photoId: string) => void
  onLikeToggle: (photoId: string) => Promise<LikeResponse | void>
}) {
  const [likeCount, setLikeCount] = useState(item.like_count)
  const [likedByMe, setLikedByMe] = useState(item.liked_by_me)
  const [likeLoading, setLikeLoading] = useState(false)
  const [likeError, setLikeError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  async function handleLike() {
    if (likedByMe || isOwner || likeLoading) return
    setLikeError('')
    setLikeLoading(true)
    const prevCount = likeCount
    setLikedByMe(true)
    setLikeCount(prevCount + 1)
    try {
      const res = await onLikeToggle(item.photo_id)
      if (res?.like_count != null) setLikeCount(res.like_count)
    } catch {
      setLikedByMe(false)
      setLikeCount(prevCount)
      setLikeError('좋아요에 실패했습니다.')
    } finally {
      setLikeLoading(false)
    }
  }

  function handleDelete() {
    onDelete(item.photo_id)
    setShowDeleteConfirm(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {item.profile_image_url ? (
              <img
                src={item.profile_image_url}
                alt={item.nickname ?? ''}
                className="w-9 h-9 rounded-full object-cover bg-gray-100"
              />
            ) : (
              <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-sm font-semibold">
                {(item.nickname ?? '?')[0]}
              </div>
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.nickname ?? '익명'}</p>
              <p className="text-xs text-gray-500">{formatTime(item.created_at)}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{item.title}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <img
          src={item.photo_url}
          alt={item.title}
          className="w-full aspect-square object-cover bg-gray-100"
        />
        {isOwner && !showDeleteConfirm && (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 text-gray-500 hover:text-red-500 transition-colors"
            aria-label="삭제"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="px-4 py-3 bg-red-50 border-t border-red-100 flex items-center justify-between">
          <p className="text-sm text-red-700">정말 삭제하시겠습니까?</p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="text-sm text-gray-600 hover:text-gray-800 px-3 py-1"
            >
              취소
            </button>
            <button
              onClick={handleDelete}
              className="text-sm text-red-600 font-semibold hover:text-red-700 px-3 py-1"
            >
              삭제
            </button>
          </div>
        </div>
      )}

      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleLike}
            disabled={likedByMe || isOwner || likeLoading}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
              likedByMe
                ? 'text-green-600 cursor-default'
                : isOwner
                  ? 'text-gray-400 cursor-default'
                  : 'text-gray-500 hover:text-green-600'
            }`}
          >
            <svg
              className="w-5 h-5"
              fill={likedByMe ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>{likeCount}</span>
          </button>
          {item.carbon_saved_gco2eq != null && (
            <span className="text-xs text-gray-400">
              -{item.carbon_saved_gco2eq}g CO₂
            </span>
          )}
        </div>
        {likeError && <p className="text-xs text-red-500 mt-1">{likeError}</p>}
      </div>
    </div>
  )
}

export default function ChallengeFeedPage() {
  const { user } = useApp()
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const loadFeed = useCallback(async () => {
    setError('')
    setIsLoading(true)
    try {
      const data = await apiFetch<FeedResponse>('/api/challenges/feed?limit=20&offset=0')
      setFeedItems(data.items)
    } catch {
      setError('피드를 불러오지 못했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFeed()
    // eslint-disable-next-line react-hooks/set-state-in-effect
  }, [loadFeed])

  async function handleLikeToggle(photoId: string): Promise<LikeResponse | void> {
    return await apiFetch<LikeResponse>('/api/challenge-photos/' + photoId + '/like', { method: 'POST' })
  }

  async function handleDelete(photoId: string) {
    try {
      await apiFetch('/api/challenge-photos/' + photoId, { method: 'DELETE' })
      setFeedItems((prev) => prev.filter((item) => item.photo_id !== photoId))
    } catch {
      setError('게시물 삭제에 실패했습니다.')
    }
  }

  return (
    <SidebarLayout>
      {(toggleButton) => (
        <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
          <header className="bg-white border-b border-gray-200 shrink-0 z-10">
            <div className="max-w-4xl mx-auto p-4 flex items-center gap-3">
              {toggleButton}
              <h1 className="text-2xl font-bold text-gray-900 flex-1">챌린지 인증 피드</h1>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p className="text-sm text-green-700">
                    인증 사진에 <span className="font-semibold">좋아요</span>를 눌러 응원해보세요! 좋아요 3개당 +20 토큰이 지급됩니다.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center justify-between">
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    onClick={loadFeed}
                    className="text-sm text-red-600 font-semibold hover:text-red-700 ml-3 shrink-0"
                  >
                    재시도
                  </button>
                </div>
              )}

              {isLoading ? (
                <div className="space-y-4">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : feedItems.length === 0 ? (
                <EmptyState
                  message="아직 인증된 챌린지가 없습니다"
                  ctaLabel="챌린지 참여하기"
                  onCta={() => {}}
                />
              ) : (
                <div className="space-y-4">
                  {feedItems.map((item) => (
                    <FeedCard
                      key={item.photo_id}
                      item={item}
                      isOwner={user?.id === item.user_id}
                      onDelete={handleDelete}
                      onLikeToggle={handleLikeToggle}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  )
}
