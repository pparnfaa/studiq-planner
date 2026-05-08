package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"studiq-backend/internal/apperror"
	"studiq-backend/internal/httpresponse"
	"studiq-backend/internal/service"
)

type StudyPlanHandler struct {
	service *service.StudyPlanService
}

func NewStudyPlanHandler(service *service.StudyPlanService) *StudyPlanHandler {
	return &StudyPlanHandler{service: service}
}

func (h *StudyPlanHandler) List(c *gin.Context) {
	httpresponse.Data(c, http.StatusOK, h.service.List())
}

func (h *StudyPlanHandler) Create(c *gin.Context) {
	var input service.CreateStudyPlanInput
	if err := c.ShouldBindJSON(&input); err != nil {
		httpresponse.Error(c, http.StatusBadRequest, "INVALID_JSON", "request body is not valid JSON", nil)
		return
	}

	plan, err := h.service.Create(input)
	if err != nil {
		httpresponse.Error(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error(), nil)
		return
	}
	httpresponse.Data(c, http.StatusCreated, plan)
}

func (h *StudyPlanHandler) Patch(c *gin.Context) {
	id, err := parseID(c)
	if err != nil {
		httpresponse.Error(c, http.StatusBadRequest, "INVALID_ID", "id must be a positive integer", nil)
		return
	}

	var input service.PatchStudyPlanInput
	if err := c.ShouldBindJSON(&input); err != nil {
		httpresponse.Error(c, http.StatusBadRequest, "INVALID_JSON", "request body is not valid JSON", nil)
		return
	}

	plan, err := h.service.Patch(id, input)
	if err != nil {
		if errors.Is(err, apperror.ErrNotFound) {
			httpresponse.Error(c, http.StatusNotFound, "NOT_FOUND", "study plan not found", nil)
			return
		}
		httpresponse.Error(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error(), nil)
		return
	}
	httpresponse.Data(c, http.StatusOK, plan)
}

func (h *StudyPlanHandler) Delete(c *gin.Context) {
	id, err := parseID(c)
	if err != nil {
		httpresponse.Error(c, http.StatusBadRequest, "INVALID_ID", "id must be a positive integer", nil)
		return
	}

	if err := h.service.Delete(id); err != nil {
		httpresponse.Error(c, http.StatusNotFound, "NOT_FOUND", "study plan not found", nil)
		return
	}
	httpresponse.Data(c, http.StatusOK, gin.H{"deleted": true})
}
