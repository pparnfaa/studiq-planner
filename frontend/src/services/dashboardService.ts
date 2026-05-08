import type { ApiResponse, Summary } from '../types/responses'
import { getApiBaseUrl } from './client'

export async function fetchSummary(): Promise<Summary> {
  const response = await fetch(`${getApiBaseUrl()}/api/v1/dashboard/summary`)
  if (!response.ok) throw new Error('failed loading summary')
  const payload = (await response.json()) as ApiResponse<Summary>
  return payload.data
}
