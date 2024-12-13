package databse

import (
	"context"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func InitDB() (*pgxpool.Pool, error) {
	err := godotenv.Load(`D:\development\goLang\jobFind\jobFind-backend\database\.env`)

	if err != nil {
		return nil, err
	}
	pool, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		return nil, err
	}
	return pool, nil
}
