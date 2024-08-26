package controllers

import (
	"mavik-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Get all modifiers
func GetModifiers(c *gin.Context) {
	var modifiers []models.Modifier
	if err := models.DB.Find(&modifiers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, modifiers)
}

// Create a new modifier
func CreateModifier(c *gin.Context) {
	var modifier models.Modifier
	if err := c.ShouldBindJSON(&modifier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := models.DB.Create(&modifier).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, modifier)
}

// Update an existing modifier
func UpdateModifier(c *gin.Context) {
	id := c.Param("id")
	var modifier models.Modifier
	if err := models.DB.Where("id = ?", id).First(&modifier).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Modifier not found"})
		return
	}
	if err := c.ShouldBindJSON(&modifier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	models.DB.Save(&modifier)
	c.JSON(http.StatusOK, modifier)
}

// Delete a modifier
func DeleteModifier(c *gin.Context) {
	id := c.Param("id")
	var modifier models.Modifier
	if err := models.DB.Where("id = ?", id).First(&modifier).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Modifier not found"})
		return
	}
	models.DB.Delete(&modifier)
	c.JSON(http.StatusOK, gin.H{"message": "Modifier deleted"})
}
