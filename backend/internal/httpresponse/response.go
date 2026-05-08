package httpresponse

import "github.com/gin-gonic/gin"

type ErrorPayload struct {
	Code    string `json:"code"`
	Message string `json:"message"`
	Details any    `json:"details,omitempty"`
}

func Data(c *gin.Context, status int, data any) {
	c.JSON(status, gin.H{"data": data})
}

func Error(c *gin.Context, status int, code string, message string, details any) {
	c.JSON(status, gin.H{"error": ErrorPayload{Code: code, Message: message, Details: details}})
}
