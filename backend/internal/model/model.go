package model

import "time"

type TaskStatus string
type PeriodType string
type FocusMode string

const (
	TaskStatusTodo       TaskStatus = "todo"
	TaskStatusInProgress TaskStatus = "in_progress"
	TaskStatusDone       TaskStatus = "done"

	PeriodTypeDaily   PeriodType = "daily"
	PeriodTypeMonthly PeriodType = "monthly"

	FocusModeFocus FocusMode = "focus"
	FocusModeBreak FocusMode = "break"
)

type Task struct {
	ID               int64      `json:"id"`
	Title            string     `json:"title"`
	Description      string     `json:"description,omitempty"`
	DueDate          *time.Time `json:"dueDate,omitempty"`
	PeriodType       PeriodType `json:"periodType"`
	Priority         int        `json:"priority"`
	Status           TaskStatus `json:"status"`
	EstimatedMinutes int        `json:"estimatedMinutes"`
	CreatedAt        time.Time  `json:"createdAt"`
	UpdatedAt        time.Time  `json:"updatedAt"`
}

type StudyPlan struct {
	ID                  int64     `json:"id"`
	Subject             string    `json:"subject"`
	Goal                string    `json:"goal"`
	StartDate           time.Time `json:"startDate"`
	TargetDate          time.Time `json:"targetDate"`
	WeeklyTargetMinutes int       `json:"weeklyTargetMinutes"`
	Note                string    `json:"note,omitempty"`
	CreatedAt           time.Time `json:"createdAt"`
	UpdatedAt           time.Time `json:"updatedAt"`
}

type FocusSession struct {
	ID              int64     `json:"id"`
	TaskID          *int64    `json:"taskId,omitempty"`
	Subject         string    `json:"subject,omitempty"`
	Mode            FocusMode `json:"mode"`
	StartTime       time.Time `json:"startTime"`
	EndTime         time.Time `json:"endTime"`
	DurationMinutes int       `json:"durationMinutes"`
	CreatedAt       time.Time `json:"createdAt"`
}

type TaskFilter struct {
	PeriodType string
	Status     string
	Month      string
}

type FocusFilter struct {
	StartDate string
	EndDate   string
}

type DashboardSummary struct {
	TodayFocusMinutes   int `json:"todayFocusMinutes"`
	TasksCompleted      int `json:"tasksCompleted"`
	ActivePlans         int `json:"activePlans"`
	TotalTasks          int `json:"totalTasks"`
	FocusSessionsLogged int `json:"focusSessionsLogged"`
}

func IsTaskStatus(value string) bool {
	return value == string(TaskStatusTodo) || value == string(TaskStatusInProgress) || value == string(TaskStatusDone)
}

func IsPeriodType(value string) bool {
	return value == string(PeriodTypeDaily) || value == string(PeriodTypeMonthly)
}

func IsFocusMode(value string) bool {
	return value == string(FocusModeFocus) || value == string(FocusModeBreak)
}
