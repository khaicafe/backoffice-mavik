package controllers

import (
	"fmt"
	"mavik-backend/models"
	"mavik-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

///// tạo mới group và id liên kết
type ModifierInput struct {
	ID      uint `json:"ID"`
	Default bool `json:"Default"`
}

type GroupModifierInput struct {
	Name      string          `json:"name"`
	MinQty    int             `json:"min_qty"`
	MaxQty    int             `json:"max_qty"`
	Modifiers []ModifierInput `json:"modifier_ids"`
}

// CreateGroupModifier - Tạo mới Group và các GroupModifier liên quan
func CreateGroupModifier(c *gin.Context) {
	var input GroupModifierInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Tạo Group mới
	group := models.Group{
		Name:   input.Name,
		MinQty: input.MinQty,
		MaxQty: input.MaxQty,
	}

	if err := models.DB.Create(&group).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Tạo các GroupModifier liên kết với Group vừa tạo
	for _, modifier := range input.Modifiers {
		groupModifier := models.GroupModifier{
			GroupID:    int(group.ID),
			ModifierID: int(modifier.ID),
			Default:    modifier.Default, // Lưu giá trị Default
		}
		if err := models.DB.Create(&groupModifier).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Group and GroupModifiers created successfully"})
}

// GroupModifier

func GetAllGroupModifiers(c *gin.Context) {
	var groupModifiers []models.GroupModifier

	// Lấy tất cả GroupModifiers và preload Group và Modifier liên quan
	if err := models.DB.Preload("Group").Preload("Modifier").Find(&groupModifiers).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Map để nhóm các GroupModifier theo Group
	grouped := make(map[int]map[string]interface{})

	// Duyệt qua tất cả GroupModifiers và nhóm lại theo Group
	for _, gm := range groupModifiers {
		// Print GroupID to console
		fmt.Println("GroupID:", gm.GroupID)

		if _, exists := grouped[gm.GroupID]; !exists {
			grouped[gm.GroupID] = map[string]interface{}{
				"ID":       gm.Group.ID,
				"Name":     gm.Group.Name,
				"MinQty":   gm.Group.MinQty,
				"MaxQty":   gm.Group.MaxQty,
				"Modifier": []map[string]interface{}{},
			}
		}

		// Kiểm tra xem trường "Modifier" có tồn tại và không phải là nil
		if _, ok := grouped[gm.GroupID]["Modifier"].([]map[string]interface{}); ok {
			grouped[gm.GroupID]["Modifier"] = append(
				grouped[gm.GroupID]["Modifier"].([]map[string]interface{}),
				map[string]interface{}{
					"ID":       gm.Modifier.ID,
					"Name":     gm.Modifier.Name,
					"Price":    gm.Modifier.Price,
					"Currency": gm.Modifier.Currency,
					"Default":  gm.Default, // Thêm trường Default từ GroupModifier
				},
			)
		} else {
			// Nếu Modifier là nil hoặc không tồn tại, khởi tạo slice mới
			grouped[gm.GroupID]["Modifier"] = []map[string]interface{}{
				{
					"ID":       gm.Modifier.ID,
					"Name":     gm.Modifier.Name,
					"Price":    gm.Modifier.Price,
					"Currency": gm.Modifier.Currency,
					"Default":  gm.Default, // Thêm trường Default từ GroupModifier
				},
			}
		}
	}

	// Sử dụng hàm tiện ích để in ra JSON
	utils.PrintPrettyJSON(grouped)

	// Chuyển map thành một slice để trả về
	var response []map[string]interface{}
	for _, group := range grouped {
		response = append(response, group)
	}

	// c.JSON(http.StatusOK, gin.H{"data": response})
	c.JSON(http.StatusOK, response)
}

func UpdateGroupModifiers(c *gin.Context) {
	id := c.Param("id")
	var group models.Group

	// Tìm Group cần cập nhật
	if err := models.DB.Where("id = ?", id).First(&group).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
		return
	}

	// Nhận dữ liệu từ request body
	var input GroupModifierInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Cập nhật thông tin của Group
	group.Name = input.Name
	group.MinQty = input.MinQty
	group.MaxQty = input.MaxQty

	if err := models.DB.Save(&group).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Xóa tất cả các GroupModifier hiện tại liên kết với Group
	if err := models.DB.Where("group_id = ?", group.ID).Delete(&models.GroupModifier{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete existing GroupModifiers"})
		return
	}

	// Tạo lại các GroupModifier theo dữ liệu mới
	for _, modifier := range input.Modifiers {
		groupModifier := models.GroupModifier{
			GroupID:    int(group.ID),    // Chuyển đổi từ uint sang int nếu cần
			ModifierID: int(modifier.ID), // Sử dụng ID của Modifier từ dữ liệu đầu vào
			Default:    modifier.Default,
		}
		if err := models.DB.Create(&groupModifier).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create GroupModifier"})
			return
		}
	}

	c.JSON(http.StatusOK, group)
}

func DeleteGroupModifier(c *gin.Context) {
	id := c.Param("id")
	var group models.Group

	// Tìm Group cần xóa
	if err := models.DB.Where("id = ?", id).First(&group).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
		return
	}

	// Xóa tất cả các GroupModifier liên kết với Group
	if err := models.DB.Where("group_id = ?", group.ID).Delete(&models.GroupModifier{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete related GroupModifiers"})
		return
	}

	// Xóa tất cả các ProductGroup liên kết với Group
	if err := models.DB.Where("group_id = ?", group.ID).Delete(&models.ProductGroup{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete related ProductGroups"})
		return
	}

	// Xóa Group
	if err := models.DB.Delete(&group).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete Group"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Group and related records deleted successfully"})
}
