'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { apiFetch } from '@/lib/api'
import { useApp } from '@/contexts/AppContext'
import type { User } from '@/contexts/AppContext'

type UserMe = User & { today_tokens: { tokens_remaining: number } }

interface SignupForm {
  email: string
  password: string
  confirmPassword: string
}

const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/

export default function SignupPage() {
  const router = useRouter()
  const { setUser, updateRemainingTokens } = useApp()
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>()

  const password = watch('password')

  async function onSubmit(data: SignupForm) {
    setServerError('')
    setIsLoading(true)
    try {
      await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: { email: data.email, password: data.password },
      })
      const me = await apiFetch<UserMe>('/api/users/me')
      const { today_tokens, ...userFields } = me
      setUser(userFields)
      updateRemainingTokens(today_tokens.tokens_remaining)
      router.push('/onboarding')
    } catch (err) {
      const status = (err as { status?: number }).status
      if (status === 400) {
        setServerError('이미 사용 중인 이메일입니다')
      } else if (status === 422) {
        setServerError('입력 형식을 확인해주세요')
      } else {
        setServerError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">회원가입</h1>
          <p className="text-gray-600">GreenBrain과 함께 탄소 책임을 실천하세요</p>
        </div>

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
              placeholder="최소 8자, 대소문자+숫자 혼합"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              {...register('password', {
                required: '비밀번호를 입력해주세요.',
                pattern: { value: PASSWORD_PATTERN, message: '최소 8자, 대소문자 및 숫자를 포함해야 합니다.' },
              })}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              비밀번호 확인
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호 재입력"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              {...register('confirmPassword', {
                required: '비밀번호 확인을 입력해주세요.',
                validate: (v) => v === password || '비밀번호가 일치하지 않습니다.',
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
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
            {isLoading && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            {isLoading ? '가입 중...' : '가입하기'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            이미 계정이 있으신가요?{' '}
            <Link href="/login" className="text-green-500 hover:text-green-600 font-medium">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
