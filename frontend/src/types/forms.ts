import type { PeriodType, TaskStatus } from './responses'

export type TaskFormState = {
  title: string
  description: string
  dueDate: string
  periodType: PeriodType
  priority: number
  status: TaskStatus
  estimatedMinutes: number
}

export type PlanFormState = {
  subject: string
  goal: string
  startDate: string
  targetDate: string
  weeklyTargetMinutes: number
  note: string
}

export const defaultTaskForm: TaskFormState = {
  title: '',
  description: '',
  dueDate: '',
  periodType: 'daily',
  priority: 2,
  status: 'todo',
  estimatedMinutes: 30,
}

export const defaultPlanForm: PlanFormState = {
  subject: '',
  goal: '',
  startDate: '',
  targetDate: '',
  weeklyTargetMinutes: 120,
  note: '',
}
