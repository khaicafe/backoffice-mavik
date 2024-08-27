package controllers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"mavik-backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func UploadImages(c *gin.Context) {
	form, err := c.MultipartForm()
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	files := form.File["files"]
	db := c.MustGet("db").(*gorm.DB)

	for _, file := range files {
		// Xóa ký tự đặc biệt và thay thế khoảng cách bằng "_"
		fileNameWithoutExt := strings.TrimSuffix(file.Filename, filepath.Ext(file.Filename))
		cleanedFileName := strings.ReplaceAll(fileNameWithoutExt, " ", "_")
		cleanedFileName = strings.Map(func(r rune) rune {
			if r == '_' || r >= 'A' && r <= 'Z' || r >= 'a' && r <= 'z' || r >= '0' && r <= '9' {
				return r
			}
			return -1
		}, cleanedFileName)

		// Tạo thư mục theo ngày tháng năm hiện tại
		folderName := time.Now().Format("2006-01-02")
		uploadPath := filepath.Join("uploadImage", folderName)

		if _, err := os.Stat(uploadPath); os.IsNotExist(err) {
			os.MkdirAll(uploadPath, os.ModePerm)
		}

		// Lưu file vào thư mục
		filePath := filepath.Join(uploadPath, cleanedFileName)
		if err := c.SaveUploadedFile(file, filePath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Unable to save file"})
			return
		}

		// Tạo URL cho file
		url := fmt.Sprintf("http://localhost:8080/%s/%s/%s", "uploadImage", folderName, cleanedFileName)

		// Lưu thông tin vào database
		image := models.Image{
			FileName: cleanedFileName,
			FilePath: filePath,
			URL:      url,
		}
		db.Create(&image)
	}

	c.JSON(http.StatusOK, gin.H{"message": "Files uploaded successfully"})
}

// GetAllImages - Lấy tất cả các Image
func GetAllImages(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var images []models.Image
	db.Find(&images)

	c.JSON(http.StatusOK, gin.H{"data": images})
}

// GetImageByID - Lấy Image theo ID
func GetImageByID(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var image models.Image

	if err := db.Where("id = ?", c.Param("id")).First(&image).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": image})
}

// UpdateImage - Cập nhật Image theo ID
func UpdateImage(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var image models.Image

	if err := db.Where("id = ?", c.Param("id")).First(&image).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		return
	}

	if err := c.ShouldBindJSON(&image); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	db.Save(&image)
	c.JSON(http.StatusOK, gin.H{"data": image})
}

// DeleteImage - Xóa Image theo ID
func DeleteImage(c *gin.Context) {
	db := c.MustGet("db").(*gorm.DB)
	var image models.Image

	if err := db.Where("id = ?", c.Param("id")).First(&image).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Image not found"})
		return
	}

	db.Delete(&image)
	c.JSON(http.StatusOK, gin.H{"data": true})
}
