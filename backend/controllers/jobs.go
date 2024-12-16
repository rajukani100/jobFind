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
	typeQuery := c.Query("type")

	if err != nil || pageNumber <= 0 {
		pageNumber = 1
	}

	var queryBuilder strings.Builder
	queryBuilder.WriteString(`SELECT company_name, role, description, level, posted_date, location, id, ctc, type FROM job_listings`)

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
	if typeQuery != "" {
		whereClauses = append(whereClauses, fmt.Sprintf(`type ILIKE $%d`, paramIndex))
		paramIndex++
	}
	if len(whereClauses) > 0 {
		queryBuilder.WriteString(" WHERE ")
		queryBuilder.WriteString(strings.Join(whereClauses, " AND "))
	}

	//adding pageNumber to query
	queryBuilder.WriteString(fmt.Sprintf(` LIMIT 15 OFFSET %d`, (pageNumber-1)*15))

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
	if typeQuery != "" {
		params = append(params, typeQuery)
	}

	rows, err = database.ConnPool.Query(context.Background(), queryBuilder.String(), params...)

	if err != nil {
		fmt.Fprintf(os.Stderr, "QueryRow failed: %v\n", err)
		return
	}

	defer rows.Close()

	jobs := make([]model.Job, 0, 15)
	for rows.Next() {

		var job model.Job

		err := rows.Scan(&job.Company, &job.Role, &job.Description, &job.Level, &job.Posted_date, &job.Location, &job.Id, &job.Ctc, &job.Type)

		if err != nil {
			log.Printf("Error scanning row: %v", err)
			continue
		}
		jobs = append(jobs, job)

	}
	if rows.Err() != nil {
		log.Fatalf("Error reading rows: %v\n", rows.Err())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching data"})
		return
	}

	c.JSON(http.StatusOK, jobs)
}

func GetJob(c *gin.Context) {
	postId := c.Param("p_id")

	query := `SELECT company_name, role, description, level, posted_date, location, id, ctc, type FROM job_listings WHERE id = $1`

	var job model.Job
	err := database.ConnPool.QueryRow(context.Background(), query, postId).Scan(&job.Company,
		&job.Role,
		&job.Description,
		&job.Level,
		&job.Posted_date,
		&job.Location,
		&job.Id,
		&job.Ctc,
		&job.Type)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching data"})
		return
	}

	c.JSON(http.StatusOK, job)

}
