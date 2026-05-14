'use client'

import { useState } from 'react'
import ChatSidebar from './ChatSidebar'

interface Props {
  children: (toggleButton: React.ReactNode) => React.ReactNode
}

export default function SidebarLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleButton = (
    <button
      onClick={() => setSidebarOpen((v) => !v)}
      className="hidden sm:flex flex-col justify-center gap-1.5 w-9 h-9 items-center flex-shrink-0 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label="사이드바 열기/닫기"
    >
      <span className="block w-5 h-0.5 bg-gray-700" />
      <span className="block w-5 h-0.5 bg-gray-700" />
      <span className="block w-5 h-0.5 bg-gray-700" />
    </button>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <ChatSidebar open={sidebarOpen} />
      {/* pb-16 sm:pb-0: 모바일 하단 탭바 높이 여백 */}
      <div className="flex-1 flex flex-col overflow-hidden pb-16 sm:pb-0">
        {children(toggleButton)}
      </div>
    </div>
  )
}
