'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import { apiFetch } from '@/lib/api'

interface UserProfile {
  transport_mode: 'car' | 'transit' | 'walk' | 'bike' | 'mixed'
  diet_type: 'omnivore' | 'vegetarian' | 'vegan' | 'flexitarian'
  housing_type: 'apartment' | 'house' | 'studio' | 'dorm' | 'other'
}

export interface User {
  id: string
  email: string
  nickname: string | null
  profile_image_url: string | null
  onboarding_completed: boolean
  profile: UserProfile | null
}

interface Tokens {
  remaining: number  // API: tokens_remaining
  max: number        // 고정값 150 (API 미제공)
}

interface AppState {
  user: User | null
  tokens: Tokens
}

interface AppContextValue extends AppState {
  setUser: (user: User | null) => void
  setTokens: (tokens: Tokens) => void
  updateRemainingTokens: (remaining: number) => void
  logout: () => Promise<void>
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<Tokens>({ remaining: 150, max: 150 })

  function updateRemainingTokens(remaining: number) {
    setTokens((prev) => ({ ...prev, remaining }))
  }

  async function logout() {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' })
    } finally {
      setUser(null)
      setTokens({ remaining: 150, max: 150 })
      window.location.href = '/login'
    }
  }

  return (
    <AppContext.Provider
      value={{ user, tokens, setUser, setTokens, updateRemainingTokens, logout }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
