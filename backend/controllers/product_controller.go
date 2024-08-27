package controllers

import (
	"mavik-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
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
	if err := models.DB.Preload("ProductGroups").Preload("ProductTempsSizes").Preload("ProductCategories").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": products})
}

// GetProduct - Lấy thông tin sản phẩm theo ID
func GetProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := models.DB.Preload("ProductGroups").Preload("ProductTempsSizes").Preload("ProductCategories").First(&product, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": product})
}

// UpdateProduct - Cập nhật thông tin sản phẩm theo ID
func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product

	if err := models.DB.First(&product, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&product); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Save(&product).Error; err != nil {
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
