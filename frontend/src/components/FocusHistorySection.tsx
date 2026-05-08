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
    <div className="space-y-3 rounded-xl border border-primary/30 bg-muted/40 p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-primary">Focus History</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground"
          type="date"
          value={focusStartDateFilter}
          onChange={(e) => setFocusStartDateFilter(e.target.value)}
        />
        <input
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground"
          type="date"
          value={focusEndDateFilter}
          onChange={(e) => setFocusEndDateFilter(e.target.value)}
        />
        <button
          className="rounded border border-taupe bg-secondary/40 px-3 py-2 text-sm text-foreground hover:bg-secondary/55 sm:col-span-2"
          type="button"
          onClick={() => void onLoadFocusSessions()}
        >
          Apply range
        </button>
      </div>
      <ul className="max-h-72 space-y-2 overflow-auto pr-1">
        {focusSessions.map((session) => (
          <li key={session.id} className="rounded border border-taupe/90 bg-elevated/85 p-3 text-sm shadow-sm">
            <p className="font-medium text-foreground">
              {session.subject || 'General session'} ({session.mode})
            </p>
            <p className="text-foreground/85">{session.durationMinutes} minutes</p>
            <p className="text-xs text-primary">{new Date(session.startTime).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
