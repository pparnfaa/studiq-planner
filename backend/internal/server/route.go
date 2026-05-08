package server

import (
	"github.com/gin-gonic/gin"

	"studiq-backend/internal/handler"
	"studiq-backend/internal/repository"
	"studiq-backend/internal/service"
)

func registerRoutes(router *gin.Engine, repo repository.Repository) {
	router.GET("/healthz", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok", "service": "studiq-backend"})
	})

	taskHandler := handler.NewTaskHandler(service.NewTaskService(repo))
	studyPlanHandler := handler.NewStudyPlanHandler(service.NewStudyPlanService(repo))
	focusSessionHandler := handler.NewFocusSessionHandler(service.NewFocusSessionService(repo))
	dashboardHandler := handler.NewDashboardHandler(service.NewDashboardService(repo))

	v1 := router.Group("/api/v1")
	{
		v1.GET("/tasks", taskHandler.List)
		v1.POST("/tasks", taskHandler.Create)
		v1.PATCH("/tasks/:id", taskHandler.Patch)
		v1.DELETE("/tasks/:id", taskHandler.Delete)

		v1.GET("/study-plans", studyPlanHandler.List)
		v1.POST("/study-plans", studyPlanHandler.Create)
		v1.PATCH("/study-plans/:id", studyPlanHandler.Patch)
		v1.DELETE("/study-plans/:id", studyPlanHandler.Delete)

		v1.GET("/focus-sessions", focusSessionHandler.List)
		v1.POST("/focus-sessions", focusSessionHandler.Create)

		v1.GET("/dashboard/summary", dashboardHandler.Summary)
	}
}
