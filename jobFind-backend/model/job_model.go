package model

import "time"

type Job struct {
	Company     string
	Role        string
	Description string
	Level       string
	Posted_date time.Time
	Location    string
	Id          string
	Ctc         int
}
