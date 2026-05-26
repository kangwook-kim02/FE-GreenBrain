'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { apiFetch } from '@/lib/api'
import AuthHeader from '@/components/AuthHeader'
import LoadingSpinner from '@/components/LoadingSpinner'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  async function onSubmit(data: LoginForm) {
    setServerError('')
    setIsLoading(true)
    try {
      const res = await apiFetch<{ onboarding_completed: boolean }>('/api/auth/login', {
        method: 'POST',
        body: { email: data.email, password: data.password },
      })
      window.location.href = res.onboarding_completed ? '/chat' : '/onboarding'
    } catch (err) {
      const status = (err as { status?: number }).status
      if (status === 401) {
        setServerError('이메일 또는 비밀번호가 올바르지 않습니다')
      } else if (status === 429) {
        setServerError('로그인 시도 횟수를 초과했습니다')
      } else {
        setServerError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <AuthHeader title="GreenBrain" subtitle="AI 챗봇 탄소 책임 서비스" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              이메일
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              {...register('email', {
                required: '이메일을 입력해주세요.',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '올바른 이메일 형식을 입력해주세요.' },
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              {...register('password', { required: '비밀번호를 입력해주세요.' })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isLoading && <LoadingSpinner />}
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            계정이 없으신가요?{' '}
            <Link href="/signup" className="text-green-500 hover:text-green-600 font-medium">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
