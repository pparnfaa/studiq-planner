package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"

	"studiq-backend/internal/apperror"
	"studiq-backend/internal/httpresponse"
	"studiq-backend/internal/model"
	"studiq-backend/internal/service"
)

type TaskHandler struct {
	service *service.TaskService
}

func NewTaskHandler(service *service.TaskService) *TaskHandler {
	return &TaskHandler{service: service}
}

func (h *TaskHandler) List(c *gin.Context) {
	tasks, err := h.service.List(model.TaskFilter{
		PeriodType: c.Query("periodType"),
		Status:     c.Query("status"),
		Month:      c.Query("month"),
	})
	if err != nil {
		httpresponse.Error(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error(), nil)
		return
	}
	httpresponse.Data(c, http.StatusOK, tasks)
}

func (h *TaskHandler) Create(c *gin.Context) {
	var input service.CreateTaskInput
	if err := c.ShouldBindJSON(&input); err != nil {
		httpresponse.Error(c, http.StatusBadRequest, "INVALID_JSON", "request body is not valid JSON", nil)
		return
	}

	task, err := h.service.Create(input)
	if err != nil {
		httpresponse.Error(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error(), nil)
		return
	}
	httpresponse.Data(c, http.StatusCreated, task)
}

func (h *TaskHandler) Patch(c *gin.Context) {
	id, err := parseID(c)
	if err != nil {
		httpresponse.Error(c, http.StatusBadRequest, "INVALID_ID", "id must be a positive integer", nil)
		return
	}

	var input service.PatchTaskInput
	if err := c.ShouldBindJSON(&input); err != nil {
		httpresponse.Error(c, http.StatusBadRequest, "INVALID_JSON", "request body is not valid JSON", nil)
		return
	}

	task, err := h.service.Patch(id, input)
	if err != nil {
		if errors.Is(err, apperror.ErrNotFound) {
			httpresponse.Error(c, http.StatusNotFound, "NOT_FOUND", "task not found", nil)
			return
		}
		httpresponse.Error(c, http.StatusBadRequest, "VALIDATION_ERROR", err.Error(), nil)
		return
	}
	httpresponse.Data(c, http.StatusOK, task)
}

func (h *TaskHandler) Delete(c *gin.Context) {
	id, err := parseID(c)
	if err != nil {
		httpresponse.Error(c, http.StatusBadRequest, "INVALID_ID", "id must be a positive integer", nil)
		return
	}

	if err := h.service.Delete(id); err != nil {
		httpresponse.Error(c, http.StatusNotFound, "NOT_FOUND", "task not found", nil)
		return
	}
	httpresponse.Data(c, http.StatusOK, gin.H{"deleted": true})
}
