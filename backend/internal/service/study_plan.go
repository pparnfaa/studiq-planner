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

type StudyPlanService struct {
	repo repository.Repository
}

type CreateStudyPlanInput struct {
	Subject             string `json:"subject"`
	Goal                string `json:"goal"`
	StartDate           string `json:"startDate"`
	TargetDate          string `json:"targetDate"`
	WeeklyTargetMinutes int    `json:"weeklyTargetMinutes"`
	Note                string `json:"note"`
}

type PatchStudyPlanInput struct {
	Subject             *string `json:"subject"`
	Goal                *string `json:"goal"`
	StartDate           *string `json:"startDate"`
	TargetDate          *string `json:"targetDate"`
	WeeklyTargetMinutes *int    `json:"weeklyTargetMinutes"`
	Note                *string `json:"note"`
}

func NewStudyPlanService(repo repository.Repository) *StudyPlanService {
	return &StudyPlanService{repo: repo}
}

func (s *StudyPlanService) List() []model.StudyPlan {
	return s.repo.ListStudyPlans()
}

func (s *StudyPlanService) Create(input CreateStudyPlanInput) (model.StudyPlan, error) {
	subject := strings.TrimSpace(input.Subject)
	goal := strings.TrimSpace(input.Goal)
	if subject == "" || goal == "" {
		return model.StudyPlan{}, fmt.Errorf("%w: subject and goal are required", apperror.ErrValidation)
	}

	startDate, err := datetime.ParseDate(input.StartDate)
	if err != nil {
		return model.StudyPlan{}, fmt.Errorf("%w: startDate must use YYYY-MM-DD format", apperror.ErrValidation)
	}
	targetDate, err := datetime.ParseDate(input.TargetDate)
	if err != nil {
		return model.StudyPlan{}, fmt.Errorf("%w: targetDate must use YYYY-MM-DD format", apperror.ErrValidation)
	}
	if targetDate.Before(startDate) {
		return model.StudyPlan{}, fmt.Errorf("%w: targetDate cannot be before startDate", apperror.ErrValidation)
	}
	if input.WeeklyTargetMinutes < 0 {
		return model.StudyPlan{}, fmt.Errorf("%w: weeklyTargetMinutes must be >= 0", apperror.ErrValidation)
	}

	now := time.Now().UTC()
	return s.repo.CreateStudyPlan(model.StudyPlan{
		Subject:             subject,
		Goal:                goal,
		StartDate:           startDate,
		TargetDate:          targetDate,
		WeeklyTargetMinutes: input.WeeklyTargetMinutes,
		Note:                strings.TrimSpace(input.Note),
		CreatedAt:           now,
		UpdatedAt:           now,
	}), nil
}

func (s *StudyPlanService) Patch(id int64, input PatchStudyPlanInput) (model.StudyPlan, error) {
	return s.repo.UpdateStudyPlan(id, func(plan model.StudyPlan) (model.StudyPlan, error) {
		if input.Subject != nil {
			subject := strings.TrimSpace(*input.Subject)
			if subject == "" {
				return model.StudyPlan{}, fmt.Errorf("%w: subject is required", apperror.ErrValidation)
			}
			plan.Subject = subject
		}
		if input.Goal != nil {
			goal := strings.TrimSpace(*input.Goal)
			if goal == "" {
				return model.StudyPlan{}, fmt.Errorf("%w: goal is required", apperror.ErrValidation)
			}
			plan.Goal = goal
		}
		if input.WeeklyTargetMinutes != nil {
			if *input.WeeklyTargetMinutes < 0 {
				return model.StudyPlan{}, fmt.Errorf("%w: weeklyTargetMinutes must be >= 0", apperror.ErrValidation)
			}
			plan.WeeklyTargetMinutes = *input.WeeklyTargetMinutes
		}
		if input.Note != nil {
			plan.Note = strings.TrimSpace(*input.Note)
		}
		if input.StartDate != nil {
			startDate, err := datetime.ParseDate(*input.StartDate)
			if err != nil {
				return model.StudyPlan{}, fmt.Errorf("%w: invalid startDate", apperror.ErrValidation)
			}
			plan.StartDate = startDate
		}
		if input.TargetDate != nil {
			targetDate, err := datetime.ParseDate(*input.TargetDate)
			if err != nil {
				return model.StudyPlan{}, fmt.Errorf("%w: invalid targetDate", apperror.ErrValidation)
			}
			plan.TargetDate = targetDate
		}
		if plan.TargetDate.Before(plan.StartDate) {
			return model.StudyPlan{}, fmt.Errorf("%w: targetDate cannot be before startDate", apperror.ErrValidation)
		}
		plan.UpdatedAt = time.Now().UTC()
		return plan, nil
	})
}

func (s *StudyPlanService) Delete(id int64) error {
	return s.repo.DeleteStudyPlan(id)
}
