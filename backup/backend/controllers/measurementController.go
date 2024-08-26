package controllers

import (
	"icecream-manager-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateMeasurement(c *gin.Context) {
	var input models.Measurement
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Create(&input)
	c.JSON(http.StatusOK, gin.H{"measurement": input})
}

func GetMeasurements(c *gin.Context) {
	var measurements []models.Measurement
	models.DB.Find(&measurements)
	c.JSON(http.StatusOK, gin.H{"measurements": measurements})
}

func UpdateMeasurement(c *gin.Context) {
	var measurement models.Measurement
	if err := models.DB.Where("id = ?", c.Param("id")).First(&measurement).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Measurement not found"})
		return
	}

	if err := c.ShouldBindJSON(&measurement); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Save(&measurement)
	c.JSON(http.StatusOK, gin.H{"measurement": measurement})
}

func DeleteMeasurement(c *gin.Context) {
	var measurement models.Measurement
	if err := models.DB.Where("id = ?", c.Param("id")).First(&measurement).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Measurement not found"})
		return
	}

	models.DB.Delete(&measurement)
	c.JSON(http.StatusOK, gin.H{"message": "Measurement deleted"})
}
