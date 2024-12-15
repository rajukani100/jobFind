package model

import "time"

type Job struct {
	Company     string    `json:"company"`
	Role        string    `json:"role"`
	Description string    `json:"description"`
	Level       string    `json:"level"`
	Posted_date time.Time `json:"posted_date"`
	Location    string    `json:"location"`
	Id          string    `json:"id"`
	Ctc         int       `json:"ctc"`
}
