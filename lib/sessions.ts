import { mutate } from 'swr'

export const SESSIONS_KEY = '/api/chat/sessions'
export const invalidateSessionsCache = () => mutate(SESSIONS_KEY)
