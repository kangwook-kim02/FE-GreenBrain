'use client'

import { Suspense, useState, useEffect } from 'react'
import ChatSidebar from './ChatSidebar'

interface Props {
  children: (toggleButton: React.ReactNode) => React.ReactNode
}

export default function SidebarLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (window.innerWidth >= 640) setSidebarOpen(true)
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false)
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  const toggleButton = !sidebarOpen ? (
    <button
      onClick={() => setSidebarOpen(true)}
      aria-expanded={false}
      className="flex flex-col justify-center gap-1.5 w-9 h-9 items-center shrink-0 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="사이드바 열기"
    >
      <span className="block w-5 h-0.5 bg-gray-700" />
      <span className="block w-5 h-0.5 bg-gray-700" />
      <span className="block w-5 h-0.5 bg-gray-700" />
    </button>
  ) : null

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Suspense>
        <ChatSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </Suspense>
      <div className="flex-1 flex flex-col overflow-hidden">
        {children(toggleButton)}
      </div>
    </div>
  )
}
