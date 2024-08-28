package controllers

import (
	"mavik-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateProduct - Tạo sản phẩm mới
func CreateProduct(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Create(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": product})
}

// GetProducts - Lấy danh sách sản phẩm
func GetProducts(c *gin.Context) {
	var products []models.Product
	if err := models.DB.Preload("ProductGroups").Preload("ProductTempsSizes").Preload("ProductCategory").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, products)
}

// GetProduct - Lấy thông tin sản phẩm theo ID
func GetProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	// Sử dụng Preload để lấy thông tin đầy đủ cho các liên kết liên quan
	if err := models.DB.
		Preload("ProductGroups.Group.GroupModifiers.Modifier").
		Preload("ProductTempsSizes.Temperature"). // Preload Temperature
		Preload("ProductTempsSizes.Size").        // Preload Size
		Preload("ProductCategory").
		First(&product, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, product)

}

// UpdateProduct - Cập nhật thông tin sản phẩm theo ID
// func UpdateProduct(c *gin.Context) {
// 	id := c.Param("id")
// 	var product models.Product

// 	if err := models.DB.First(&product, id).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	if err := c.ShouldBindJSON(&product); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Xóa tất cả ProductTempSize liên quan đến sản phẩm này
// 	if err := models.DB.Where("product_id = ?", id).Delete(&models.ProductTempSize{}).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old ProductTempSize records"})
// 		return
// 	}

// 	// Xóa tất cả ProductGroups liên quan đến sản phẩm này
// 	if err := models.DB.Where("product_id = ?", id).Delete(&models.ProductGroup{}).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old ProductGroup records"})
// 		return
// 	}

// 	// Save the updated
// 	if err := models.DB.Save(&product).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": product})
// }

func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	// Tìm product theo ID
	if err := models.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Bind dữ liệu từ JSON vào product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Bắt đầu transaction
	tx := models.DB.Begin()

	// Xóa tất cả ProductTempSize liên quan đến sản phẩm này
	if err := tx.Where("product_id = ?", id).Delete(&models.ProductTempSize{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old ProductTempSize records"})
		return
	}

	// Xóa tất cả ProductGroups liên quan đến sản phẩm này
	if err := tx.Where("product_id = ?", id).Delete(&models.ProductGroup{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old ProductGroup records"})
		return
	}

	// Xóa tất cả ProductCategory liên quan đến sản phẩm này
	if err := tx.Where("product_id = ?", id).Delete(&models.ProductCategory{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old ProductCategory records"})
		return
	}

	// Lưu product (bao gồm cả ProductTempSize và ProductGroups mới từ JSON)
	if err := tx.Session(&gorm.Session{FullSaveAssociations: true}).Save(&product).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Commit transaction nếu tất cả các thao tác thành công
	tx.Commit()

	c.JSON(http.StatusOK, gin.H{"data": product})
}

func UpdateProducttest(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	// Tìm product theo ID
	if err := models.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Bind dữ liệu từ JSON vào product
	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Xóa tất cả ProductTempSize liên quan đến sản phẩm này
	if err := models.DB.Where("product_id = ?", id).Delete(&models.ProductTempSize{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old ProductTempSize records"})
		return
	}

	// Xóa tất cả ProductGroups liên quan đến sản phẩm này
	if err := models.DB.Where("product_id = ?", id).Delete(&models.ProductGroup{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete old ProductGroup records"})
		return
	}

	// Lưu product (bao gồm cả ProductTempSize và ProductGroups mới từ JSON)
	if err := models.DB.Session(&gorm.Session{FullSaveAssociations: true}).Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": product})
}

// DeleteProduct - Xóa sản phẩm theo ID
func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := models.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Delete(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": true})
}
