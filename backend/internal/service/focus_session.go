package service

import (
	"fmt"
	"strings"
	"time"

	"studiq-backend/internal/apperror"
	"studiq-backend/internal/model"
	"studiq-backend/internal/repository"
)

type FocusSessionService struct {
	repo repository.Repository
}

type CreateFocusSessionInput struct {
	TaskID          *int64 `json:"taskId"`
	Subject         string `json:"subject"`
	Mode            string `json:"mode"`
	StartTime       string `json:"startTime"`
	EndTime         string `json:"endTime"`
	DurationMinutes *int   `json:"durationMinutes"`
}

func NewFocusSessionService(repo repository.Repository) *FocusSessionService {
	return &FocusSessionService{repo: repo}
}

func (s *FocusSessionService) List(filter model.FocusFilter) ([]model.FocusSession, error) {
	return s.repo.ListFocusSessions(filter)
}

func (s *FocusSessionService) Create(input CreateFocusSessionInput) (model.FocusSession, error) {
	if !model.IsFocusMode(input.Mode) {
		return model.FocusSession{}, fmt.Errorf("%w: mode must be focus or break", apperror.ErrValidation)
	}

	startTime, err := time.Parse(time.RFC3339, input.StartTime)
	if err != nil {
		return model.FocusSession{}, fmt.Errorf("%w: startTime must be RFC3339", apperror.ErrValidation)
	}
	endTime, err := time.Parse(time.RFC3339, input.EndTime)
	if err != nil {
		return model.FocusSession{}, fmt.Errorf("%w: endTime must be RFC3339", apperror.ErrValidation)
	}

	startTime = startTime.UTC()
	endTime = endTime.UTC()
	if endTime.Before(startTime) {
		return model.FocusSession{}, fmt.Errorf("%w: endTime cannot be before startTime", apperror.ErrValidation)
	}

	durationMinutes := int(endTime.Sub(startTime).Minutes())
	if input.DurationMinutes != nil {
		if *input.DurationMinutes < 0 {
			return model.FocusSession{}, fmt.Errorf("%w: durationMinutes must be >= 0", apperror.ErrValidation)
		}
		durationMinutes = *input.DurationMinutes
	}

	return s.repo.CreateFocusSession(model.FocusSession{
		TaskID:          input.TaskID,
		Subject:         strings.TrimSpace(input.Subject),
		Mode:            model.FocusMode(input.Mode),
		StartTime:       startTime,
		EndTime:         endTime,
		DurationMinutes: durationMinutes,
		CreatedAt:       time.Now().UTC(),
	}), nil
}
