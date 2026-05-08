package service

import (
	"fmt"
	"strings"
	"time"

	"studiq-backend/internal/apperror"
	"studiq-backend/internal/datetime"
	"studiq-backend/internal/model"
	"studiq-backend/internal/repository"
)

type TaskService struct {
	repo repository.Repository
}

type CreateTaskInput struct {
	Title            string  `json:"title"`
	Description      string  `json:"description"`
	DueDate          *string `json:"dueDate"`
	PeriodType       string  `json:"periodType"`
	Priority         int     `json:"priority"`
	Status           string  `json:"status"`
	EstimatedMinutes int     `json:"estimatedMinutes"`
}

type PatchTaskInput struct {
	Title            *string `json:"title"`
	Description      *string `json:"description"`
	DueDate          *string `json:"dueDate"`
	PeriodType       *string `json:"periodType"`
	Priority         *int    `json:"priority"`
	Status           *string `json:"status"`
	EstimatedMinutes *int    `json:"estimatedMinutes"`
}

func NewTaskService(repo repository.Repository) *TaskService {
	return &TaskService{repo: repo}
}

func (s *TaskService) List(filter model.TaskFilter) ([]model.Task, error) {
	if filter.PeriodType != "" && !model.IsPeriodType(filter.PeriodType) {
		return nil, fmt.Errorf("%w: periodType must be daily or monthly", apperror.ErrValidation)
	}
	if filter.Status != "" && !model.IsTaskStatus(filter.Status) {
		return nil, fmt.Errorf("%w: status must be todo, in_progress, or done", apperror.ErrValidation)
	}
	if filter.Month != "" {
		if _, err := time.Parse("2006-01", filter.Month); err != nil {
			return nil, fmt.Errorf("%w: month must use YYYY-MM format", apperror.ErrValidation)
		}
	}
	return s.repo.ListTasks(filter)
}

func (s *TaskService) Create(input CreateTaskInput) (model.Task, error) {
	title := strings.TrimSpace(input.Title)
	if title == "" {
		return model.Task{}, fmt.Errorf("%w: title is required", apperror.ErrValidation)
	}
	if !model.IsPeriodType(input.PeriodType) {
		return model.Task{}, fmt.Errorf("%w: periodType must be daily or monthly", apperror.ErrValidation)
	}
	if !model.IsTaskStatus(input.Status) {
		return model.Task{}, fmt.Errorf("%w: status must be todo, in_progress, or done", apperror.ErrValidation)
	}
	if input.Priority < 1 || input.Priority > 3 {
		return model.Task{}, fmt.Errorf("%w: priority must be between 1 and 3", apperror.ErrValidation)
	}
	if input.EstimatedMinutes < 0 {
		return model.Task{}, fmt.Errorf("%w: estimatedMinutes must be >= 0", apperror.ErrValidation)
	}

	var dueDate *time.Time
	if input.DueDate != nil && *input.DueDate != "" {
		parsed, err := datetime.ParseDate(*input.DueDate)
		if err != nil {
			return model.Task{}, fmt.Errorf("%w: dueDate must use YYYY-MM-DD format", apperror.ErrValidation)
		}
		dueDate = &parsed
	}

	now := time.Now().UTC()
	return s.repo.CreateTask(model.Task{
		Title:            title,
		Description:      strings.TrimSpace(input.Description),
		DueDate:          dueDate,
		PeriodType:       model.PeriodType(input.PeriodType),
		Priority:         input.Priority,
		Status:           model.TaskStatus(input.Status),
		EstimatedMinutes: input.EstimatedMinutes,
		CreatedAt:        now,
		UpdatedAt:        now,
	}), nil
}

func (s *TaskService) Patch(id int64, input PatchTaskInput) (model.Task, error) {
	return s.repo.UpdateTask(id, func(task model.Task) (model.Task, error) {
		if input.Title != nil {
			title := strings.TrimSpace(*input.Title)
			if title == "" {
				return model.Task{}, fmt.Errorf("%w: title is required", apperror.ErrValidation)
			}
			task.Title = title
		}
		if input.Description != nil {
			task.Description = strings.TrimSpace(*input.Description)
		}
		if input.PeriodType != nil {
			if !model.IsPeriodType(*input.PeriodType) {
				return model.Task{}, fmt.Errorf("%w: invalid periodType", apperror.ErrValidation)
			}
			task.PeriodType = model.PeriodType(*input.PeriodType)
		}
		if input.Status != nil {
			if !model.IsTaskStatus(*input.Status) {
				return model.Task{}, fmt.Errorf("%w: invalid status", apperror.ErrValidation)
			}
			task.Status = model.TaskStatus(*input.Status)
		}
		if input.Priority != nil {
			if *input.Priority < 1 || *input.Priority > 3 {
				return model.Task{}, fmt.Errorf("%w: invalid priority", apperror.ErrValidation)
			}
			task.Priority = *input.Priority
		}
		if input.EstimatedMinutes != nil {
			if *input.EstimatedMinutes < 0 {
				return model.Task{}, fmt.Errorf("%w: invalid estimatedMinutes", apperror.ErrValidation)
			}
			task.EstimatedMinutes = *input.EstimatedMinutes
		}
		if input.DueDate != nil {
			if *input.DueDate == "" {
				task.DueDate = nil
			} else {
				parsed, err := datetime.ParseDate(*input.DueDate)
				if err != nil {
					return model.Task{}, fmt.Errorf("%w: invalid dueDate", apperror.ErrValidation)
				}
				task.DueDate = &parsed
			}
		}
		task.UpdatedAt = time.Now().UTC()
		return task, nil
	})
}

func (s *TaskService) Delete(id int64) error {
	return s.repo.DeleteTask(id)
}
