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
	isUserExist, err := services.CheckUserExist(userReq.Email)
	if err != nil {
		log.Print("Error while checking user existance.")
		return
	}

	if isUserExist {
		c.JSON(http.StatusConflict, gin.H{"error": "user already exist"})
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
		log.Print("error while fetching user id")
		return
	}

	//generate jwt
	accessToken, refreshToken, err := services.GenerateJWT(userId)
	if err != nil {
		log.Print("Error while generating jwt")
		return
	}

	if err := database.SaveJwtTokens(userId, accessToken, refreshToken); err != nil {
		log.Print("Error while saving jwt token")
		return
	}

	// Set cookies for tokens
	c.SetCookie("access_token", accessToken, 15*60, "/", "localhost", false, true)        // 15 minutes
	c.SetCookie("refresh_token", refreshToken, 7*24*60*60, "/", "localhost", false, true) // 7 days

	c.JSON(http.StatusOK, userReq)
}

func Login(c *gin.Context) {

}
