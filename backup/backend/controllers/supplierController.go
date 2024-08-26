package controllers

import (
	"icecream-manager-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateSupplier(c *gin.Context) {
	var input models.Supplier
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Create(&input)
	c.JSON(http.StatusOK, gin.H{"supplier": input})
}

func GetSuppliers(c *gin.Context) {
	var suppliers []models.Supplier
	models.DB.Find(&suppliers)
	c.JSON(http.StatusOK, gin.H{"suppliers": suppliers})
}

func UpdateSupplier(c *gin.Context) {
	var supplier models.Supplier
	if err := models.DB.Where("id = ?", c.Param("id")).First(&supplier).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
		return
	}

	if err := c.ShouldBindJSON(&supplier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Save(&supplier)
	c.JSON(http.StatusOK, gin.H{"supplier": supplier})
}

func DeleteSupplier(c *gin.Context) {
	var supplier models.Supplier
	if err := models.DB.Where("id = ?", c.Param("id")).First(&supplier).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Supplier not found"})
		return
	}

	models.DB.Delete(&supplier)
	c.JSON(http.StatusOK, gin.H{"message": "Supplier deleted"})
}
