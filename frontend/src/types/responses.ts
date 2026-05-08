export type ApiResponse<T> = { data: T }

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type PeriodType = 'daily' | 'monthly'
export type FocusMode = 'focus' | 'break'

export type Task = {
  id: number
  title: string
  description?: string
  dueDate?: string
  periodType: PeriodType
  priority: number
  status: TaskStatus
  estimatedMinutes: number
  createdAt: string
  updatedAt: string
}

export type StudyPlan = {
  id: number
  subject: string
  goal: string
  startDate: string
  targetDate: string
  weeklyTargetMinutes: number
  note?: string
  createdAt: string
  updatedAt: string
}

export type FocusSession = {
  id: number
  taskId?: number
  subject?: string
  mode: FocusMode
  startTime: string
  endTime: string
  durationMinutes: number
  createdAt: string
}

export type Summary = {
  todayFocusMinutes: number
  tasksCompleted: number
  activePlans: number
  totalTasks: number
  focusSessionsLogged: number
}
