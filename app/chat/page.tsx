'use client'

import { useState, useRef, useEffect } from 'react'
import TokenBar from '@/components/TokenBar'
import CarbonCard from '@/components/CarbonCard'
import { useApp } from '@/contexts/AppContext'
import { apiFetch } from '@/lib/api'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  carbonCost?: number
}

function getCarbonAnalogy(carbonCost: number): { icon: string; text: string } {
  if (carbonCost <= 3) return { icon: '🚗', text: '자동차 약 10초 주행' }
  if (carbonCost <= 5) return { icon: '💡', text: 'LED 전구 약 30분 사용' }
  if (carbonCost <= 7) return { icon: '📱', text: '스마트폰 충전 약 15%' }
  return { icon: '🥤', text: '플라스틱 빨대 약 20개 생산' }
}

export default function ChatPage() {
  const { tokens, updateRemainingTokens } = useApp()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTokenLoading, setIsTokenLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const hasStarted = messages.length > 0
  // username은 API 연동 후 AppContext user.nickname으로 교체 (issue #13)
  const username = '환경지킴이'

  useEffect(() => {
    apiFetch<{ tokens_remaining: number }>('/api/tokens/today')
      .then((data) => updateRemainingTokens(data.tokens_remaining))
      .catch(() => {})
      .finally(() => setIsTokenLoading(false))
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || tokens.remaining <= 0 || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // 채팅 메시지 API 연동은 issue #13에서 구현
    setTimeout(() => {
      const carbonCost = Math.floor(Math.random() * 8) + 3
      const aiMessage: Message = {
        id: Date.now().toString() + '-ai',
        role: 'assistant',
        content: '이것은 시뮬레이션 응답입니다. 실제 백엔드 연결 시 AI 응답이 표시됩니다.',
        carbonCost,
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000)
  }

  if (!isTokenLoading && tokens.remaining <= 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">탄소 토큰 소진</h2>
          <p className="text-gray-600 mb-6">
            오늘의 탄소 토큰을 모두 사용했습니다.<br />
            챌린지를 완료하고 토큰을 회복하세요!
          </p>
          {/* 챌린지 모달 연결은 issue #4에서 구현 */}
          <button
            disabled
            className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg opacity-60 cursor-not-allowed"
          >
            챌린지 시작하기
          </button>
        </div>
      </div>
    )
  }

  // SidebarLayout으로 감싸기는 issue #19에서 구현
  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <h1 className="text-xl font-bold text-gray-900 flex-1">GreenBrain</h1>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">탄소 토큰</span>
              <span className={`text-sm font-bold ${tokens.remaining <= 30 ? 'text-red-500' : 'text-gray-900'}`}>
                {isTokenLoading ? '...' : `${tokens.remaining} / ${tokens.max} gCO₂eq`}
              </span>
            </div>
            <TokenBar remaining={isTokenLoading ? tokens.max : tokens.remaining} max={tokens.max} />
            <div className="flex justify-end mt-2">
              {/* 챌린지 모달 연결은 issue #4에서 구현 */}
              <button
                disabled
                className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-3 py-1.5 rounded-full opacity-60 cursor-not-allowed"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                챌린지에 참여하여 토큰 회복하기
              </button>
            </div>
          </div>
        </div>
      </header>

      {!hasStarted ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <span className="text-4xl">🌱</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 leading-snug">
            {username}님,<br />다시 오셨네요
          </h2>
          <p className="text-gray-400 mt-3 text-base">오늘도 함께 탄소를 줄여봐요</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-green-500 text-white'
                        : 'bg-white border border-gray-200'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>

                {message.carbonCost !== undefined && (
                  <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mt-2`}>
                    <div className="max-w-[70%]">
                      <CarbonCard
                        carbonCost={message.carbonCost}
                        analogy={getCarbonAnalogy(message.carbonCost)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      )}

      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={hasStarted ? '메시지를 입력하세요.' : '오늘 어떤 도움을 드릴까요?'}
            disabled={tokens.remaining <= 0 || isLoading}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || tokens.remaining <= 0 || isLoading}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            전송
          </button>
        </form>
      </div>
    </div>
  )
}
