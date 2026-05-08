import type { Summary } from '../types/responses'

type SummaryCardsProps = {
  summary: Summary | null
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <p className="text-sm text-slate-400">Today focus</p>
        <p className="text-2xl font-semibold">{summary?.todayFocusMinutes ?? 0}m</p>
      </article>
      <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <p className="text-sm text-slate-400">Tasks done</p>
        <p className="text-2xl font-semibold">{summary?.tasksCompleted ?? 0}</p>
      </article>
      <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <p className="text-sm text-slate-400">Total tasks</p>
        <p className="text-2xl font-semibold">{summary?.totalTasks ?? 0}</p>
      </article>
      <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <p className="text-sm text-slate-400">Active plans</p>
        <p className="text-2xl font-semibold">{summary?.activePlans ?? 0}</p>
      </article>
      <article className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
        <p className="text-sm text-slate-400">Sessions logged</p>
        <p className="text-2xl font-semibold">{summary?.focusSessionsLogged ?? 0}</p>
      </article>
    </section>
  )
}
