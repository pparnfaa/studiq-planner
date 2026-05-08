package service

import (
	"studiq-backend/internal/model"
	"studiq-backend/internal/repository"
)

type DashboardService struct {
	repo repository.Repository
}

func NewDashboardService(repo repository.Repository) *DashboardService {
	return &DashboardService{repo: repo}
}

func (s *DashboardService) Summary() model.DashboardSummary {
	return s.repo.Summary()
}
