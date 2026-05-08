type DashboardHeaderProps = {
  onRefresh: () => void
  message: string
}

export function DashboardHeader({ onRefresh, message }: DashboardHeaderProps) {
  return (
    <header className="rounded-2xl border border-primary/25 bg-linear-to-r from-primary/25 via-secondary/40 to-taupe/30 p-6">
      <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">Studiq Study Planner MVP</p>
      <h1 className="mt-2 text-3xl font-semibold text-foreground">Single-Page Dashboard</h1>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void onRefresh()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-background hover:bg-primary/90"
        >
          Refresh
        </button>
        <span className="rounded-lg border border-primary/35 bg-secondary/50 px-3 py-2 text-sm text-foreground">{message}</span>
      </div>
    </header>
  )
}
