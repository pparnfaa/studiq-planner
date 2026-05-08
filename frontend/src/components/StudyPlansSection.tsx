import type { Dispatch, FormEvent, SetStateAction } from 'react'
import type { PlanFormState } from '../types/forms'
import type { StudyPlan } from '../types/responses'

type StudyPlansSectionProps = {
  planForm: PlanFormState
  setPlanForm: Dispatch<SetStateAction<PlanFormState>>
  planEditingId: number | null
  studyPlans: StudyPlan[]
  onSubmitPlan: (event: FormEvent<HTMLFormElement>) => void
  onDeletePlan: (id: number) => void
  onStartEditPlan: (plan: StudyPlan) => void
}

export function StudyPlansSection({
  planForm,
  setPlanForm,
  planEditingId,
  studyPlans,
  onSubmitPlan,
  onDeletePlan,
  onStartEditPlan,
}: StudyPlansSectionProps) {
  return (
    <div className="space-y-4 rounded-xl border border-blue-500/20 bg-slate-900/70 p-4">
      <h2 className="text-xl font-semibold text-blue-300">Study Plans</h2>
      <form className="grid gap-2 sm:grid-cols-2" onSubmit={onSubmitPlan}>
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Subject"
          value={planForm.subject}
          onChange={(e) => setPlanForm((v) => ({ ...v, subject: e.target.value }))}
          required
        />
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Goal"
          value={planForm.goal}
          onChange={(e) => setPlanForm((v) => ({ ...v, goal: e.target.value }))}
          required
        />
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          type="date"
          value={planForm.startDate}
          onChange={(e) => setPlanForm((v) => ({ ...v, startDate: e.target.value }))}
          required
        />
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          type="date"
          value={planForm.targetDate}
          onChange={(e) => setPlanForm((v) => ({ ...v, targetDate: e.target.value }))}
          required
        />
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          type="number"
          min={0}
          value={planForm.weeklyTargetMinutes}
          onChange={(e) => setPlanForm((v) => ({ ...v, weeklyTargetMinutes: Number(e.target.value) }))}
        />
        <input
          className="rounded border border-slate-700 bg-slate-950 px-3 py-2"
          placeholder="Note"
          value={planForm.note}
          onChange={(e) => setPlanForm((v) => ({ ...v, note: e.target.value }))}
        />
        <button className="rounded bg-blue-500 px-3 py-2 font-medium text-slate-950 sm:col-span-2" type="submit">
          {planEditingId ? 'Update plan' : 'Add plan'}
        </button>
      </form>
      <ul className="space-y-2">
        {studyPlans.map((plan) => (
          <li key={plan.id} className="rounded border border-slate-800 bg-slate-950/60 p-3">
            <p className="font-medium">{plan.subject}</p>
            <p className="text-sm text-slate-300">{plan.goal}</p>
            <p className="text-xs text-slate-400">Target {plan.weeklyTargetMinutes} min/week</p>
            <div className="mt-2 flex gap-2">
              <button
                className="rounded bg-slate-700 px-2 py-1 text-xs"
                type="button"
                onClick={() => onStartEditPlan(plan)}
              >
                Edit
              </button>
              <button
                className="rounded bg-rose-500/80 px-2 py-1 text-xs"
                type="button"
                onClick={() => void onDeletePlan(plan.id)}
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
