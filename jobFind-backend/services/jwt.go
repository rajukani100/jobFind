package services

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("jwt_key")

// GenerateJWT generates an access and refresh token for a given user ID
func GenerateJWT(userID string) (string, string, error) {
	// Access Token (short-lived)
	accessTokenClaims := jwt.MapClaims{
		"userid": userID,
		"exp":    time.Now().Add(15 * time.Minute).Unix(), // Access token expires in 15 minutes
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodHS256, accessTokenClaims)
	accessTokenString, err := accessToken.SignedString(jwtSecret)
	if err != nil {
		return "", "", err
	}

	// Refresh Token (longer-lived)
	refreshTokenClaims := jwt.MapClaims{
		"userid": userID,
		"exp":    time.Now().Add(7 * 24 * time.Hour).Unix(), // Refresh token expires in 7 days
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshTokenClaims)
	refreshTokenString, err := refreshToken.SignedString(jwtSecret)
	if err != nil {
		return "", "", err
	}

	return accessTokenString, refreshTokenString, nil
}
