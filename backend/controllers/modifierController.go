package controllers

import (
	"net/http"

	"mavik-backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetColumnNames(db *gorm.DB, model interface{}) ([]string, error) {
	var columnNames []string

	migrator := db.Migrator()
	columns, err := migrator.ColumnTypes(model)
	if err != nil {
		return nil, err
	}

	for _, column := range columns {
		columnNames = append(columnNames, column.Name())
	}

	return columnNames, nil
}

// CreateModifier - Tạo mới Modifier
func CreateModifier(c *gin.Context) {
	var modifier models.Modifier
	if err := c.ShouldBindJSON(&modifier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Create(&modifier).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, modifier)
}

// GetModifier - Lấy thông tin một Modifier theo ID
func GetModifier(c *gin.Context) {
	id := c.Param("id")
	var modifier models.Modifier

	if err := models.DB.First(&modifier, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Modifier not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, modifier)
}

// GetModifiers - Lấy danh sách tất cả Modifier
func GetModifiers(c *gin.Context) {
	columnNames, err := GetColumnNames(models.DB, &models.Modifier{})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	var modifiers []models.Modifier
	if err := models.DB.Find(&modifiers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// c.JSON(http.StatusOK, modifiers)
	c.JSON(http.StatusOK, gin.H{"dataTable": modifiers, "columns": columnNames})
}

// UpdateModifier - Cập nhật thông tin một Modifier theo ID
func UpdateModifier(c *gin.Context) {
	id := c.Param("id")
	var modifier models.Modifier

	if err := models.DB.First(&modifier, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Modifier not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&modifier); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Save(&modifier).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, modifier)
}

// DeleteModifier - Xóa một Modifier theo ID
func DeleteModifier(c *gin.Context) {
	id := c.Param("id")
	var modifier models.Modifier

	if err := models.DB.First(&modifier, id).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusNotFound, gin.H{"error": "Modifier not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Delete(&modifier).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Modifier deleted successfully"})
}
