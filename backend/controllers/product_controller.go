package controllers

import (
	"mavik-backend/models"
	"mavik-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// CreateProduct - Tạo sản phẩm mới
func CreateProduct(c *gin.Context) {
	var input models.Product

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Tạo mới Product
	if err := models.DB.Create(&input).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Tạo các ProductGroup, ProductTempSize, ProductCategory liên quan
	for _, pg := range input.ProductGroups {
		pg.ProductID = int(input.ID)
		models.DB.Create(&pg)
	}

	for _, pts := range input.ProductTempsSizes {
		pts.ProductID = int(input.ID)
		models.DB.Create(&pts)
	}

	for _, pc := range input.ProductCategory {
		pc.ProductID = int(input.ID)
		models.DB.Create(&pc)
	}

	c.JSON(http.StatusOK, gin.H{"data": input})
}

// GetProducts - Lấy danh sách sản phẩm
func GetProducts(c *gin.Context) {
	var products []models.Product
	if err := models.DB.Preload("ProductGroups").Preload("ProductTempsSizes").Preload("ProductCategory").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Chuyển đổi `menus` sang JSON và loại bỏ các trường không cần thiết
	cleanedMenus := utils.RemoveInvalidEntries(products)

	c.JSON(http.StatusOK, cleanedMenus)
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
	// Chuyển đổi `menus` sang JSON và loại bỏ các trường không cần thiết
	// cleanedMenus := utils.RemoveInvalidEntries(product)

	c.JSON(http.StatusOK, product)

}

func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var existingProduct models.Product

	// Bắt đầu một transaction
	tx := models.DB.Begin()

	// Nạp đầy đủ dữ liệu hiện tại của sản phẩm
	if err := tx.Preload("ProductGroups").Preload("ProductTempsSizes").Preload("ProductCategory").First(&existingProduct, id).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Gỡ bỏ các liên kết hiện tại
	if err := tx.Where("product_id = ?", id).Delete(&models.ProductGroup{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if err := tx.Where("product_id = ?", id).Delete(&models.ProductTempSize{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if err := tx.Where("product_id = ?", id).Delete(&models.ProductCategory{}).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Nhận dữ liệu mới từ request
	var input models.Product
	if err := c.ShouldBindJSON(&input); err != nil {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Cập nhật thông tin sản phẩm
	existingProduct.Name = input.Name
	existingProduct.Description = input.Description
	existingProduct.Roasted = input.Roasted
	existingProduct.ImageLinkSquare = input.ImageLinkSquare
	existingProduct.ImageLinkPortrait = input.ImageLinkPortrait
	existingProduct.Ingredients = input.Ingredients
	existingProduct.SpecialIngredient = input.SpecialIngredient
	existingProduct.Discount = input.Discount
	existingProduct.AverageRating = input.AverageRating
	existingProduct.RatingsCount = input.RatingsCount
	existingProduct.Favourite = input.Favourite
	existingProduct.Type = input.Type
	existingProduct.Currency = input.Currency
	existingProduct.Price = input.Price

	// Thêm lại các liên kết mới
	for _, pg := range input.ProductGroups {
		newProductGroup := models.ProductGroup{
			ProductID: int(existingProduct.ID),
			GroupID:   pg.GroupID,
			Type:      pg.Type,
		}
		if err := tx.Create(&newProductGroup).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	for _, pt := range input.ProductTempsSizes {
		newProductTempSize := models.ProductTempSize{
			ProductID:     int(existingProduct.ID),
			TemperatureID: pt.TemperatureID,
			SizeID:        pt.SizeID,
			Price:         pt.Price,
			Currency:      pt.Currency,
			Default:       pt.Default,
		}
		if err := tx.Create(&newProductTempSize).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	for _, pc := range input.ProductCategory {
		newProductCategory := models.ProductCategory{
			ProductID:  int(existingProduct.ID),
			CategoryID: pc.CategoryID,
		}
		if err := tx.Create(&newProductCategory).Error; err != nil {
			tx.Rollback()
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	// Lưu lại sản phẩm
	if err := tx.Save(&existingProduct).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Commit transaction nếu không có lỗi
	tx.Commit()
	c.JSON(http.StatusOK, gin.H{"data": existingProduct})
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
