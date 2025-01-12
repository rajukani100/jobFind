package controllers

import (
	"context"
	database "jobfind/database"
	"jobfind/model"
	"jobfind/services"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Register(c *gin.Context) {

	type UserRequest struct {
		Name     string `json:"name" binding:"required"`
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}
	var userReq UserRequest
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
		c.JSON(http.StatusConflict, gin.H{"error": "User Already Exist."})
		return
	}

	var user = UserRequest{
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

	c.JSON(http.StatusOK, gin.H{"message": "Account created successfully."})
}

func Login(c *gin.Context) {

	type UserRequest struct {
		Email    string `json:"email" binding:"required,email"`
		Password string `json:"password" binding:"required"`
	}

	var userReq UserRequest

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

	if !isUserExist {
		c.JSON(http.StatusConflict, gin.H{"error": "User does not exist."})
		return
	}

	// check password hash with stored in db
	conn, err := database.ConnPool.Acquire(context.Background())
	if err != nil {
		log.Printf("Error acquiring database connection: %v", err)
		return
	}
	defer conn.Release()

	var user model.User
	row := conn.QueryRow(context.Background(), `SELECT userid, email, passwordhash,name,createdat FROM users WHERE email ILIKE $1`, userReq.Email)

	if err := row.Scan(&user.UserId, &user.Email, &user.PasswordHash, &user.Name, &user.CreatedAt); err != nil {
		log.Print("Error while fetching data")
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(userReq.Password))
	if err != nil {
		log.Print("Error : ", err)
		return
	}

	//generate jwt
	accessToken, refreshToken, err := services.GenerateJWT(user.UserId)
	if err != nil {
		log.Print("Error while generating jwt")
		return
	}

	if err := database.UpdateJwtTokens(user.UserId, accessToken, refreshToken); err != nil {
		log.Print("Error while updating jwt token")
		return
	}

	// Set cookies for tokens
	c.SetCookie("access_token", accessToken, 15*60, "/", "localhost", false, true)        // 15 minutes
	c.SetCookie("refresh_token", refreshToken, 7*24*60*60, "/", "localhost", false, true) // 7 days

	c.JSON(http.StatusOK, gin.H{"message": "Logged in"})

}

func AuthCheck(c *gin.Context) {

	// Read access token cookie
	accessToken, err := c.Cookie("access_token")

	if err == nil && accessToken != "" {
		_, err := services.VerifyJwt(accessToken)
		if err == nil {
			// Token is valid, redirect to homepage
			c.JSON(http.StatusOK, gin.H{"message": "User Already authenticated."})
			return
		}

		// Handle expired access token
		if err.Error() == "token expired" {
			refreshToken, err := c.Cookie("refresh_token")
			if err == nil && refreshToken != "" {
				// Validate the refresh token
				refreshUserId, err := services.VerifyJwt(refreshToken)
				if err == nil {
					// Generate a new access token
					newAccessToken, _, err := services.GenerateJWT(refreshUserId)
					if err != nil {
						log.Printf("Error generating new access token: %v", err)
						c.JSON(http.StatusUnauthorized, gin.H{"error": "Unable to refresh token, please login again."})
						return
					}

					// Set new access token cookie
					c.SetCookie("access_token", newAccessToken, 15*60, "/", "localhost", false, true) // 15 minutes
					c.JSON(http.StatusOK, gin.H{"message": "Token refreshed"})
					return
				}
			}
			// Redirect to login if refresh token is invalid or missing
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Session expired, please login again."})
			return
		}
	}

	refreshToken, err := c.Cookie("refresh_token")
	if err == nil && refreshToken != "" {
		// Validate the refresh token
		refreshUserId, err := services.VerifyJwt(refreshToken)
		if err == nil {
			// Generate a new access token
			newAccessToken, _, err := services.GenerateJWT(refreshUserId)
			if err != nil {
				log.Printf("Error generating new access token: %v", err)
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Unable to refresh token, please login again."})
				return
			}

			// Set new access token cookie
			c.SetCookie("access_token", newAccessToken, 15*60, "/", "localhost", false, true) // 15 minutes
			c.JSON(http.StatusOK, gin.H{"message": "Token refreshed"})
			return
		}
	}

	c.JSON(http.StatusUnauthorized, gin.H{"message": "Invalid session, proceed to login/register"})
}
