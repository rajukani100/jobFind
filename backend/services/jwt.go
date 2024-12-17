package services

import (
	"errors"
	"log"
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

func VerifyJwt(tokenString string) (string, error) {
	// Parse the JWT token
	token, err := jwt.Parse(tokenString, func(t *jwt.Token) (interface{}, error) {
		// Validate the token's signing method
		if t.Method != jwt.SigningMethodHS256 {
			return nil, errors.New("unexpected signing method, expected HS256")
		}
		// Return the secret key used for verifying the token
		return jwtSecret, nil
	})

	if err != nil {
		log.Printf("Error parsing JWT: %v", err)
		return "", err
	}

	// Check if the token is valid
	if !token.Valid {
		return "", errors.New("invalid token")
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if !ok {
		return "", errors.New("failed to extract claims")
	}

	expirationTime, ok := claims["exp"].(float64)
	if !ok {
		return "", errors.New("expiration time not found in token")
	}

	expTime := time.Unix(int64(expirationTime), 0)

	if expTime.Before(time.Now()) {
		return "", errors.New("token expired")
	}

	userId, ok := claims["userid"].(string)
	if !ok {
		return "", errors.New("userid not found in token")
	}

	return userId, nil
}
