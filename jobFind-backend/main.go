package main

import (
	"jobfind/controllers"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	// routes
	r.GET("/jobs", controllers.GetJobsList)
	r.GET("/job/:p_id", controllers.GetJob)

	r.Run(":8080")
}
