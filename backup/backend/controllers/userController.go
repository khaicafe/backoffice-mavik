package controllers

import (
	"icecream-manager-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetUsers(c *gin.Context) {
	var users []models.User
	models.DB.Select("id, mobile_number, role").Find(&users)

	c.JSON(http.StatusOK, users)
}

func UpdateUserRole(c *gin.Context) {
	var input struct {
		MobileNumber string `json:"mobile_number" binding:"required"`
		Role         string `json:"role" binding:"required"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var user models.User
	if err := models.DB.Where("mobile_number = ?", input.MobileNumber).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	user.Role = input.Role
	models.DB.Save(&user)

	c.JSON(http.StatusOK, gin.H{"message": "User role updated successfully"})
}
