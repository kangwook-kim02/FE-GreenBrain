'use client'

import { useState } from 'react'
import SkeletonCard from '../../../components/SkeletonCard'
import EmptyState from '../../../components/EmptyState'

interface FeedItem {
  id: string
  userId: string
  username: string
  challengeTitle: string
  challengeIcon: string
  imageUrl: string
  likes: number
  likedByMe: boolean
  isOwner: boolean
  timestamp: string
}

const MOCK_FEED: FeedItem[] = [
  {
    id: '1',
    userId: 'u1',
    username: '김현진',
    challengeTitle: '대중교통으로 출퇴근하기',
    challengeIcon: 'bus',
    imageUrl: '/placeholder-feed.jpg',
    likes: 5,
    likedByMe: false,
    isOwner: false,
    timestamp: '2026-05-14T10:30:00Z',
  },
  {
    id: '2',
    userId: 'u2',
    username: '이승호',
    challengeTitle: '채식 식단 도전',
    challengeIcon: 'leaf',
    imageUrl: '/placeholder-feed.jpg',
    likes: 12,
    likedByMe: true,
    isOwner: false,
    timestamp: '2026-05-14T09:15:00Z',
  },
  {
    id: '3',
    userId: 'me',
    username: '나',
    challengeTitle: '에너지 절약하기',
    challengeIcon: 'bolt',
    imageUrl: '/placeholder-feed.jpg',
    likes: 3,
    likedByMe: false,
    isOwner: true,
    timestamp: '2026-05-14T08:00:00Z',
  },
]

function formatTime(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 60) return `${diffMin}분 전`
  const diffHour = Math.floor(diffMin / 60)
  if (diffHour < 24) return `${diffHour}시간 전`
  return `${Math.floor(diffHour / 24)}일 전`
}

function FeedCard({
  item,
  onDelete,
}: {
  item: FeedItem
  onDelete: (id: string) => void
}) {
  const [likes, setLikes] = useState(item.likes)
  const [likedByMe, setLikedByMe] = useState(item.likedByMe)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  async function handleLike() {
    if (likedByMe || item.isOwner) return
    setLikedByMe(true)
    setLikes((prev) => prev + 1)
    // API 연동은 후속 이슈에서 구현
  }

  async function handleDelete() {
    // API 연동은 후속 이슈에서 구현
    onDelete(item.id)
    setShowDeleteConfirm(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-sm font-semibold">
              {item.username[0]}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{item.username}</p>
              <p className="text-xs text-gray-500">{formatTime(item.timestamp)}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{item.challengeTitle}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <img
          src={item.imageUrl}
          alt={item.challengeTitle}
          className="w-full aspect-square object-cover bg-gray-100"
        />
        {item.isOwner && !showDeleteConfirm && (
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
        <button
          onClick={handleLike}
          disabled={likedByMe || item.isOwner}
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
            likedByMe
              ? 'text-green-600 cursor-default'
              : item.isOwner
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
          <span>{likes}</span>
        </button>
      </div>
    </div>
  )
}

export default function ChallengeFeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(MOCK_FEED)
  const [isLoading] = useState(false)

  function handleDelete(id: string) {
    setFeedItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">챌린지 인증 피드</h1>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p className="text-sm text-green-700">
              인증 사진에 <span className="font-semibold">좋아요</span>를 눌러 응원해보세요! 좋아요 3개당 +20 토큰이 지급됩니다.
            </p>
          </div>
        </div>

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
              <FeedCard key={item.id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
