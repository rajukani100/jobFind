package main

import (
	"jobfind/controllers"
	databse "jobfind/database"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	//database pool connection
	databse.InitDB()

	// routes
	r.GET("/jobs", controllers.GetJobsList)
	r.GET("/job/:p_id", controllers.GetJob)

	r.POST("/register", controllers.Register)
	r.POST("/login", controllers.Login)

	r.Run(":8080")
}
