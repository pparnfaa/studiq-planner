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
    <div className="space-y-4 rounded-xl border border-primary/35 bg-secondary/30 p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-primary">Tasks</h2>
      <form className="grid gap-2 sm:grid-cols-2" onSubmit={onSubmitTask}>
        <input
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground placeholder:text-foreground/45"
          placeholder="Title"
          value={taskForm.title}
          onChange={(e) => setTaskForm((v) => ({ ...v, title: e.target.value }))}
          required
        />
        <input
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground"
          type="date"
          value={taskForm.dueDate}
          onChange={(e) => setTaskForm((v) => ({ ...v, dueDate: e.target.value }))}
        />
        <input
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground placeholder:text-foreground/45 sm:col-span-2"
          placeholder="Description"
          value={taskForm.description}
          onChange={(e) => setTaskForm((v) => ({ ...v, description: e.target.value }))}
        />
        <select
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground"
          value={taskForm.periodType}
          onChange={(e) => setTaskForm((v) => ({ ...v, periodType: e.target.value as PeriodType }))}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
        <select
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground"
          value={taskForm.status}
          onChange={(e) => setTaskForm((v) => ({ ...v, status: e.target.value as TaskStatus }))}
        >
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground"
          type="number"
          min={1}
          max={3}
          value={taskForm.priority}
          onChange={(e) => setTaskForm((v) => ({ ...v, priority: Number(e.target.value) }))}
        />
        <input
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground"
          type="number"
          min={0}
          value={taskForm.estimatedMinutes}
          onChange={(e) => setTaskForm((v) => ({ ...v, estimatedMinutes: Number(e.target.value) }))}
        />
        <button className="rounded bg-primary px-3 py-2 font-medium text-background sm:col-span-2 hover:bg-primary/90" type="submit">
          {taskEditingId ? 'Update task' : 'Add task'}
        </button>
      </form>

      <div className="grid gap-2 sm:grid-cols-3">
        <select
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground"
          value={taskPeriodFilter}
          onChange={(e) => setTaskPeriodFilter(e.target.value as 'all' | PeriodType)}
        >
          <option value="all">All period</option>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
        <select
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground"
          value={taskStatusFilter}
          onChange={(e) => setTaskStatusFilter(e.target.value as 'all' | TaskStatus)}
        >
          <option value="all">All status</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground"
          type="month"
          value={taskMonthFilter}
          onChange={(e) => setTaskMonthFilter(e.target.value)}
        />
        <button
          className="rounded border border-taupe bg-muted/40 px-3 py-2 text-sm text-foreground hover:bg-muted/55 sm:col-span-3"
          type="button"
          onClick={() => void onLoadTasks()}
        >
          Apply filters
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li key={task.id} className="rounded border border-taupe/90 bg-elevated/85 p-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-medium text-foreground">{task.title}</p>
              <p className="text-xs text-primary">
                {task.periodType} | {task.status} | p{task.priority}
              </p>
            </div>
            <p className="text-sm text-foreground/85">{task.description || 'No description'}</p>
            <div className="mt-2 flex gap-2">
              <button
                className="rounded bg-muted px-2 py-1 text-xs text-foreground hover:bg-muted/90"
                type="button"
                onClick={() => onStartEditTask(task)}
              >
                Edit
              </button>
              <button
                className="rounded bg-foreground px-2 py-1 text-xs text-background hover:bg-foreground/90"
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
