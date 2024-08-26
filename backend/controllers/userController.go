package controllers

import (
	"log"
	"mavik-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// CreateUser - Tạo mới một người dùng
func CreateUser(c *gin.Context) {
	var input models.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Kiểm tra xem mobile_number đã tồn tại chưa
	var existingUser models.User
	if err := models.DB.Where("mobile_number = ?", input.MobileNumber).First(&existingUser).Error; err == nil {
		// Nếu tìm thấy user với mobile_number đã tồn tại
		c.JSON(http.StatusBadRequest, gin.H{"error": "Mobile number already in use"})
		return
	}

	// Sử dụng mật khẩu mặc định là "mavik"
	defaultPassword := "mavik"
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(defaultPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Gán mật khẩu đã mã hóa vào user
	input.Password = string(hashedPassword)

	// Tạo user mới
	if err := models.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, input)
}

// UpdateUser - Cập nhật thông tin người dùng

// UpdateUserPassword - Cập nhật mật khẩu người dùng
func UpdateUserPassword(c *gin.Context) {

	var input struct {
		CurrentPassword string `json:"currentPassword" binding:"required"`
		NewPassword     string `json:"newPassword" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {

		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Input: %+v\n", input)
	// log.Println("Request Params:", c)

	userID := c.Param("id")

	// Tìm người dùng theo ID
	var user models.User
	if err := models.DB.Where("id = ?", userID).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found!"})
		return
	}

	// Xác thực mật khẩu hiện tại
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(input.CurrentPassword)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Current password is incorrect"})
		return
	}

	// Mã hóa mật khẩu mới
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(input.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash new password"})
		return
	}

	// Cập nhật mật khẩu mới
	if err := models.DB.Model(&user).Update("password", string(hashedPassword)).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password updated successfully"})
}

// DeleteUser - Xóa người dùng
func DeleteUser(c *gin.Context) {
	var user models.User
	if err := models.DB.Where("id = ?", c.Param("id")).First(&user).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User not found!"})
		return
	}

	models.DB.Delete(&user)
	c.JSON(http.StatusOK, gin.H{"data": true})
}

// FindUsers - Lấy danh sách người dùng
func FindUsers(c *gin.Context) {
	var users []models.User
	models.DB.Find(&users)
	c.JSON(http.StatusOK, users)
}

// GetAllUsers - Lấy tất cả người dùng
func GetAllUsers(c *gin.Context) {
	var users []models.User
	if err := models.DB.Find(&users).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve users"})
		return
	}

	// c.JSON(http.StatusOK, gin.H{"data": users})
	c.JSON(http.StatusOK, users)
}
