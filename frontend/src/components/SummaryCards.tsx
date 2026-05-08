import type { Summary } from '../types/responses'

type SummaryCardsProps = {
  summary: Summary | null
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <article className="rounded-xl border border-taupe/80 bg-elevated/90 p-4 shadow-sm">
        <p className="text-sm text-primary">Today focus</p>
        <p className="text-2xl font-semibold text-foreground">{summary?.todayFocusMinutes ?? 0}m</p>
      </article>
      <article className="rounded-xl border border-taupe/80 bg-elevated/90 p-4 shadow-sm">
        <p className="text-sm text-primary">Tasks done</p>
        <p className="text-2xl font-semibold text-foreground">{summary?.tasksCompleted ?? 0}</p>
      </article>
      <article className="rounded-xl border border-taupe/80 bg-elevated/90 p-4 shadow-sm">
        <p className="text-sm text-primary">Total tasks</p>
        <p className="text-2xl font-semibold text-foreground">{summary?.totalTasks ?? 0}</p>
      </article>
      <article className="rounded-xl border border-taupe/80 bg-elevated/90 p-4 shadow-sm">
        <p className="text-sm text-primary">Active plans</p>
        <p className="text-2xl font-semibold text-foreground">{summary?.activePlans ?? 0}</p>
      </article>
      <article className="rounded-xl border border-taupe/80 bg-elevated/90 p-4 shadow-sm">
        <p className="text-sm text-primary">Sessions logged</p>
        <p className="text-2xl font-semibold text-foreground">{summary?.focusSessionsLogged ?? 0}</p>
      </article>
    </section>
  )
}
