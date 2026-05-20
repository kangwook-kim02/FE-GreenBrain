'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { apiFetch } from '@/lib/api'

interface ChatSession {
  id: string
  title: string | null
  created_at: string
  updated_at: string
}

interface Props {
  open: boolean
  onClose: () => void
}

const NAV_LINKS = [
  {
    href: '/challenges/feed',
    label: '챌린지 피드',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: '프로필',
    icon: (
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

function groupSessionsByDate(sessions: ChatSession[]) {
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)
  const startOf7DaysAgo = new Date(startOfToday)
  startOf7DaysAgo.setDate(startOf7DaysAgo.getDate() - 7)

  const groups: { label: string; items: ChatSession[] }[] = [
    { label: '오늘', items: [] },
    { label: '어제', items: [] },
    { label: '이전 7일', items: [] },
    { label: '오래된 대화', items: [] },
  ]

  for (const s of sessions) {
    const d = new Date(s.updated_at)
    if (d >= startOfToday) groups[0].items.push(s)
    else if (d >= startOfYesterday) groups[1].items.push(s)
    else if (d >= startOf7DaysAgo) groups[2].items.push(s)
    else groups[3].items.push(s)
  }

  return groups.filter((g) => g.items.length > 0)
}

export default function ChatSidebar({ open, onClose }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSid = searchParams.get('sid')

  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sessionsError, setSessionsError] = useState('')
  const [contextMenu, setContextMenu] = useState<{ sessionId: string; x: number; y: number } | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const editInputRef = useRef<HTMLInputElement>(null)
  const sessionsListRef = useRef<HTMLDivElement>(null)

  function handleNewChat() {
    router.push('/chat')
    if (window.innerWidth < 640) onClose()
  }

  // currentSid가 바뀔 때(새 세션 생성·세션 전환) 목록을 재조회한다
  useEffect(() => {
    apiFetch<{ items: ChatSession[] }>('/api/chat/sessions')
      .then((data) => {
        setSessions(data.items)
        setSessionsError('')
      })
      .catch(() => setSessionsError('세션 목록을 불러올 수 없습니다.'))
      .finally(() => setIsLoading(false))
  }, [currentSid])

  // editingId가 설정될 때 input에 포커스·전체 선택
  useEffect(() => {
    if (editingId) {
      editInputRef.current?.focus()
      editInputRef.current?.select()
    }
  }, [editingId])

  // 컨텍스트 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    if (!contextMenu) return
    const close = () => setContextMenu(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [contextMenu])

  async function handleDelete(e: React.MouseEvent, sessionId: string) {
    e.stopPropagation()
    const prev = sessions
    setSessions((s) => s.filter((x) => x.id !== sessionId))
    try {
      await apiFetch(`/api/chat/sessions/${sessionId}`, { method: 'DELETE' })
      if (currentSid === sessionId) router.push('/chat')
    } catch {
      setSessions(prev)
    }
  }

  // React onContextMenu는 브라우저 기본 메뉴를 막지 못하는 경우가 있어 네이티브 리스너 사용
  useEffect(() => {
    const el = sessionsListRef.current
    if (!el) return
    const handler = (e: MouseEvent) => {
      const target = (e.target as Element).closest('[data-session-id]')
      if (!target) return
      e.preventDefault()
      const sessionId = target.getAttribute('data-session-id')!
      setContextMenu({ sessionId, x: e.clientX, y: e.clientY })
    }
    el.addEventListener('contextmenu', handler)
    return () => el.removeEventListener('contextmenu', handler)
  }, [])

  function handleStartEdit(sessionId: string) {
    const session = sessions.find((s) => s.id === sessionId)
    setEditingTitle(session?.title ?? '')
    setEditingId(sessionId)
    setContextMenu(null)
  }

  async function handleRenameSubmit(sessionId: string) {
    const trimmed = editingTitle.trim()
    const prev = sessions
    setSessions((s) =>
      s.map((x) => (x.id === sessionId ? { ...x, title: trimmed || null } : x))
    )
    setEditingId(null)
    try {
      await apiFetch(`/api/chat/sessions/${sessionId}`, {
        method: 'PATCH',
        body: { title: trimmed || null },
      })
    } catch {
      setSessions(prev)
    }
  }

  const groups = groupSessionsByDate(sessions)

  return (
    <aside
      className={`flex-col shrink-0 bg-gray-900 text-white overflow-hidden transition-all duration-200 ease-in-out ${
        open
          ? 'flex fixed inset-y-0 left-0 z-50 w-full sm:relative sm:inset-auto sm:z-auto sm:w-64'
          : 'hidden sm:flex sm:w-0'
      }`}
    >
      {contextMenu && (
        <div
          className="fixed z-50 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 min-w-[120px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleStartEdit(contextMenu.sessionId)}
            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700 transition-colors"
          >
            제목 수정
          </button>
          <button
            onClick={(e) => {
              const sid = contextMenu.sessionId
              setContextMenu(null)
              handleDelete(e, sid)
            }}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
          >
            삭제
          </button>
        </div>
      )}

      <div className="w-full sm:w-64 flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <span className="text-lg">🌱</span>
            <span className="font-bold text-green-400 text-lg">GreenBrain</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors rounded-lg p-1 hover:bg-gray-700"
            aria-label="사이드바 닫기"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 space-y-1 border-b border-gray-700">
          <button
            onClick={() => handleNewChat()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            새 채팅
          </button>

          {NAV_LINKS.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  active
                    ? 'bg-gray-700 text-white font-semibold border-l-2 border-green-400 pl-[10px]'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </div>

        <div ref={sessionsListRef} className="flex-1 overflow-y-auto py-2">
          {isLoading && (
            <div className="space-y-1 px-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse px-3 py-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                </div>
              ))}
            </div>
          )}

          {sessionsError && (
            <p className="px-4 py-2 text-xs text-red-400">{sessionsError}</p>
          )}

          {!isLoading && !sessionsError && groups.length === 0 && (
            <p className="px-4 py-4 text-xs text-gray-500 text-center">대화 기록이 없습니다</p>
          )}

          {!isLoading && groups.map((group) => (
            <div key={group.label} className="mb-2">
              <p className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {group.label}
              </p>
              {group.items.map((session) => {
                const active = currentSid === session.id
                const isEditing = editingId === session.id
                return (
                  <div
                    key={session.id}
                    data-session-id={session.id}
                    className={`group relative flex items-center mx-1 rounded-lg transition-colors cursor-pointer ${
                      active
                        ? 'bg-gray-700 border-l-2 border-green-400'
                        : 'hover:bg-gray-700'
                    }`}
                  >
                    {isEditing ? (
                      <input
                        ref={editInputRef}
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleRenameSubmit(session.id)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        onBlur={() => handleRenameSubmit(session.id)}
                        className="flex-1 bg-gray-600 text-white text-sm px-3 py-2 rounded-md outline-none focus:ring-1 focus:ring-green-400 min-w-0 mx-1 my-0.5"
                        placeholder="세션 제목"
                      />
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            router.push(`/chat?sid=${session.id}`)
                            if (window.innerWidth < 640) onClose()
                          }}
                          className="flex-1 min-w-0 text-left px-3 py-2 text-sm text-gray-300 group-hover:text-white truncate"
                          title={session.title ?? '새 채팅'}
                        >
                          {session.title ?? '새 채팅'}
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, session.id)}
                          className="hidden group-hover:flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-400 transition-colors shrink-0"
                          aria-label="세션 삭제"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
