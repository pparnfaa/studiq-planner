package repository

import "studiq-backend/internal/model"

type TaskUpdater func(model.Task) (model.Task, error)
type StudyPlanUpdater func(model.StudyPlan) (model.StudyPlan, error)

type Repository interface {
	ListTasks(filter model.TaskFilter) ([]model.Task, error)
	CreateTask(task model.Task) model.Task
	UpdateTask(id int64, updater TaskUpdater) (model.Task, error)
	DeleteTask(id int64) error

	ListStudyPlans() []model.StudyPlan
	CreateStudyPlan(plan model.StudyPlan) model.StudyPlan
	UpdateStudyPlan(id int64, updater StudyPlanUpdater) (model.StudyPlan, error)
	DeleteStudyPlan(id int64) error

	ListFocusSessions(filter model.FocusFilter) ([]model.FocusSession, error)
	CreateFocusSession(session model.FocusSession) model.FocusSession
	Summary() model.DashboardSummary
}
