package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"studiq-backend/internal/httpresponse"
	"studiq-backend/internal/service"
)

type DashboardHandler struct {
	service *service.DashboardService
}

func NewDashboardHandler(service *service.DashboardService) *DashboardHandler {
	return &DashboardHandler{service: service}
}

func (h *DashboardHandler) Summary(c *gin.Context) {
	httpresponse.Data(c, http.StatusOK, h.service.Summary())
}
