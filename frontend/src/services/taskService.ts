import type { TaskUpsertBody, TaskListQuery } from '../types/requests'
import type { ApiResponse, Task } from '../types/responses'
import { getApiBaseUrl } from './client'

export async function listTasks(query: TaskListQuery): Promise<Task[]> {
  const params = new URLSearchParams()
  if (query.periodType) params.set('periodType', query.periodType)
  if (query.status) params.set('status', query.status)
  if (query.month) params.set('month', query.month)
  const qs = params.toString()
  const response = await fetch(`${getApiBaseUrl()}/api/v1/tasks${qs ? `?${qs}` : ''}`)
  if (!response.ok) throw new Error('failed loading tasks')
  const payload = (await response.json()) as ApiResponse<Task[]>
  return payload.data
}

export async function saveTask(id: number | null, body: TaskUpsertBody): Promise<Response> {
  const endpoint =
    id === null ? `${getApiBaseUrl()}/api/v1/tasks` : `${getApiBaseUrl()}/api/v1/tasks/${id}`
  const method = id === null ? 'POST' : 'PATCH'
  return fetch(endpoint, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

export async function deleteTask(id: number): Promise<Response> {
  return fetch(`${getApiBaseUrl()}/api/v1/tasks/${id}`, { method: 'DELETE' })
}
