'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

type IconFn = (className: string) => React.ReactNode

const NAV_ITEMS: { href: string; label: string; shortLabel?: string; icon: IconFn }[] = [
  {
    href: '/chat',
    label: '채팅',
    icon: (cls) => (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    href: '/challenges/feed',
    label: '챌린지 피드',
    shortLabel: '피드',
    icon: (cls) => (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: '프로필',
    icon: (cls) => (
      <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
]

export default function NavMenu({ hiddenOnDesktop = false }: { hiddenOnDesktop?: boolean }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <>
      <div className={`relative ${hiddenOnDesktop ? 'hidden' : 'hidden sm:block'}`} ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col justify-center gap-1.5 w-9 h-9 items-center rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="메뉴 열기"
        >
          <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 origin-center ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-5 h-0.5 bg-gray-700 transition-all duration-200 origin-center ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>

        {open && (
          <div className="absolute right-0 top-11 w-44 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    active
                      ? 'bg-green-50 text-green-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <span className={active ? 'text-green-500' : 'text-gray-400'}>
                    {item.icon('w-4 h-4')}
                  </span>
                  {item.label}
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex sm:hidden bg-white border-t border-gray-200">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors ${
                active ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {item.icon('w-6 h-6')}
              <span className={`text-[10px] font-medium leading-none ${active ? 'text-green-600' : 'text-gray-400'}`}>
                {item.shortLabel ?? item.label}
              </span>
              {active && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-green-500" />
              )}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
