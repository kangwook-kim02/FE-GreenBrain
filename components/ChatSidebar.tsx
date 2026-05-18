'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

const HISTORY_GROUPS = [
  {
    label: '오늘',
    items: [
      { id: 'h1', title: '탄소 발자국 줄이는 방법' },
      { id: 'h2', title: '채식 식단의 환경 영향' },
    ],
  },
  {
    label: '어제',
    items: [
      { id: 'h3', title: '대중교통 vs 자가용 탄소 비교' },
    ],
  },
  {
    label: '이전 7일',
    items: [
      { id: 'h4', title: '에너지 절약 실천 방법' },
      { id: 'h5', title: '플라스틱 사용 줄이기' },
      { id: 'h6', title: '친환경 소비 패턴 분석' },
    ],
  },
]

interface Props {
  open: boolean
}

const NAV_LINKS = [
  {
    href: '/challenges/feed',
    label: '챌린지 피드',
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: '프로필',
    icon: (
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function ChatSidebar({ open }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <aside
      className={`hidden sm:flex flex-col flex-shrink-0 bg-gray-900 text-white overflow-hidden transition-all duration-200 ease-in-out ${
        open ? 'w-64' : 'w-0'
      }`}
    >
      <div className="w-64 flex flex-col h-full">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-700">
          <span className="text-lg">🌱</span>
          <span className="font-bold text-green-400 text-lg">GreenBrain</span>
        </div>

        <div className="p-3 space-y-1 border-b border-gray-700">
          <button
            onClick={() => router.push('/chat')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
              pathname === '/chat'
                ? 'bg-gray-700 text-white font-semibold border-l-2 border-green-400 pl-[10px]'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        <div className="flex-1 overflow-y-auto py-2">
          {HISTORY_GROUPS.map((group) => (
            <div key={group.label} className="mb-2">
              <p className="px-4 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {group.label}
              </p>
              {group.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => router.push('/chat')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg mx-1 transition-colors truncate"
                  style={{ maxWidth: 'calc(100% - 8px)' }}
                  title={item.title}
                >
                  {item.title}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
