import type { Dispatch, SetStateAction } from 'react'
import type { FocusSession } from '../types/responses'

type FocusHistorySectionProps = {
  focusSessions: FocusSession[]
  focusStartDateFilter: string
  setFocusStartDateFilter: Dispatch<SetStateAction<string>>
  focusEndDateFilter: string
  setFocusEndDateFilter: Dispatch<SetStateAction<string>>
  onLoadFocusSessions: () => void
}

export function FocusHistorySection({
  focusSessions,
  focusStartDateFilter,
  setFocusStartDateFilter,
  focusEndDateFilter,
  setFocusEndDateFilter,
  onLoadFocusSessions,
}: FocusHistorySectionProps) {
  return (
    <div className="space-y-3 rounded-xl border border-emerald-500/20 bg-slate-900/70 p-4">
      <h2 className="text-xl font-semibold text-emerald-300">Focus History</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          type="date"
          value={focusStartDateFilter}
          onChange={(e) => setFocusStartDateFilter(e.target.value)}
        />
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          type="date"
          value={focusEndDateFilter}
          onChange={(e) => setFocusEndDateFilter(e.target.value)}
        />
        <button
          className="rounded border border-slate-600 px-3 py-2 text-sm sm:col-span-2"
          type="button"
          onClick={() => void onLoadFocusSessions()}
        >
          Apply range
        </button>
      </div>
      <ul className="max-h-72 space-y-2 overflow-auto pr-1">
        {focusSessions.map((session) => (
          <li key={session.id} className="rounded border border-slate-800 bg-slate-950/60 p-3 text-sm">
            <p className="font-medium">
              {session.subject || 'General session'} ({session.mode})
            </p>
            <p className="text-slate-300">{session.durationMinutes} minutes</p>
            <p className="text-xs text-slate-400">{new Date(session.startTime).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
