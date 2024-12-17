package middlewares

import (
	"jobfind/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AuthApiMiddleware(c *gin.Context) {
	accessToken, err := c.Cookie("access_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Missing access token"})
		c.Abort()
		return
	}

	_, err = services.VerifyJwt(accessToken)
	if err != nil {
		// If the token is expired, try to refresh
		if err.Error() == "token expired" {
			refreshToken, err := c.Cookie("refresh_token")
			if err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Missing refresh token"})
				c.Abort()
				return
			}

			refreshUserId, err := services.VerifyJwt(refreshToken)
			if err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Invalid refresh token"})
				c.Abort()
				return
			}

			// Generate a new access token
			newAccessToken, _, err := services.GenerateJWT(refreshUserId)
			if err != nil {
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Error generating new access token"})
				c.Abort()
				return
			}

			c.SetCookie("access_token", newAccessToken, 15*60, "/", "localhost", false, true)
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized: Invalid token"})
			c.Abort()
			return
		}
	}

	c.Next()
}
