package services

import (
	"context"
	databse "jobfind/database"
	"log"
)

func CheckUserExist(email *string) bool {
	conn, err := databse.ConnPool.Acquire(context.Background())
	defer conn.Release()
	if err != nil {
		log.Fatal("Error while checking existance of user", err)
	}

	row := conn.QueryRow(context.Background(), `SELECT * FROM users WHERE email ILIKE $1`, email)

	var db_email string

	if err = row.Scan(&db_email); err != nil {
		log.Fatal("Error: ", err)
	}

	if db_email != *email {
		return false
	} else {
		return true
	}

}
