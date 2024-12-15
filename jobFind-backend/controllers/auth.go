package controllers

import (
	"context"
	database "jobfind/database"
	"jobfind/model"
	"jobfind/services"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	var userReq model.UserRequest
	if err := c.ShouldBindBodyWithJSON(&userReq); err != nil {
		c.AbortWithError(http.StatusBadRequest, err)
		return
	}

	//check user is exist or not
	if services.CheckUserExist(&userReq.Email) {
		c.JSON(http.StatusConflict, gin.H{"error": "User already exists."})
		return
	}

	var user = model.UserRequest{
		Email:    userReq.Email,
		Password: services.HashPassword(userReq.Password),
		Name:     userReq.Name,
	}

	//save user record to db
	row := database.ConnPool.QueryRow(context.Background(), `INSERT INTO public.users(email,name,passwordhash) VALUES ($1, $2, $3) RETURNING userid`, user.Email, user.Name, user.Password)

	var userId string
	if err := row.Scan(&userId); err != nil {
		log.Fatal("error while fetching user id")
	}

	//generate jwt

	c.JSON(http.StatusOK, userReq)
}

func Login(c *gin.Context) {

}
