package controllers

import (
	"icecream-manager-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateCurrency(c *gin.Context) {
	var input models.Currency
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Create(&input)
	c.JSON(http.StatusOK, gin.H{"currency": input})
}

func GetCurrencies(c *gin.Context) {
	var currencies []models.Currency
	models.DB.Find(&currencies)
	c.JSON(http.StatusOK, gin.H{"currencies": currencies})
}

func UpdateCurrency(c *gin.Context) {
	var currency models.Currency
	if err := models.DB.Where("id = ?", c.Param("id")).First(&currency).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Currency not found"})
		return
	}

	if err := c.ShouldBindJSON(&currency); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Save(&currency)
	c.JSON(http.StatusOK, gin.H{"currency": currency})
}

func DeleteCurrency(c *gin.Context) {
	var currency models.Currency
	if err := models.DB.Where("id = ?", c.Param("id")).First(&currency).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Currency not found"})
		return
	}

	models.DB.Delete(&currency)
	c.JSON(http.StatusOK, gin.H{"message": "Currency deleted"})
}
