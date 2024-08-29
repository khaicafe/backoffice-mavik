package controllers

import (
	"mavik-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetCombos - Lấy danh sách tất cả các combo
func GetCombos(c *gin.Context) {
	var combos []models.Combo
	if err := models.DB.Preload("Categories.Category").Preload("ProductCombos.Product").Preload("ProductCombos.Combo").Find(&combos).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, combos)
}

// GetComboByID - Lấy thông tin combo theo ID
func GetComboByID(c *gin.Context) {
	id := c.Param("id")
	var combo models.Combo
	if err := models.DB.Preload("Categories").Preload("ProductCombos").First(&combo, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Combo not found"})
		return
	}
	c.JSON(http.StatusOK, combo)
}

// CreateCombo - Tạo mới combo
func CreateCombo(c *gin.Context) {
	var combo models.Combo
	if err := c.ShouldBindJSON(&combo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := models.DB.Create(&combo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, combo)
}

// UpdateCombo - Cập nhật combo theo ID
func UpdateCombo(c *gin.Context) {
	id := c.Param("id")
	var combo models.Combo

	// Kiểm tra combo có tồn tại không
	if err := models.DB.First(&combo, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Combo not found"})
		return
	}

	// Xóa các bản ghi liên quan trong bảng product_combos và combo_categories
	models.DB.Where("combo_id = ?", id).Delete(&models.ProductCombo{})
	models.DB.Where("combo_id = ?", id).Delete(&models.ComboCategory{})

	// Nhận dữ liệu JSON từ yêu cầu và ràng buộc vào biến combo
	if err := c.ShouldBindJSON(&combo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Cập nhật lại combo và lưu các liên kết mới
	if err := models.DB.Save(&combo).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, combo)
}

// DeleteCombo - Xóa combo theo ID
func DeleteCombo(c *gin.Context) {
	id := c.Param("id")
	if err := models.DB.Delete(&models.Combo{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Combo deleted successfully"})
}
