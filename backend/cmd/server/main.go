package main

import (
	"os"

	"studiq-backend/internal/repository"
	"studiq-backend/internal/server"
)

func main() {
	port := os.Getenv("APP_PORT")
	if port == "" {
		port = "8080"
	}

	corsOrigin := os.Getenv("CORS_ORIGINS")
	if corsOrigin == "" {
		corsOrigin = "http://localhost:5173"
	}

	repo := repository.NewMemoryRepository()
	router := server.NewRouter(server.Config{CORSOrigin: corsOrigin}, repo)

	_ = router.Run(":" + port)
}
