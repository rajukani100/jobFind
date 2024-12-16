package main

import (
	"jobfind/controllers"
	databse "jobfind/database"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.New()
	r.Use(gin.Logger())
	r.Use(gin.Recovery())

	//database pool connection
	databse.InitDB()
	defer databse.ConnPool.Close()

	// routes
	r.GET("/jobs", controllers.GetJobsList)
	r.GET("/job/:p_id", controllers.GetJob)

	r.POST("/register", controllers.Register)
	r.POST("/login", controllers.Login)

	if err := r.Run(":8080"); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}

}
