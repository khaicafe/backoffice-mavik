package controllers

import (
	"mavik-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetMenus - Lấy danh sách tất cả các menu
func GetMenus(c *gin.Context) {
	var menus []models.Menu
	if err := models.DB.Preload("Combo").Preload("Product").Find(&menus).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, menus)
}

// GetMenuByID - Lấy thông tin menu theo ID
func GetMenuByID(c *gin.Context) {
	id := c.Param("id")
	var menu models.Menu
	if err := models.DB.Preload("Combo").Preload("Product").First(&menu, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu not found"})
		return
	}
	c.JSON(http.StatusOK, menu)
}

// CreateMenu - Tạo mới menu
func CreateMenu(c *gin.Context) {
	var menu models.Menu
	if err := c.ShouldBindJSON(&menu); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := models.DB.Create(&menu).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, menu)
}

// UpdateMenu - Cập nhật menu theo ID
func UpdateMenu(c *gin.Context) {
	id := c.Param("id")
	var menu models.Menu
	if err := models.DB.First(&menu, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu not found"})
		return
	}

	if err := c.ShouldBindJSON(&menu); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Save(&menu).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, menu)
}

// DeleteMenu - Xóa menu theo ID
func DeleteMenu(c *gin.Context) {
	id := c.Param("id")
	if err := models.DB.Delete(&models.Menu{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Menu deleted successfully"})
}
