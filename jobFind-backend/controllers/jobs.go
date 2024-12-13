package controllers

import (
	"context"
	"fmt"
	databse "jobfind/database"
	"jobfind/model"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetJobsList(c *gin.Context) {
	page_number, err := strconv.Atoi(c.DefaultQuery("page", "1"))
	if err != nil || page_number <= 0 {
		page_number = 1
	}
	//get connection
	pool, err := databse.InitDB()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer pool.Close()

	rows, err := pool.Query(context.Background(), `SELECT * FROM job_listings LIMIT 12 OFFSET $1`, (page_number-1)*12)
	if err != nil {
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		os.Exit(1)
	}

	defer rows.Close()

	var jobs [12]model.Job
	i := 0
	for rows.Next() {
		rows.Scan(&jobs[i].Company, &jobs[i].Role, &jobs[i].Description, &jobs[i].Level, &jobs[i].Posted_date, &jobs[i].Location, &jobs[i].Id, &jobs[i].Ctc)
		i++

	}
	if rows.Err() != nil {
		log.Fatalf("Error reading rows: %v\n", rows.Err())
	}

	c.JSON(http.StatusOK, jobs)
}
