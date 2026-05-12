import { toast } from 'sonner'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: Record<string, unknown> | FormData
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  const isFormData = body instanceof FormData
  const requestHeaders: HeadersInit = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...headers,
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: requestHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  })

  if (response.status === 401) {
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (response.status === 500) {
    toast.error('일시적인 오류가 발생했습니다')
    throw new Error('Server error')
  }

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw { status: response.status, data }
  }

  if (response.status === 204) return undefined as T
  return response.json()
}
