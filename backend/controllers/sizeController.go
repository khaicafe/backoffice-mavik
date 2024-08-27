package controllers

import (
	"net/http"

	"mavik-backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Similar CRUD handlers for Size
func CreateSize(c *gin.Context) {
	var size models.Size
	if err := c.ShouldBindJSON(&size); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Create(&size).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, size)
}

func GetSize(c *gin.Context) {
	id := c.Param("id")
	var size models.Size

	if err := models.DB.First(&size, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Size not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, size)
}

func GetSizes(c *gin.Context) {
	columnNames, err := GetColumnNames(models.DB, &models.Size{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var sizes []models.Size
	if err := models.DB.Find(&sizes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// c.JSON(http.StatusOK, sizes)
	c.JSON(http.StatusOK, gin.H{"dataTable": sizes, "columns": columnNames})
}

func UpdateSize(c *gin.Context) {
	id := c.Param("id")
	var size models.Size

	if err := models.DB.First(&size, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Size not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&size); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Save(&size).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, size)
}

func DeleteSize(c *gin.Context) {
	id := c.Param("id")
	var size models.Size

	if err := models.DB.First(&size, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Size not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Delete(&size).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Size deleted successfully"})
}
