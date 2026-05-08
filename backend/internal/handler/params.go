package handler

import (
	"strconv"

	"github.com/gin-gonic/gin"
)

func parseID(c *gin.Context) (int64, error) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil || id <= 0 {
		return 0, err
	}
	return id, nil
}
