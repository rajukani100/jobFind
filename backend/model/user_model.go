package model

import "time"

type User struct {
	UserId       string    `json:"user_id"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"password_hash"`
	Name         string    `json:"name"`
	CreatedAt    time.Time `json:"created_at"`
}

type Token struct {
	Id           string `json:"id"`
	UserId       string `json:"user_id"`
	RefreshToken string `json:"refresh_token"`
	ActiveToken  string `json:"active_token"`
}
