package services

import (
	"context"
	databse "jobfind/database"
	"log"
)

func CheckUserExist(email string) (bool, error) {
	// Acquire a connection from the pool
	conn, err := databse.ConnPool.Acquire(context.Background())
	if err != nil {
		log.Printf("Error acquiring database connection: %v", err)
		return false, err
	}
	defer conn.Release()

	// Query to check if the user exists
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE email ILIKE $1)`
	err = conn.QueryRow(context.Background(), query, email).Scan(&exists)
	if err != nil {
		log.Printf("Error querying database: %v", err)
		return false, err
	}

	return exists, nil
}
