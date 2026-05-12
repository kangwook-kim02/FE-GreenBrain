'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  nickname: string
  onboarding_complete: boolean
}

interface Tokens {
  remaining: number
  max: number
}

interface AppState {
  user: User | null
  tokens: Tokens
}

interface AppContextValue extends AppState {
  setUser: (user: User | null) => void
  setTokens: (tokens: Tokens) => void
  updateRemainingTokens: (remaining: number) => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<Tokens>({ remaining: 150, max: 150 })

  function updateRemainingTokens(remaining: number) {
    setTokens((prev) => ({ ...prev, remaining }))
  }

  return (
    <AppContext.Provider value={{ user, tokens, setUser, setTokens, updateRemainingTokens }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
