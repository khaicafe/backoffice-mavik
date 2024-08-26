package controllers

import (
	"icecream-manager-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateRecipeType(c *gin.Context) {
	var input models.RecipeType
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Create(&input)
	c.JSON(http.StatusOK, gin.H{"recipeTypes": input})
}

func GetRecipeTypes(c *gin.Context) {
	var types []models.RecipeType
	models.DB.Find(&types)
	c.JSON(http.StatusOK, gin.H{"recipeTypes": types})
}

func UpdateRecipeType(c *gin.Context) {
	var type_ models.RecipeType
	if err := models.DB.Where("id = ?", c.Param("id")).First(&type_).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Type Note not found"})
		return
	}

	if err := c.ShouldBindJSON(&type_); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Save(&type_)
	c.JSON(http.StatusOK, gin.H{"recipeTypes": type_})
}

func DeleteRecipeType(c *gin.Context) {
	var type_ models.RecipeType
	if err := models.DB.Where("id = ?", c.Param("id")).First(&type_).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Type_ Note not found"})
		return
	}

	models.DB.Delete(&type_)
	c.JSON(http.StatusOK, gin.H{"message": "Type_ Note deleted"})
}
