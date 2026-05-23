import { apiFetch } from './api'

export const fetcher = <T>(url: string): Promise<T> => apiFetch<T>(url)
