package controllers

import (
	"mavik-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetMenus - Lấy danh sách tất cả các menus
func GetMenus(c *gin.Context) {
	var menus []models.Menu
	if err := models.DB.
		Preload("Products.ProductGroups.Group").
		Preload("Products.ProductTempsSizes.Temperature").
		Preload("Products.ProductTempsSizes.Size").
		Preload("Products.ProductCategory.Category").
		Preload("Combos.ProductCombos.Product").
		Preload("Combos.Categories.Category").
		Find(&menus).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, menus)
}

// GetMenuByID - Lấy thông tin menu theo ID
func GetMenuByID(c *gin.Context) {
	id := c.Param("id")
	var menu models.Menu

	// Truy vấn Menu cùng với các mối quan hệ
	if err := models.DB.Preload("Products").Preload("Combos").First(&menu, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu not found"})
		return
	}

	c.JSON(http.StatusOK, menu)
}

func CreateMenu(c *gin.Context) {
	var menu models.Menu

	// Nhận dữ liệu từ request body
	if err := c.ShouldBindJSON(&menu); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Lưu Menu cùng với các Products và Combos liên quan
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

	// Tìm Menu cần cập nhật
	if err := models.DB.Preload("Products").Preload("Combos").First(&menu, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu not found"})
		return
	}

	// Nhận dữ liệu cập nhật từ request body
	var input models.Menu
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Cập nhật các trường
	menu.Name = input.Name

	// Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
	tx := models.DB.Begin()

	// Cập nhật mối quan hệ Products
	if err := tx.Model(&menu).Association("Products").Replace(input.Products); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Cập nhật mối quan hệ Combos
	if err := tx.Model(&menu).Association("Combos").Replace(input.Combos); err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Lưu các thay đổi
	if err := tx.Save(&menu).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Commit transaction
	tx.Commit()

	c.JSON(http.StatusOK, menu)
}

// DeleteMenu - Xóa menu theo ID
func DeleteMenu(c *gin.Context) {
	id := c.Param("id")
	var menu models.Menu

	// Tìm Menu cần xoá
	if err := models.DB.First(&menu, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Menu not found"})
		return
	}

	// Xoá các mối quan hệ trước
	if err := models.DB.Model(&menu).Association("Products").Clear(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Model(&menu).Association("Combos").Clear(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Xoá Menu
	if err := models.DB.Delete(&menu).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Menu deleted successfully"})
}
