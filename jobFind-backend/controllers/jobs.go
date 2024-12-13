package controllers

import (
	"context"
	"fmt"
	database "jobfind/database"
	"jobfind/model"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

func GetJobsList(c *gin.Context) {
	pageNumber, err := strconv.Atoi(c.DefaultQuery("page", "1"))

	searchQuery := c.Query("search")
	cityQuery := c.Query("city")
	levelQuery := c.Query("level")
	// typeQuery := c.Query("type")

	if err != nil || pageNumber <= 0 {
		pageNumber = 1
	}
	//get connection
	pool, err := database.InitDB()
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer pool.Close()

	var queryBuilder strings.Builder
	queryBuilder.WriteString(`SELECT company_name, role, description, level, posted_date, location, id, ctc FROM job_listings`)

	//adding where clauses
	var whereClauses []string
	paramIndex := 1

	if searchQuery != "" {
		whereClauses = append(whereClauses, fmt.Sprintf(`(role ILIKE $%d OR description ILIKE $%d)`, paramIndex, paramIndex))
		paramIndex++
	}
	if cityQuery != "" {
		whereClauses = append(whereClauses, fmt.Sprintf(`location ILIKE $%d`, paramIndex))
		paramIndex++
	}
	if levelQuery != "" {
		whereClauses = append(whereClauses, fmt.Sprintf(`level ILIKE $%d`, paramIndex))
		paramIndex++
	}
	// if typeQuery != "" {
	// 	whereClauses = append(whereClauses, fmt.Sprintf(`type = $%d`, paramIndex))
	// 	paramIndex++
	// }
	if len(whereClauses) > 0 {
		queryBuilder.WriteString(" WHERE ")
		queryBuilder.WriteString(strings.Join(whereClauses, " AND "))
	}

	//adding pageNumber to query
	queryBuilder.WriteString(fmt.Sprintf(` LIMIT 12 OFFSET %d`, (pageNumber-1)*12))

	var rows pgx.Rows
	var params []interface{}

	if searchQuery != "" {
		params = append(params, "%"+searchQuery+"%")
	}
	if cityQuery != "" {
		params = append(params, "%"+cityQuery+"%")
	}
	if levelQuery != "" {
		params = append(params, levelQuery)
	}
	// if typeQuery != "" {
	// 	params = append(params, typeQuery)
	// }

	rows, err = pool.Query(context.Background(), queryBuilder.String(), params...)

	if err != nil {
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		return
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
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching data"})
		return
	}

	c.JSON(http.StatusOK, jobs)
}
