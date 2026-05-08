import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { TaskFormState } from '../types/forms'
import type { PeriodType, Task, TaskStatus } from '../types/responses'

type TasksSectionProps = {
  taskForm: TaskFormState
  setTaskForm: Dispatch<SetStateAction<TaskFormState>>
  taskEditingId: number | null
  tasks: Task[]
  taskPeriodFilter: 'all' | PeriodType
  setTaskPeriodFilter: Dispatch<SetStateAction<'all' | PeriodType>>
  taskStatusFilter: 'all' | TaskStatus
  setTaskStatusFilter: Dispatch<SetStateAction<'all' | TaskStatus>>
  taskMonthFilter: string
  setTaskMonthFilter: Dispatch<SetStateAction<string>>
  onSubmitTask: (event: FormEvent<HTMLFormElement>) => void
  onDeleteTask: (id: number) => void
  onLoadTasks: () => void
  onStartEditTask: (task: Task) => void
}

export function TasksSection({
  taskForm,
  setTaskForm,
  taskEditingId,
  tasks,
  taskPeriodFilter,
  setTaskPeriodFilter,
  taskStatusFilter,
  setTaskStatusFilter,
  taskMonthFilter,
  setTaskMonthFilter,
  onSubmitTask,
  onDeleteTask,
  onLoadTasks,
  onStartEditTask,
}: TasksSectionProps) {
  return (
    <div className="space-y-4 rounded-xl border border-cyan-500/20 bg-slate-900/70 p-4">
      <h2 className="text-xl font-semibold text-cyan-300">Tasks</h2>
      <form className="grid gap-2 sm:grid-cols-2" onSubmit={onSubmitTask}>
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Title"
          value={taskForm.title}
          onChange={(e) => setTaskForm((v) => ({ ...v, title: e.target.value }))}
          required
        />
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          type="date"
          value={taskForm.dueDate}
          onChange={(e) => setTaskForm((v) => ({ ...v, dueDate: e.target.value }))}
        />
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2 sm:col-span-2"
          placeholder="Description"
          value={taskForm.description}
          onChange={(e) => setTaskForm((v) => ({ ...v, description: e.target.value }))}
        />
        <select
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          value={taskForm.periodType}
          onChange={(e) => setTaskForm((v) => ({ ...v, periodType: e.target.value as PeriodType }))}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
        <select
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          value={taskForm.status}
          onChange={(e) => setTaskForm((v) => ({ ...v, status: e.target.value as TaskStatus }))}
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          type="number"
          min={1}
          max={3}
          value={taskForm.priority}
          onChange={(e) => setTaskForm((v) => ({ ...v, priority: Number(e.target.value) }))}
        />
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          type="number"
          min={0}
          value={taskForm.estimatedMinutes}
          onChange={(e) => setTaskForm((v) => ({ ...v, estimatedMinutes: Number(e.target.value) }))}
        />
        <button className="rounded bg-primary px-3 py-2 font-medium text-slate-950 sm:col-span-2" type="submit">
          {taskEditingId ? 'Update task' : 'Add task'}
        </button>
      </form>

      <div className="grid gap-2 sm:grid-cols-3">
        <select
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          value={taskPeriodFilter}
          onChange={(e) => setTaskPeriodFilter(e.target.value as 'all' | PeriodType)}
        >
          <option value="all">All period</option>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
        <select
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          value={taskStatusFilter}
          onChange={(e) => setTaskStatusFilter(e.target.value as 'all' | TaskStatus)}
        >
          <option value="all">All status</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          type="month"
          value={taskMonthFilter}
          onChange={(e) => setTaskMonthFilter(e.target.value)}
        />
        <button
          className="rounded border border-slate-600 px-3 py-2 text-sm sm:col-span-3"
          type="button"
          onClick={() => void onLoadTasks()}
        >
          Apply filters
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium">{task.title}</p>
              <p className="text-xs text-slate-400">
                {task.periodType} | {task.status} | p{task.priority}
              </p>
            </div>
            <p className="text-sm text-slate-300">{task.description || 'No description'}</p>
            <div className="mt-2 flex gap-2">
              <button
                className="rounded bg-slate-700 px-2 py-1 text-xs"
                type="button"
                onClick={() => onStartEditTask(task)}
              >
                Edit
              </button>
              <button
                className="rounded bg-rose-500/80 px-2 py-1 text-xs"
                type="button"
                onClick={() => void onDeleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
