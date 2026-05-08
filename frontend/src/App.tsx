import { useEffect, useMemo, useState } from 'react'

type TaskStatus = 'todo' | 'in_progress' | 'done'
type PeriodType = 'daily' | 'monthly'
type FocusMode = 'focus' | 'break'

type ApiResponse<T> = { data: T }

type Task = {
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

type StudyPlan = {
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

type FocusSession = {
  id: number
  taskId?: number
  subject?: string
  mode: FocusMode
  startTime: string
  endTime: string
  durationMinutes: number
  createdAt: string
}

type Summary = {
  todayFocusMinutes: number
  tasksCompleted: number
  activePlans: number
  totalTasks: number
  focusSessionsLogged: number
}

type TaskFormState = {
  title: string
  description: string
  dueDate: string
  periodType: PeriodType
  priority: number
  status: TaskStatus
  estimatedMinutes: number
}

type PlanFormState = {
  subject: string
  goal: string
  startDate: string
  targetDate: string
  weeklyTargetMinutes: number
  note: string
}

const defaultTaskForm: TaskFormState = {
  title: '',
  description: '',
  dueDate: '',
  periodType: 'daily',
  priority: 2,
  status: 'todo',
  estimatedMinutes: 30,
}

const defaultPlanForm: PlanFormState = {
  subject: '',
  goal: '',
  startDate: '',
  targetDate: '',
  weeklyTargetMinutes: 120,
  note: '',
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const rem = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(rem).padStart(2, '0')}`
}

function App() {
  const apiUrl = useMemo(() => import.meta.env.VITE_API_URL ?? 'http://localhost:8080', [])
  const [tasks, setTasks] = useState<Task[]>([])
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [message, setMessage] = useState('Ready')

  const [taskForm, setTaskForm] = useState<TaskFormState>(defaultTaskForm)
  const [taskEditingId, setTaskEditingId] = useState<number | null>(null)
  const [planForm, setPlanForm] = useState<PlanFormState>(defaultPlanForm)
  const [planEditingId, setPlanEditingId] = useState<number | null>(null)

  const [taskPeriodFilter, setTaskPeriodFilter] = useState<'all' | PeriodType>('all')
  const [taskStatusFilter, setTaskStatusFilter] = useState<'all' | TaskStatus>('all')
  const [taskMonthFilter, setTaskMonthFilter] = useState('')
  const [focusStartDateFilter, setFocusStartDateFilter] = useState('')
  const [focusEndDateFilter, setFocusEndDateFilter] = useState('')

  const [timerSeconds, setTimerSeconds] = useState(25 * 60)
  const [timerRunning, setTimerRunning] = useState(false)
  const [timerStartTime, setTimerStartTime] = useState<string | null>(null)
  const [timerSubject, setTimerSubject] = useState('')
  const [timerTaskId, setTimerTaskId] = useState('')
  const [timerMode, setTimerMode] = useState<FocusMode>('focus')

  const loadTasks = async () => {
    const params = new URLSearchParams()
    if (taskPeriodFilter !== 'all') params.set('periodType', taskPeriodFilter)
    if (taskStatusFilter !== 'all') params.set('status', taskStatusFilter)
    if (taskMonthFilter) params.set('month', taskMonthFilter)
    const query = params.toString()
    const response = await fetch(`${apiUrl}/api/v1/tasks${query ? `?${query}` : ''}`)
    if (!response.ok) throw new Error('failed loading tasks')
    const payload = (await response.json()) as ApiResponse<Task[]>
    setTasks(payload.data)
  }

  const loadStudyPlans = async () => {
    const response = await fetch(`${apiUrl}/api/v1/study-plans`)
    if (!response.ok) throw new Error('failed loading study plans')
    const payload = (await response.json()) as ApiResponse<StudyPlan[]>
    setStudyPlans(payload.data)
  }

  const loadFocusSessions = async () => {
    const params = new URLSearchParams()
    if (focusStartDateFilter) params.set('startDate', focusStartDateFilter)
    if (focusEndDateFilter) params.set('endDate', focusEndDateFilter)
    const query = params.toString()
    const response = await fetch(`${apiUrl}/api/v1/focus-sessions${query ? `?${query}` : ''}`)
    if (!response.ok) throw new Error('failed loading focus sessions')
    const payload = (await response.json()) as ApiResponse<FocusSession[]>
    setFocusSessions(payload.data)
  }

  const loadSummary = async () => {
    const response = await fetch(`${apiUrl}/api/v1/dashboard/summary`)
    if (!response.ok) throw new Error('failed loading summary')
    const payload = (await response.json()) as ApiResponse<Summary>
    setSummary(payload.data)
  }

  const refreshAll = async () => {
    try {
      await Promise.all([loadTasks(), loadStudyPlans(), loadFocusSessions(), loadSummary()])
      setMessage('Data synced with backend')
    } catch {
      setMessage('Cannot reach backend APIs')
    }
  }

  useEffect(() => {
    void refreshAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerRunning) {
        setTimerSeconds((value) => (value > 0 ? value - 1 : 0))
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [timerRunning])

  const submitTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = {
      ...taskForm,
      dueDate: taskForm.dueDate || undefined,
      title: taskForm.title.trim(),
      description: taskForm.description.trim(),
    }
    const endpoint =
      taskEditingId === null ? `${apiUrl}/api/v1/tasks` : `${apiUrl}/api/v1/tasks/${taskEditingId}`
    const method = taskEditingId === null ? 'POST' : 'PATCH'
    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      setMessage('Task save failed')
      return
    }
    setTaskForm(defaultTaskForm)
    setTaskEditingId(null)
    await loadTasks()
    await loadSummary()
    setMessage('Task saved')
  }

  const submitPlan = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = { ...planForm, subject: planForm.subject.trim(), goal: planForm.goal.trim(), note: planForm.note.trim() }
    const endpoint =
      planEditingId === null
        ? `${apiUrl}/api/v1/study-plans`
        : `${apiUrl}/api/v1/study-plans/${planEditingId}`
    const method = planEditingId === null ? 'POST' : 'PATCH'
    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      setMessage('Study plan save failed')
      return
    }
    setPlanForm(defaultPlanForm)
    setPlanEditingId(null)
    await loadStudyPlans()
    await loadSummary()
    setMessage('Study plan saved')
  }

  const deleteTask = async (id: number) => {
    const response = await fetch(`${apiUrl}/api/v1/tasks/${id}`, { method: 'DELETE' })
    if (!response.ok) {
      setMessage('Task delete failed')
      return
    }
    await loadTasks()
    await loadSummary()
    setMessage('Task deleted')
  }

  const deletePlan = async (id: number) => {
    const response = await fetch(`${apiUrl}/api/v1/study-plans/${id}`, { method: 'DELETE' })
    if (!response.ok) {
      setMessage('Study plan delete failed')
      return
    }
    await loadStudyPlans()
    await loadSummary()
    setMessage('Study plan deleted')
  }

  const startTimer = () => {
    if (!timerStartTime) {
      setTimerStartTime(new Date().toISOString())
    }
    setTimerRunning(true)
    setMessage('Focus timer running')
  }

  const pauseTimer = () => {
    setTimerRunning(false)
    setMessage('Focus timer paused')
  }

  const resetTimer = () => {
    setTimerRunning(false)
    setTimerSeconds(25 * 60)
    setTimerStartTime(null)
    setMessage('Focus timer reset')
  }

  const endSession = async () => {
    setTimerRunning(false)
    if (!timerStartTime) {
      setMessage('Start timer before ending session')
      return
    }
    const endTime = new Date().toISOString()
    const durationMinutes = Math.max(1, Math.round((Date.parse(endTime) - Date.parse(timerStartTime)) / 60000))
    const payload = {
      taskId: timerTaskId ? Number(timerTaskId) : undefined,
      subject: timerSubject.trim(),
      mode: timerMode,
      startTime: timerStartTime,
      endTime,
      durationMinutes,
    }
    const response = await fetch(`${apiUrl}/api/v1/focus-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      setMessage('Failed to save focus session')
      return
    }
    setTimerSeconds(25 * 60)
    setTimerStartTime(null)
    await loadFocusSessions()
    await loadSummary()
    setMessage('Focus session saved')
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-2xl border border-white/10 bg-linear-to-r from-cyan-500/20 via-indigo-500/20 to-violet-500/20 p-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-200 uppercase">Studiq Study Planner MVP</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Single-Page Dashboard</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => void refreshAll()} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-100">
              Refresh
            </button>
            <span className="rounded-lg border border-cyan-400/30 bg-cyan-950/40 px-3 py-2 text-sm text-cyan-100">{message}</span>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-4"><p className="text-sm text-slate-400">Today focus</p><p className="text-2xl font-semibold">{summary?.todayFocusMinutes ?? 0}m</p></article>
          <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-4"><p className="text-sm text-slate-400">Tasks done</p><p className="text-2xl font-semibold">{summary?.tasksCompleted ?? 0}</p></article>
          <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-4"><p className="text-sm text-slate-400">Total tasks</p><p className="text-2xl font-semibold">{summary?.totalTasks ?? 0}</p></article>
          <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-4"><p className="text-sm text-slate-400">Active plans</p><p className="text-2xl font-semibold">{summary?.activePlans ?? 0}</p></article>
          <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-4"><p className="text-sm text-slate-400">Sessions logged</p><p className="text-2xl font-semibold">{summary?.focusSessionsLogged ?? 0}</p></article>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4 rounded-xl border border-cyan-500/20 bg-slate-900/70 p-4">
            <h2 className="text-xl font-semibold text-cyan-300">Tasks</h2>
            <form className="grid gap-2 sm:grid-cols-2" onSubmit={submitTask}>
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Title" value={taskForm.title} onChange={(e) => setTaskForm((v) => ({ ...v, title: e.target.value }))} required />
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2" type="date" value={taskForm.dueDate} onChange={(e) => setTaskForm((v) => ({ ...v, dueDate: e.target.value }))} />
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 sm:col-span-2" placeholder="Description" value={taskForm.description} onChange={(e) => setTaskForm((v) => ({ ...v, description: e.target.value }))} />
              <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={taskForm.periodType} onChange={(e) => setTaskForm((v) => ({ ...v, periodType: e.target.value as PeriodType }))}><option value="daily">Daily</option><option value="monthly">Monthly</option></select>
              <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={taskForm.status} onChange={(e) => setTaskForm((v) => ({ ...v, status: e.target.value as TaskStatus }))}><option value="todo">Todo</option><option value="in_progress">In Progress</option><option value="done">Done</option></select>
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2" type="number" min={1} max={3} value={taskForm.priority} onChange={(e) => setTaskForm((v) => ({ ...v, priority: Number(e.target.value) }))} />
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2" type="number" min={0} value={taskForm.estimatedMinutes} onChange={(e) => setTaskForm((v) => ({ ...v, estimatedMinutes: Number(e.target.value) }))} />
              <button className="rounded bg-cyan-500 px-3 py-2 font-medium text-slate-950 sm:col-span-2" type="submit">{taskEditingId ? 'Update task' : 'Add task'}</button>
            </form>

            <div className="grid gap-2 sm:grid-cols-3">
              <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={taskPeriodFilter} onChange={(e) => setTaskPeriodFilter(e.target.value as 'all' | PeriodType)}><option value="all">All period</option><option value="daily">Daily</option><option value="monthly">Monthly</option></select>
              <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={taskStatusFilter} onChange={(e) => setTaskStatusFilter(e.target.value as 'all' | TaskStatus)}><option value="all">All status</option><option value="todo">Todo</option><option value="in_progress">In Progress</option><option value="done">Done</option></select>
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2" type="month" value={taskMonthFilter} onChange={(e) => setTaskMonthFilter(e.target.value)} />
              <button className="rounded border border-slate-600 px-3 py-2 text-sm sm:col-span-3" type="button" onClick={() => void loadTasks()}>Apply filters</button>
            </div>

            <ul className="space-y-2">
              {tasks.map((task) => (
                <li key={task.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-xs text-slate-400">{task.periodType} | {task.status} | p{task.priority}</p>
                  </div>
                  <p className="text-sm text-slate-300">{task.description || 'No description'}</p>
                  <div className="mt-2 flex gap-2">
                    <button className="rounded bg-slate-700 px-2 py-1 text-xs" type="button" onClick={() => { setTaskEditingId(task.id); setTaskForm({ title: task.title, description: task.description ?? '', dueDate: task.dueDate?.slice(0, 10) ?? '', periodType: task.periodType, priority: task.priority, status: task.status, estimatedMinutes: task.estimatedMinutes }) }}>Edit</button>
                    <button className="rounded bg-rose-500/80 px-2 py-1 text-xs" type="button" onClick={() => void deleteTask(task.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 rounded-xl border border-blue-500/20 bg-slate-900/70 p-4">
            <h2 className="text-xl font-semibold text-blue-300">Study Plans</h2>
            <form className="grid gap-2 sm:grid-cols-2" onSubmit={submitPlan}>
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Subject" value={planForm.subject} onChange={(e) => setPlanForm((v) => ({ ...v, subject: e.target.value }))} required />
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Goal" value={planForm.goal} onChange={(e) => setPlanForm((v) => ({ ...v, goal: e.target.value }))} required />
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2" type="date" value={planForm.startDate} onChange={(e) => setPlanForm((v) => ({ ...v, startDate: e.target.value }))} required />
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2" type="date" value={planForm.targetDate} onChange={(e) => setPlanForm((v) => ({ ...v, targetDate: e.target.value }))} required />
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2" type="number" min={0} value={planForm.weeklyTargetMinutes} onChange={(e) => setPlanForm((v) => ({ ...v, weeklyTargetMinutes: Number(e.target.value) }))} />
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2" placeholder="Note" value={planForm.note} onChange={(e) => setPlanForm((v) => ({ ...v, note: e.target.value }))} />
              <button className="rounded bg-blue-500 px-3 py-2 font-medium text-slate-950 sm:col-span-2" type="submit">{planEditingId ? 'Update plan' : 'Add plan'}</button>
            </form>
            <ul className="space-y-2">
              {studyPlans.map((plan) => (
                <li key={plan.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
                  <p className="font-medium">{plan.subject}</p>
                  <p className="text-sm text-slate-300">{plan.goal}</p>
                  <p className="text-xs text-slate-400">Target {plan.weeklyTargetMinutes} min/week</p>
                  <div className="mt-2 flex gap-2">
                    <button className="rounded bg-slate-700 px-2 py-1 text-xs" type="button" onClick={() => { setPlanEditingId(plan.id); setPlanForm({ subject: plan.subject, goal: plan.goal, startDate: plan.startDate.slice(0, 10), targetDate: plan.targetDate.slice(0, 10), weeklyTargetMinutes: plan.weeklyTargetMinutes, note: plan.note ?? '' }) }}>Edit</button>
                    <button className="rounded bg-rose-500/80 px-2 py-1 text-xs" type="button" onClick={() => void deletePlan(plan.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-3 rounded-xl border border-violet-500/20 bg-slate-900/70 p-4">
            <h2 className="text-xl font-semibold text-violet-300">Focus Timer</h2>
            <p className="text-5xl font-bold">{formatTimer(timerSeconds)}</p>
            <div className="grid gap-2 sm:grid-cols-3">
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 sm:col-span-2" placeholder="Subject" value={timerSubject} onChange={(e) => setTimerSubject(e.target.value)} />
              <select className="rounded border border-slate-700 bg-slate-950 px-3 py-2" value={timerMode} onChange={(e) => setTimerMode(e.target.value as FocusMode)}><option value="focus">Focus</option><option value="break">Break</option></select>
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2 sm:col-span-3" type="number" min={0} placeholder="Optional task ID" value={timerTaskId} onChange={(e) => setTimerTaskId(e.target.value)} />
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="rounded bg-violet-500 px-3 py-2 text-sm font-medium text-slate-950" type="button" onClick={startTimer}>Start</button>
              <button className="rounded bg-slate-700 px-3 py-2 text-sm" type="button" onClick={pauseTimer}>Pause</button>
              <button className="rounded bg-slate-700 px-3 py-2 text-sm" type="button" onClick={resetTimer}>Reset</button>
              <button className="rounded bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950" type="button" onClick={() => void endSession()}>End & save</button>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-emerald-500/20 bg-slate-900/70 p-4">
            <h2 className="text-xl font-semibold text-emerald-300">Focus History</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2" type="date" value={focusStartDateFilter} onChange={(e) => setFocusStartDateFilter(e.target.value)} />
              <input className="rounded border border-slate-700 bg-slate-950 px-3 py-2" type="date" value={focusEndDateFilter} onChange={(e) => setFocusEndDateFilter(e.target.value)} />
              <button className="rounded border border-slate-600 px-3 py-2 text-sm sm:col-span-2" type="button" onClick={() => void loadFocusSessions()}>Apply range</button>
            </div>
            <ul className="max-h-72 space-y-2 overflow-auto pr-1">
              {focusSessions.map((session) => (
                <li key={session.id} className="rounded border border-slate-800 bg-slate-950/60 p-3 text-sm">
                  <p className="font-medium">{session.subject || 'General session'} ({session.mode})</p>
                  <p className="text-slate-300">{session.durationMinutes} minutes</p>
                  <p className="text-xs text-slate-400">{new Date(session.startTime).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </main>
  )
}

export default App
