package utils

import (
	"time"

	"github.com/dgrijalva/jwt-go"
)

var jwtKey = []byte("secret_key")

type Claims struct {
	MobileNumber string `json:"mobile_number"`
	Role         string `json:"role"`
	jwt.StandardClaims
}

func GenerateJWT(mobileNumber, role string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		MobileNumber: mobileNumber,
		Role:         role,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtKey)
}
func GetJWTKey() []byte {
	return jwtKey
}
