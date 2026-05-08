import type { Dispatch, SetStateAction } from 'react'
import type { FocusMode } from '../types/responses'
import { formatTimer } from '../utils/formatTimer'

type FocusTimerSectionProps = {
  timerSeconds: number
  timerSubject: string
  setTimerSubject: Dispatch<SetStateAction<string>>
  timerTaskId: string
  setTimerTaskId: Dispatch<SetStateAction<string>>
  timerMode: FocusMode
  setTimerMode: Dispatch<SetStateAction<FocusMode>>
  onStartTimer: () => void
  onPauseTimer: () => void
  onResetTimer: () => void
  onEndSession: () => void
}

export function FocusTimerSection({
  timerSeconds,
  timerSubject,
  setTimerSubject,
  timerTaskId,
  setTimerTaskId,
  timerMode,
  setTimerMode,
  onStartTimer,
  onPauseTimer,
  onResetTimer,
  onEndSession,
}: FocusTimerSectionProps) {
  return (
    <div className="space-y-3 rounded-xl border border-violet-500/20 bg-slate-900/70 p-4">
      <h2 className="text-xl font-semibold text-violet-300">Focus Timer</h2>
      <p className="text-5xl font-bold">{formatTimer(timerSeconds)}</p>
      <div className="grid gap-2 sm:grid-cols-3">
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2 sm:col-span-2"
          placeholder="Subject"
          value={timerSubject}
          onChange={(e) => setTimerSubject(e.target.value)}
        />
        <select
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          value={timerMode}
          onChange={(e) => setTimerMode(e.target.value as FocusMode)}
        >
          <option value="focus">Focus</option>
          <option value="break">Break</option>
        </select>
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2 sm:col-span-3"
          type="number"
          min={0}
          placeholder="Optional task ID"
          value={timerTaskId}
          onChange={(e) => setTimerTaskId(e.target.value)}
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded bg-violet-500 px-3 py-2 text-sm font-medium text-slate-950"
          type="button"
          onClick={onStartTimer}
        >
          Start
        </button>
        <button className="rounded bg-slate-700 px-3 py-2 text-sm" type="button" onClick={onPauseTimer}>
          Pause
        </button>
        <button className="rounded bg-slate-700 px-3 py-2 text-sm" type="button" onClick={onResetTimer}>
          Reset
        </button>
        <button
          className="rounded bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950"
          type="button"
          onClick={() => void onEndSession()}
        >
          End & save
        </button>
      </div>
    </div>
  )
}
