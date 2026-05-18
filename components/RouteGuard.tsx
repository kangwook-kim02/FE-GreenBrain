'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'

const PUBLIC_PATHS = ['/login', '/signup']
const ONBOARDING_PATH = '/onboarding'

export default function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoadingUser } = useApp()

  const isPublic = PUBLIC_PATHS.includes(pathname)
  const isOnboarding = pathname === ONBOARDING_PATH

  useEffect(() => {
    if (isLoadingUser) return

    if (!user && !isPublic) {
      router.replace('/login')
    } else if (user && !user.onboarding_completed && !isOnboarding) {
      router.replace('/onboarding')
    }
  }, [user, isLoadingUser, isPublic, isOnboarding, router])

  if (isLoadingUser && !isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    )
  }

  if (!isLoadingUser && !user && !isPublic) return null
  if (!isLoadingUser && user && !user.onboarding_completed && !isOnboarding) return null

  return <>{children}</>
}
