package controllers

import (
	"net/http"

	"mavik-backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Similar CRUD handlers for Temperature
func CreateTemperature(c *gin.Context) {
	var temperature models.Temperature
	if err := c.ShouldBindJSON(&temperature); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Create(&temperature).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, temperature)
}

func GetTemperature(c *gin.Context) {
	id := c.Param("id")
	var temperature models.Temperature

	if err := models.DB.First(&temperature, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Temperature not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, temperature)
}

func GetTemperatures(c *gin.Context) {
	var temperatures []models.Temperature
	if err := models.DB.Find(&temperatures).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, temperatures)
}

func UpdateTemperature(c *gin.Context) {
	id := c.Param("id")
	var temperature models.Temperature

	if err := models.DB.First(&temperature, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Temperature not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&temperature); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Save(&temperature).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, temperature)
}

func DeleteTemperature(c *gin.Context) {
	id := c.Param("id")
	var temperature models.Temperature

	if err := models.DB.First(&temperature, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Temperature not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Delete(&temperature).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Temperature deleted successfully"})
}
