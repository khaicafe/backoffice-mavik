package controllers

import (
	"icecream-manager-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateFinalProduct handles the creation of a new final product
func CreateFinalProduct(c *gin.Context) {
	var input models.FinalProduct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": input})
}

// GetFinalProduct handles retrieving a final product by ID
func GetFinalProduct(c *gin.Context) {
	var finalProduct models.FinalProduct
	if err := models.DB.Preload("Recipe").Preload("Steps").Preload("Comments").First(&finalProduct, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Final Product not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": finalProduct})
}

// GetAllFinalProducts handles retrieving all final products
func GetAllFinalProducts(c *gin.Context) {
	var finalProducts []models.FinalProduct
	if err := models.DB.Preload("Recipe").Preload("Steps").Preload("Comments").Find(&finalProducts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to retrieve final products"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": finalProducts})
}

// UpdateFinalProduct handles updating an existing final product
func UpdateFinalProduct(c *gin.Context) {
	var finalProduct models.FinalProduct
	if err := models.DB.Preload("Steps").Preload("Comments").First(&finalProduct, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Final Product not found"})
		return
	}

	var input models.FinalProduct
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	finalProduct.RecipeID = input.RecipeID
	finalProduct.Quantity = input.Quantity
	finalProduct.Unit = input.Unit
	finalProduct.Notes = input.Notes

	// Update steps and comments
	if err := models.DB.Model(&finalProduct).Association("Steps").Replace(input.Steps); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}
	if err := models.DB.Model(&finalProduct).Association("Comments").Replace(input.Comments); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal error"})
		return
	}

	if err := models.DB.Save(&finalProduct).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": finalProduct})
}

// DeleteFinalProduct handles deleting a final product
func DeleteFinalProduct(c *gin.Context) {
	var finalProduct models.FinalProduct
	if err := models.DB.First(&finalProduct, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Final Product not found"})
		return
	}

	if err := models.DB.Delete(&finalProduct).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to delete final product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": true})
}
