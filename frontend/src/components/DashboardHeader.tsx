type DashboardHeaderProps = {
  onRefresh: () => void
  message: string
}

export function DashboardHeader({ onRefresh, message }: DashboardHeaderProps) {
  return (
    <header className="rounded-2xl border border-white/10 bg-linear-to-r from-cyan-500/20 via-indigo-500/20 to-violet-500/20 p-6">
      <p className="text-xs font-semibold tracking-[0.2em] text-cyan-200 uppercase">Studiq Study Planner MVP</p>
      <h1 className="mt-2 text-3xl font-semibold text-white">Single-Page Dashboard</h1>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void onRefresh()}
          className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-cyan-100"
        >
          Refresh
        </button>
        <span className="rounded-lg border border-cyan-400/30 bg-cyan-950/40 px-3 py-2 text-sm text-cyan-100">{message}</span>
      </div>
    </header>
  )
}
