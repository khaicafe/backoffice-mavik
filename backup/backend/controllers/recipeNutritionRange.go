package controllers

import (
	"icecream-manager-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateRecipeNutrition(c *gin.Context) {
	var input models.RecipeNutritionRange
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Create(&input)
	c.JSON(http.StatusOK, gin.H{"recipeNutrition": input})
}

func GetRecipeNutrition(c *gin.Context) {
	var recipeNutritionRange []models.RecipeNutritionRange
	models.DB.Find(&recipeNutritionRange)
	c.JSON(http.StatusOK, gin.H{"recipeNutrition": recipeNutritionRange})
}

func UpdateRecipeNutrition(c *gin.Context) {
	var recipeNutritionRange models.RecipeNutritionRange
	if err := models.DB.Where("id = ?", c.Param("id")).First(&recipeNutritionRange).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "recipeNutrition Note not found"})
		return
	}

	if err := c.ShouldBindJSON(&recipeNutritionRange); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Save(&recipeNutritionRange)
	c.JSON(http.StatusOK, gin.H{"recipeNutrition": recipeNutritionRange})
}

func DeleteRecipeNutrition(c *gin.Context) {
	var recipeNutritionRange models.RecipeNutritionRange
	if err := models.DB.Where("id = ?", c.Param("id")).First(&recipeNutritionRange).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "recipeNutrition Note not found"})
		return
	}

	models.DB.Delete(&recipeNutritionRange)
	c.JSON(http.StatusOK, gin.H{"message": "recipeNutrition Note deleted"})
}
