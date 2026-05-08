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
    <div className="space-y-4 rounded-xl border border-secondary/55 bg-primary/10 p-4 shadow-sm">
      <h2 className="text-xl font-semibold text-primary">Study Plans</h2>
      <form className="grid gap-2 sm:grid-cols-2" onSubmit={onSubmitPlan}>
        <input
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground placeholder:text-foreground/45"
          placeholder="Subject"
          value={planForm.subject}
          onChange={(e) => setPlanForm((v) => ({ ...v, subject: e.target.value }))}
          required
        />
        <input
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground placeholder:text-foreground/45"
          placeholder="Goal"
          value={planForm.goal}
          onChange={(e) => setPlanForm((v) => ({ ...v, goal: e.target.value }))}
          required
        />
        <input
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground"
          type="date"
          value={planForm.startDate}
          onChange={(e) => setPlanForm((v) => ({ ...v, startDate: e.target.value }))}
          required
        />
        <input
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground"
          type="date"
          value={planForm.targetDate}
          onChange={(e) => setPlanForm((v) => ({ ...v, targetDate: e.target.value }))}
          required
        />
        <input
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground"
          type="number"
          min={0}
          value={planForm.weeklyTargetMinutes}
          onChange={(e) => setPlanForm((v) => ({ ...v, weeklyTargetMinutes: Number(e.target.value) }))}
        />
        <input
          className="rounded border border-taupe bg-elevated px-3 py-2 text-foreground placeholder:text-foreground/45"
          placeholder="Note"
          value={planForm.note}
          onChange={(e) => setPlanForm((v) => ({ ...v, note: e.target.value }))}
        />
        <button className="rounded bg-accent px-3 py-2 font-medium text-foreground hover:bg-accent/90 sm:col-span-2" type="submit">
          {planEditingId ? 'Update plan' : 'Add plan'}
        </button>
      </form>
      <ul className="space-y-2">
        {studyPlans.map((plan) => (
          <li key={plan.id} className="rounded border border-taupe/90 bg-elevated/85 p-3 shadow-sm">
            <p className="font-medium text-foreground">{plan.subject}</p>
            <p className="text-sm text-foreground/85">{plan.goal}</p>
            <p className="text-xs text-primary">Target {plan.weeklyTargetMinutes} min/week</p>
            <div className="mt-2 flex gap-2">
              <button
                className="rounded bg-muted px-2 py-1 text-xs text-foreground hover:bg-muted/90"
                type="button"
                onClick={() => onStartEditPlan(plan)}
              >
                Edit
              </button>
              <button
                className="rounded bg-foreground px-2 py-1 text-xs text-background hover:bg-foreground/90"
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
