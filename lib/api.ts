import { toast } from 'sonner'

const BASE_URL = ''

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: Record<string, unknown> | FormData
  skipAutoRedirect?: boolean
}

export function fixStorageUrl(url: string | null): string | null {
  if (!url) return null
  return url.replace('greenbrain-uploads/greenbrain-uploads/', 'greenbrain-uploads/')
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { body, headers, skipAutoRedirect, ...rest } = options

  const isFormData = body instanceof FormData
  const requestHeaders: HeadersInit = {
    ...(!isFormData && { 'Content-Type': 'application/json' }),
    ...headers,
  }

  let response: Response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      ...rest,
      headers: requestHeaders,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    })
  } catch {
    toast.error('인터넷 연결을 확인해주세요')
    throw new Error('Network error')
  }

  if (response.status === 401 && !path.startsWith('/api/auth/')) {
    if (skipAutoRedirect) {
      throw { status: 401 }
    }
    const pubPaths = ['/login', '/signup']
    if (!pubPaths.some((p) => window.location.pathname.startsWith(p))) {
      window.location.href = '/login'
    }
    throw new Error('Unauthorized')
  }

  if (response.status === 403) {
    const data = await response.json().catch(() => ({}))
    throw { status: 403, data }
  }

  if (response.status === 422) {
    const data = await response.json().catch(() => ({}))
    throw { status: 422, data }
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
  const json = await response.json()
  return (json as { data?: T }).data as T
}
