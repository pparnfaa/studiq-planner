import type { FocusMode, PeriodType, TaskStatus } from './responses'

export type TaskListQuery = {
  periodType?: PeriodType
  status?: TaskStatus
  month?: string
}

export type FocusSessionListQuery = {
  startDate?: string
  endDate?: string
}

export type TaskUpsertBody = {
  title: string
  description: string
  dueDate?: string
  periodType: PeriodType
  priority: number
  status: TaskStatus
  estimatedMinutes: number
}

export type StudyPlanUpsertBody = {
  subject: string
  goal: string
  startDate: string
  targetDate: string
  weeklyTargetMinutes: number
  note: string
}

export type FocusSessionCreateBody = {
  taskId?: number
  subject?: string
  mode: FocusMode
  startTime: string
  endTime: string
  durationMinutes: number
}
