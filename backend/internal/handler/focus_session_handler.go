package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"studiq-backend/internal/httpresponse"
	"studiq-backend/internal/model"
	"studiq-backend/internal/service"
)

type FocusSessionHandler struct {
	service *service.FocusSessionService
}

func NewFocusSessionHandler(service *service.FocusSessionService) *FocusSessionHandler {
	return &FocusSessionHandler{service: service}
}

func (h *FocusSessionHandler) List(c *gin.Context) {
	sessions, err := h.service.List(model.FocusFilter{
		StartDate: c.Query("startDate"),
		EndDate:   c.Query("endDate"),
	})
	if err != nil {
		httpresponse.Error(c, http.StatusBadRequest, "VALIDATION_ERROR", "startDate/endDate must use YYYY-MM-DD format", nil)
		return
	}
	httpresponse.Data(c, http.StatusOK, sessions)
}

func (h *FocusSessionHandler) Create(c *gin.Context) {
	var input service.CreateFocusSessionInput
	if err := c.ShouldBindJSON(&input); err != nil {
		httpresponse.Error(c, http.StatusBadRequest, "INVALID_JSON", "request body is not valid JSON", nil)
		return
	}

	session, err := h.service.Create(input)
	if err != nil {
		httpresponse.Error(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error(), nil)
		return
	}
	httpresponse.Data(c, http.StatusCreated, session)
}
