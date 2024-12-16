package databse

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var ConnPool *pgxpool.Pool

func InitDB() {
	err := godotenv.Load(`D:\development\goLang\jobFind\jobFind-backend\database\.env`)
	if err != nil {
		log.Print("Error while .env read", err)
		return
	}
	ConnPool, err = pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		log.Print("Error while db connection", err)
		return
	}
}
