import type { FocusSessionCreateBody, FocusSessionListQuery } from '../types/requests'
import type { ApiResponse, FocusSession } from '../types/responses'
import { getApiBaseUrl } from './client'

export async function listFocusSessions(query: FocusSessionListQuery): Promise<FocusSession[]> {
  const params = new URLSearchParams()
  if (query.startDate) params.set('startDate', query.startDate)
  if (query.endDate) params.set('endDate', query.endDate)
  const qs = params.toString()
  const response = await fetch(`${getApiBaseUrl()}/api/v1/focus-sessions${qs ? `?${qs}` : ''}`)
  if (!response.ok) throw new Error('failed loading focus sessions')
  const payload = (await response.json()) as ApiResponse<FocusSession[]>
  return payload.data
}

export async function createFocusSession(body: FocusSessionCreateBody): Promise<Response> {
  return fetch(`${getApiBaseUrl()}/api/v1/focus-sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}
