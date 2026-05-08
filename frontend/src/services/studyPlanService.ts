import type { StudyPlanUpsertBody } from '../types/requests'
import type { ApiResponse, StudyPlan } from '../types/responses'
import { getApiBaseUrl } from './client'

export async function listStudyPlans(): Promise<StudyPlan[]> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/study-plans`)
  if (!response.ok) throw new Error('failed loading study plans')
  const payload = (await response.json()) as ApiResponse<StudyPlan[]>
  return payload.data
}

export async function saveStudyPlan(id: number | null, body: StudyPlanUpsertBody): Promise<Response> {
  const endpoint =
    id === null
      ? `${getApiBaseUrl()}/api/v1/study-plans`
      : `${getApiBaseUrl()}/api/v1/study-plans/${id}`
  const method = id === null ? 'POST' : 'PATCH'
  return fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function deleteStudyPlan(id: number): Promise<Response> {
  return fetch(`${getApiBaseUrl()}/api/v1/study-plans/${id}`, { method: 'DELETE' })
}
