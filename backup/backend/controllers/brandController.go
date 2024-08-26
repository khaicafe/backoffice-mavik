package controllers

import (
	"icecream-manager-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateBrand(c *gin.Context) {
	var input models.Brand
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Create(&input)
	c.JSON(http.StatusOK, gin.H{"brand": input})
}

func GetBrands(c *gin.Context) {
	var brands []models.Brand
	models.DB.Find(&brands)
	c.JSON(http.StatusOK, gin.H{"brands": brands})
}

func UpdateBrand(c *gin.Context) {
	var brand models.Brand
	if err := models.DB.Where("id = ?", c.Param("id")).First(&brand).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Brand not found"})
		return
	}

	if err := c.ShouldBindJSON(&brand); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Save(&brand)
	c.JSON(http.StatusOK, gin.H{"brand": brand})
}

func DeleteBrand(c *gin.Context) {
	var brand models.Brand
	if err := models.DB.Where("id = ?", c.Param("id")).First(&brand).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Brand not found"})
		return
	}

	models.DB.Delete(&brand)
	c.JSON(http.StatusOK, gin.H{"message": "Brand deleted"})
}
