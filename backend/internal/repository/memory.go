package repository

import (
	"sync"
	"time"

	"studiq-backend/internal/apperror"
	"studiq-backend/internal/datetime"
	"studiq-backend/internal/model"
)

type MemoryRepository struct {
	mu sync.RWMutex

	nextTaskID         int64
	nextStudyPlanID    int64
	nextFocusSessionID int64

	tasks         map[int64]model.Task
	studyPlans    map[int64]model.StudyPlan
	focusSessions map[int64]model.FocusSession
}

func NewMemoryRepository() *MemoryRepository {
	return &MemoryRepository{
		nextTaskID:         1,
		nextStudyPlanID:    1,
		nextFocusSessionID: 1,
		tasks:              make(map[int64]model.Task),
		studyPlans:         make(map[int64]model.StudyPlan),
		focusSessions:      make(map[int64]model.FocusSession),
	}
}

func (r *MemoryRepository) ListTasks(filter model.TaskFilter) ([]model.Task, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var tasks []model.Task
	for _, task := range r.tasks {
		if filter.PeriodType != "" && string(task.PeriodType) != filter.PeriodType {
			continue
		}
		if filter.Status != "" && string(task.Status) != filter.Status {
			continue
		}
		if filter.Month != "" {
			if task.DueDate == nil || task.DueDate.UTC().Format("2006-01") != filter.Month {
				continue
			}
		}
		tasks = append(tasks, task)
	}
	return tasks, nil
}

func (r *MemoryRepository) CreateTask(task model.Task) model.Task {
	r.mu.Lock()
	defer r.mu.Unlock()

	task.ID = r.nextTaskID
	r.nextTaskID++
	r.tasks[task.ID] = task
	return task
}

func (r *MemoryRepository) UpdateTask(id int64, updater TaskUpdater) (model.Task, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	task, ok := r.tasks[id]
	if !ok {
		return model.Task{}, apperror.ErrNotFound
	}
	updated, err := updater(task)
	if err != nil {
		return model.Task{}, err
	}
	r.tasks[id] = updated
	return updated, nil
}

func (r *MemoryRepository) DeleteTask(id int64) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.tasks[id]; !ok {
		return apperror.ErrNotFound
	}
	delete(r.tasks, id)
	return nil
}

func (r *MemoryRepository) ListStudyPlans() []model.StudyPlan {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var plans []model.StudyPlan
	for _, plan := range r.studyPlans {
		plans = append(plans, plan)
	}
	return plans
}

func (r *MemoryRepository) CreateStudyPlan(plan model.StudyPlan) model.StudyPlan {
	r.mu.Lock()
	defer r.mu.Unlock()

	plan.ID = r.nextStudyPlanID
	r.nextStudyPlanID++
	r.studyPlans[plan.ID] = plan
	return plan
}

func (r *MemoryRepository) UpdateStudyPlan(id int64, updater StudyPlanUpdater) (model.StudyPlan, error) {
	r.mu.Lock()
	defer r.mu.Unlock()

	plan, ok := r.studyPlans[id]
	if !ok {
		return model.StudyPlan{}, apperror.ErrNotFound
	}
	updated, err := updater(plan)
	if err != nil {
		return model.StudyPlan{}, err
	}
	r.studyPlans[id] = updated
	return updated, nil
}

func (r *MemoryRepository) DeleteStudyPlan(id int64) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if _, ok := r.studyPlans[id]; !ok {
		return apperror.ErrNotFound
	}
	delete(r.studyPlans, id)
	return nil
}

func (r *MemoryRepository) ListFocusSessions(filter model.FocusFilter) ([]model.FocusSession, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	var start *time.Time
	var end *time.Time
	if filter.StartDate != "" {
		s, err := datetime.ParseDate(filter.StartDate)
		if err != nil {
			return nil, err
		}
		start = &s
	}
	if filter.EndDate != "" {
		e, err := datetime.ParseDate(filter.EndDate)
		if err != nil {
			return nil, err
		}
		end = &e
	}

	var sessions []model.FocusSession
	for _, session := range r.focusSessions {
		sessionDate := session.StartTime.UTC()
		if start != nil && sessionDate.Before(*start) {
			continue
		}
		if end != nil && sessionDate.After(end.Add(24*time.Hour-time.Nanosecond)) {
			continue
		}
		sessions = append(sessions, session)
	}
	return sessions, nil
}

func (r *MemoryRepository) CreateFocusSession(session model.FocusSession) model.FocusSession {
	r.mu.Lock()
	defer r.mu.Unlock()

	session.ID = r.nextFocusSessionID
	r.nextFocusSessionID++
	r.focusSessions[session.ID] = session
	return session
}

func (r *MemoryRepository) Summary() model.DashboardSummary {
	r.mu.RLock()
	defer r.mu.RUnlock()

	now := time.Now().UTC()
	todayStart := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.UTC)
	todayEnd := todayStart.Add(24*time.Hour - time.Nanosecond)

	var todayMinutes int
	for _, session := range r.focusSessions {
		if session.Mode == model.FocusModeFocus && !session.StartTime.Before(todayStart) && !session.StartTime.After(todayEnd) {
			todayMinutes += session.DurationMinutes
		}
	}

	var completed int
	for _, task := range r.tasks {
		if task.Status == model.TaskStatusDone {
			completed++
		}
	}

	var activePlans int
	for _, plan := range r.studyPlans {
		if !plan.TargetDate.Before(todayStart) {
			activePlans++
		}
	}

	return model.DashboardSummary{
		TodayFocusMinutes:   todayMinutes,
		TasksCompleted:      completed,
		ActivePlans:         activePlans,
		TotalTasks:          len(r.tasks),
		FocusSessionsLogged: len(r.focusSessions),
	}
}
