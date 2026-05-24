import useSWR from 'swr'
import { fetcher } from '@/lib/fetcher'

export interface Model {
  label: string
  value: string
  provider: string
}

const PROVIDER_MAP: Record<string, string> = {
  openai: 'OpenAI',
  anthropic: 'Anthropic',
  gemini: 'Google',
}

const EXCLUDED_PROVIDERS = ['runyour', 'deepseek', 'upstage']

export function parseModel(value: string): Model {
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

export function useModels() {
  const { data, error, isLoading } = useSWR<{ success: boolean; message: string; data: { items: string[] } }>(
    '/api/chat/models',
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 3_600_000, // 1시간
    }
  )

  const models = data?.data?.items
    .filter((v) => !EXCLUDED_PROVIDERS.some((p) => v.startsWith(`${p}/`)))
    .map(parseModel) ?? []

  return {
    models,
    isModelsLoading: isLoading,
    modelsError: error ? '모델 목록을 불러올 수 없습니다.' : '',
  }
}
