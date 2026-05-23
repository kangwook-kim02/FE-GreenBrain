'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import TokenBar from '@/components/TokenBar'
import CarbonCard from '@/components/CarbonCard'
import SidebarLayout from '@/components/SidebarLayout'
import ChallengeModal from '@/components/ChallengeModal'
import { useApp } from '@/contexts/AppContext'
import { apiFetch } from '@/lib/api'
import MarkdownContent from '@/components/MarkdownContent'
import { invalidateSessionsCache } from '@/lib/sessions'

interface Model {
  label: string
  value: string
  provider: string
}

const PROVIDER_MAP: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  gemini: 'Google',
  deepseek: 'DeepSeek',
  upstage: 'Upstage',
}

function parseModel(value: string): Model {
  const slashIdx = value.indexOf('/')
  const providerKey = value.slice(0, slashIdx)
  const modelId = value.slice(slashIdx + 1).replace(/-\d{4}-\d{2}-\d{2}$/, '')
  const label = modelId
    .split('-')
    .map((seg) => {
      if (seg === 'gpt') return 'GPT'
      if (/^\d/.test(seg)) return seg
      return seg.charAt(0).toUpperCase() + seg.slice(1)
    })
    .join('-')
  return { label, value, provider: PROVIDER_MAP[providerKey] ?? providerKey }
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  carbonCost?: number | null
}

interface ChatMessageResponse {
  message_id: string
  response_message_id: string
  response: string
  carbon_gco2eq: number | null
  tokens_remaining: number
  exhausted: boolean
  session_title: string | null
}

interface ChatMessageFromApi {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  carbon_gco2eq: number | null
  created_at: string
}

function getCarbonAnalogy(carbonCost: number): { icon: string; text: string } {
  if (carbonCost <= 3) return { icon: '🚗', text: '자동차 약 10초 주행' }
  if (carbonCost <= 5) return { icon: '💡', text: 'LED 전구 약 30분 사용' }
  if (carbonCost <= 7) return { icon: '📱', text: '스마트폰 충전 약 15%' }
  return { icon: '🥤', text: '플라스틱 빨대 약 20개 생산' }
}

function ChatContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sid = searchParams.get('sid')
  const { user, tokens, updateRemainingTokens } = useApp()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isTokenLoading, setIsTokenLoading] = useState(true)
  const [isHistoryLoading, setIsHistoryLoading] = useState(false)
  const [historyError, setHistoryError] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(sid)
  const [models, setModels] = useState<Model[]>([])
  const [isModelsLoading, setIsModelsLoading] = useState(true)
  const [modelsError, setModelsError] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [challengeModalOpen, setChallengeModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const modelDropdownRef = useRef<HTMLDivElement>(null)
  const justCreatedSessionRef = useRef(false)

  const hasStarted = messages.length > 0
  const username = user?.nickname ?? '환경지킴이'

  useEffect(() => {
    if (justCreatedSessionRef.current) {
      justCreatedSessionRef.current = false
      return
    }

    setMessages([])
    setInput('')
    setHistoryError(false)
    setCurrentSessionId(sid)

    if (!sid) return

    setIsHistoryLoading(true)
    apiFetch<{ items: ChatMessageFromApi[] }>(`/api/chat/sessions/${sid}/messages`)
      .then((data) => {
        setMessages(
          data.items.map((m) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            carbonCost: m.role === 'assistant' ? m.carbon_gco2eq : undefined,
          }))
        )
      })
      .catch(() => setHistoryError(true))
      .finally(() => setIsHistoryLoading(false))
  }, [sid])

  useEffect(() => {
    apiFetch<{ items: string[] }>('/api/chat/models')
      .then((data) => {
        const parsed = data.items.filter((v) => v !== 'runyour/free').map(parseModel);
        setModels(parsed)
        if (parsed.length > 0) setSelectedModel(parsed[0].value)
      })
      .catch(() => setModelsError('모델 목록을 불러올 수 없습니다.'))
      .finally(() => setIsModelsLoading(false))
  }, [])

  useEffect(() => {
    apiFetch<{ tokens_remaining: number }>('/api/tokens/today')
      .then((data) => updateRemainingTokens(data.tokens_remaining))
      .catch(() => {})
      .finally(() => setIsTokenLoading(false))
  }, [updateRemainingTokens])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!modelDropdownOpen) return
    const handler = (e: MouseEvent) => {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setModelDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [modelDropdownOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || tokens.remaining <= 0 || isLoading) return

    const text = input.trim()
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      let sessionId = currentSessionId
      if (!sessionId) {
        const session = await apiFetch<{ id: string }>('/api/chat/sessions', { method: 'POST' })
        sessionId = session.id
        setCurrentSessionId(sessionId)
        justCreatedSessionRef.current = true
        router.replace(`/chat?sid=${sessionId}`)
        invalidateSessionsCache()
      }
      const data = await apiFetch<ChatMessageResponse>(
        `/api/chat/sessions/${sessionId}/messages`,
        { method: 'POST', body: { message: text, model_id: selectedModel } }
      )
      updateRemainingTokens(data.tokens_remaining)

      setMessages((prev) => [
        ...prev,
        {
          id: data.response_message_id,
          role: 'assistant',
          content: data.response,
          carbonCost: data.carbon_gco2eq,
        },
      ])
    } catch (err) {
      const status = (err as { status?: number }).status
      if (status === 403) {
        updateRemainingTokens(0)
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString() + '-err',
            role: 'assistant',
            content:
              status === 502
                ? 'AI 응답 생성에 실패했습니다. 잠시 후 다시 시도해주세요.'
                : '오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          },
        ])
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (!isTokenLoading && tokens.remaining <= 0) {
    return (
      <div className="min-h-screen bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
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
          <button
            onClick={() => setChallengeModalOpen(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            챌린지 시작하기
          </button>
          <ChallengeModal
            open={challengeModalOpen}
            onClose={() => setChallengeModalOpen(false)}
            onReward={(t) => updateRemainingTokens(t)}
          />
        </div>
      </div>
    )
  }

  return (
    <SidebarLayout>
      {(toggleButton) => (
        <div className="flex flex-col overflow-hidden h-full bg-gray-50">
          <header className="bg-white border-b border-gray-200 p-4 shrink-0">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                {toggleButton}
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
                  <button
                    onClick={() => setChallengeModalOpen(true)}
                    className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-full transition-colors"
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

          {isHistoryLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          ) : historyError ? (
            <div className="flex-1 flex items-center justify-center p-8 text-center">
              <p className="text-sm text-red-400">대화 내역을 불러올 수 없습니다. 잠시 후 다시 시도해주세요.</p>
            </div>
          ) : !hasStarted ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg">
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
                    {message.role === 'user' ? (
                      <div className="flex justify-end">
                        <div className="max-w-[70%] rounded-2xl p-4 bg-green-500 text-white">
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 max-w-3xl">
                        <MarkdownContent content={message.content} />
                      </div>
                    )}

                    {message.carbonCost !== undefined && (
                      <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mt-2`}>
                        <div className="max-w-[70%]">
                          <CarbonCard
                            carbonCost={message.carbonCost}
                            analogy={message.carbonCost !== null ? getCarbonAnalogy(message.carbonCost) : undefined}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="py-2">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          )}

          <div className="bg-white border-t border-gray-200 p-4 shrink-0">
            <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={hasStarted ? '메시지를 입력하세요.' : '오늘 어떤 도움을 드릴까요?'}
                  disabled={isHistoryLoading || isTokenLoading || tokens.remaining <= 0 || isLoading}
                  className="flex-1 min-w-0 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={isHistoryLoading || isTokenLoading || !input.trim() || tokens.remaining <= 0 || isLoading}
                  className="flex-shrink-0 px-4 sm:px-6 py-2.5 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  전송
                </button>
              </div>

              <div className="relative" ref={modelDropdownRef}>
                <button
                  type="button"
                  onClick={() => setModelDropdownOpen((v) => !v)}
                  disabled={isModelsLoading}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="font-medium">
                    {isModelsLoading
                      ? '모델 로딩 중...'
                      : (models.find((m) => m.value === selectedModel)?.label ?? selectedModel)}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 transition-transform duration-150 ${modelDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {modelsError && (
                  <p className="mt-1 text-xs text-red-500">{modelsError}</p>
                )}

                {modelDropdownOpen && models.length > 0 && (
                  <div className="absolute bottom-full left-0 mb-1 w-60 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 max-h-72 overflow-y-auto">
                    {[...new Set(models.map((m) => m.provider))].map((provider) => (
                      <div key={provider}>
                        <p className="px-3 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {provider}
                        </p>
                        {models.filter((m) => m.provider === provider).map((model) => (
                          <button
                            key={model.value}
                            type="button"
                            onClick={() => {
                              setSelectedModel(model.value)
                              setModelDropdownOpen(false)
                            }}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                              selectedModel === model.value
                                ? 'bg-green-50 text-green-700 font-semibold'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {model.label}
                            {selectedModel === model.value && (
                              <svg className="w-4 h-4 text-green-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </form>
          </div>
          <ChallengeModal
            open={challengeModalOpen}
            onClose={() => setChallengeModalOpen(false)}
            onReward={(t) => updateRemainingTokens(t)}
          />
        </div>
      )}
    </SidebarLayout>
  )
}

export default function ChatPage() {
  return (
    <Suspense>
      <ChatContent />
    </Suspense>
  )
}
