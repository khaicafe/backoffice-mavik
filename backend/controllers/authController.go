package controllers

import (
	"log"
	"mavik-backend/models"
	"mavik-backend/utils"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

func Signup(c *gin.Context) {
	var input struct {
		MobileNumber string `json:"mobile_number" binding:"required"`
		Password     string `json:"password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := models.DB.Where("mobile_number = ?", input.MobileNumber).First(&user).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User already exists"})
		return
	}

	otp := utils.GenerateOTP()
	err := utils.SendOTP(input.MobileNumber, otp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	user = models.User{
		MobileNumber: input.MobileNumber,
		Password:     string(hashedPassword),
		OTP:          otp,
		OTPExpiresAt: time.Now().Add(1 * time.Hour),
		ResendCount:  0,
	}
	models.DB.Create(&user)

	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}

func SendOTP(c *gin.Context) {
	var input struct {
		MobileNumber string `json:"mobile_number" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := models.DB.Where("mobile_number = ?", input.MobileNumber).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	otp := utils.GenerateOTP()
	err := utils.SendOTP(input.MobileNumber, otp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP"})
		return
	}

	user.OTP = otp
	user.OTPExpiresAt = time.Now().Add(1 * time.Hour)
	user.ResendCount = 0
	models.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{"message": "OTP sent successfully"})
}

func VerifySignupOTP(c *gin.Context) {
	var input struct {
		MobileNumber string `json:"mobile_number" binding:"required"`
		OTP          string `json:"otp" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := models.DB.Where("mobile_number = ?", input.MobileNumber).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	if user.OTP != input.OTP || time.Now().After(user.OTPExpiresAt) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired OTP"})
		return
	}

	user.OTP = ""
	user.ResendCount = 0
	models.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{"message": "User verified successfully"})
}

func ResendOTP(c *gin.Context) {
	var input struct {
		MobileNumber string `json:"mobile_number" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := models.DB.Where("mobile_number = ?", input.MobileNumber).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	resendDelay := time.Duration(1<<user.ResendCount) * time.Minute
	if time.Now().Before(user.OTPExpiresAt.Add(-resendDelay)) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "You need to wait before resending OTP"})
		return
	}

	otp := utils.GenerateOTP()
	err := utils.SendOTP(input.MobileNumber, otp)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send OTP"})
		return
	}

	user.OTP = otp
	user.OTPExpiresAt = time.Now().Add(1 * time.Hour)
	user.ResendCount++
	models.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{"message": "OTP resent successfully"})
}

func Login(c *gin.Context) {
	var input struct {
		MobileNumber string `json:"mobile_number" binding:"required"`
		Password     string `json:"password" binding:"required"`
	}
	// Ghi log thông tin về input, sau đó dừng chương trình với log.Fatal
	log.Printf("An error occurred: %+v", input)

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := models.DB.Where("mobile_number = ?", input.MobileNumber).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid password"})
		return
	}

	token, err := utils.GenerateJWT(user.MobileNumber, user.Role)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token, "user": user})
}

func ResetPassword(c *gin.Context) {
	var input struct {
		MobileNumber string `json:"mobile_number" binding:"required"`
		OTP          string `json:"otp" binding:"required"`
		NewPassword  string `json:"new_password" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := models.DB.Where("mobile_number = ?", input.MobileNumber).First(&user).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	if user.OTP != input.OTP {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid OTP"})
		return
	}

	hashedPassword, _ := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	user.Password = string(hashedPassword)
	user.OTP = ""
	models.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{"message": "Password reset successfully"})
}
