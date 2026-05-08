import { useEffect, useState, type FormEvent } from 'react'
import { DashboardHeader } from './components/DashboardHeader'
import { FocusHistorySection } from './components/FocusHistorySection'
import { FocusTimerSection } from './components/FocusTimerSection'
import { StudyPlansSection } from './components/StudyPlansSection'
import { SummaryCards } from './components/SummaryCards'
import { TasksSection } from './components/TasksSection'
import { fetchSummary } from './services/dashboardService'
import { createFocusSession, listFocusSessions } from './services/focusSessionService'
import { deleteStudyPlan, listStudyPlans, saveStudyPlan } from './services/studyPlanService'
import { deleteTask, listTasks, saveTask } from './services/taskService'
import { defaultPlanForm, defaultTaskForm } from './types/forms'
import type { FocusSessionListQuery, TaskListQuery } from './types/requests'
import type { FocusMode, FocusSession, PeriodType, StudyPlan, Summary, Task, TaskStatus } from './types/responses'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [message, setMessage] = useState('Ready')

  const [taskForm, setTaskForm] = useState(defaultTaskForm)
  const [taskEditingId, setTaskEditingId] = useState<number | null>(null)
  const [planForm, setPlanForm] = useState(defaultPlanForm)
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
    const query: TaskListQuery = {}
    if (taskPeriodFilter !== 'all') query.periodType = taskPeriodFilter
    if (taskStatusFilter !== 'all') query.status = taskStatusFilter
    if (taskMonthFilter) query.month = taskMonthFilter
    const data = await listTasks(query)
    setTasks(data)
  }

  const loadStudyPlans = async () => {
    const data = await listStudyPlans()
    setStudyPlans(data)
  }

  const loadFocusSessions = async () => {
    const query: FocusSessionListQuery = {}
    if (focusStartDateFilter) query.startDate = focusStartDateFilter
    if (focusEndDateFilter) query.endDate = focusEndDateFilter
    const data = await listFocusSessions(query)
    setFocusSessions(data)
  }

  const loadSummary = async () => {
    const data = await fetchSummary()
    setSummary(data)
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

  const submitTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = {
      ...taskForm,
      dueDate: taskForm.dueDate || undefined,
      title: taskForm.title.trim(),
      description: taskForm.description.trim(),
    }
    const response = await saveTask(taskEditingId, body)
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

  const submitPlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const body = {
      ...planForm,
      subject: planForm.subject.trim(),
      goal: planForm.goal.trim(),
      note: planForm.note.trim(),
    }
    const response = await saveStudyPlan(planEditingId, body)
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

  const handleDeleteTask = async (id: number) => {
    const response = await deleteTask(id)
    if (!response.ok) {
      setMessage('Task delete failed')
      return
    }
    await loadTasks()
    await loadSummary()
    setMessage('Task deleted')
  }

  const handleDeletePlan = async (id: number) => {
    const response = await deleteStudyPlan(id)
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
    const durationMinutes = Math.max(
      1,
      Math.round((Date.parse(endTime) - Date.parse(timerStartTime)) / 60000),
    )
    const response = await createFocusSession({
      taskId: timerTaskId ? Number(timerTaskId) : undefined,
      subject: timerSubject.trim(),
      mode: timerMode,
      startTime: timerStartTime,
      endTime,
      durationMinutes,
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

  const startEditTask = (task: Task) => {
    setTaskEditingId(task.id)
    setTaskForm({
      title: task.title,
      description: task.description ?? '',
      dueDate: task.dueDate?.slice(0, 10) ?? '',
      periodType: task.periodType,
      priority: task.priority,
      status: task.status,
      estimatedMinutes: task.estimatedMinutes,
    })
  }

  const startEditPlan = (plan: StudyPlan) => {
    setPlanEditingId(plan.id)
    setPlanForm({
      subject: plan.subject,
      goal: plan.goal,
      startDate: plan.startDate.slice(0, 10),
      targetDate: plan.targetDate.slice(0, 10),
      weeklyTargetMinutes: plan.weeklyTargetMinutes,
      note: plan.note ?? '',
    })
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <DashboardHeader onRefresh={refreshAll} message={message} />
        <SummaryCards summary={summary} />

        <section className="grid gap-6 lg:grid-cols-2">
          <TasksSection
            taskForm={taskForm}
            setTaskForm={setTaskForm}
            taskEditingId={taskEditingId}
            tasks={tasks}
            taskPeriodFilter={taskPeriodFilter}
            setTaskPeriodFilter={setTaskPeriodFilter}
            taskStatusFilter={taskStatusFilter}
            setTaskStatusFilter={setTaskStatusFilter}
            taskMonthFilter={taskMonthFilter}
            setTaskMonthFilter={setTaskMonthFilter}
            onSubmitTask={(e) => void submitTask(e)}
            onDeleteTask={(id) => void handleDeleteTask(id)}
            onLoadTasks={() => void loadTasks()}
            onStartEditTask={startEditTask}
          />
          <StudyPlansSection
            planForm={planForm}
            setPlanForm={setPlanForm}
            planEditingId={planEditingId}
            studyPlans={studyPlans}
            onSubmitPlan={(e) => void submitPlan(e)}
            onDeletePlan={(id) => void handleDeletePlan(id)}
            onStartEditPlan={startEditPlan}
          />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <FocusTimerSection
            timerSeconds={timerSeconds}
            timerSubject={timerSubject}
            setTimerSubject={setTimerSubject}
            timerTaskId={timerTaskId}
            setTimerTaskId={setTimerTaskId}
            timerMode={timerMode}
            setTimerMode={setTimerMode}
            onStartTimer={startTimer}
            onPauseTimer={pauseTimer}
            onResetTimer={resetTimer}
            onEndSession={() => void endSession()}
          />
          <FocusHistorySection
            focusSessions={focusSessions}
            focusStartDateFilter={focusStartDateFilter}
            setFocusStartDateFilter={setFocusStartDateFilter}
            focusEndDateFilter={focusEndDateFilter}
            setFocusEndDateFilter={setFocusEndDateFilter}
            onLoadFocusSessions={() => void loadFocusSessions()}
          />
        </section>
      </div>
    </main>
  )
}

export default App
