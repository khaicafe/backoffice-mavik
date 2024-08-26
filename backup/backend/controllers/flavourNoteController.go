package controllers

import (
	"icecream-manager-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateFlavourNote(c *gin.Context) {
	var input models.FlavourNote
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Create(&input)
	c.JSON(http.StatusOK, gin.H{"flavourNote": input})
}

func GetFlavourNotes(c *gin.Context) {
	var flavourNotes []models.FlavourNote
	models.DB.Find(&flavourNotes)
	c.JSON(http.StatusOK, gin.H{"flavourNotes": flavourNotes})
}

func UpdateFlavourNote(c *gin.Context) {
	var flavourNote models.FlavourNote
	if err := models.DB.Where("id = ?", c.Param("id")).First(&flavourNote).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Flavour Note not found"})
		return
	}

	if err := c.ShouldBindJSON(&flavourNote); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	models.DB.Save(&flavourNote)
	c.JSON(http.StatusOK, gin.H{"flavourNote": flavourNote})
}

func DeleteFlavourNote(c *gin.Context) {
	var flavourNote models.FlavourNote
	if err := models.DB.Where("id = ?", c.Param("id")).First(&flavourNote).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Flavour Note not found"})
		return
	}

	models.DB.Delete(&flavourNote)
	c.JSON(http.StatusOK, gin.H{"message": "Flavour Note deleted"})
}
