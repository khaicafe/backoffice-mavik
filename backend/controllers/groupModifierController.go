package controllers

import (
	"mavik-backend/models"
	"mavik-backend/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateGroup - Tạo mới Group
func CreateGroup(c *gin.Context) {
	var group models.Group
	if err := c.ShouldBindJSON(&group); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := models.DB.Create(&group).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, group)
}

// GetGroups - Lấy danh sách tất cả các Group
func GetGroups(c *gin.Context) {
	var groups []models.Group
	if err := models.DB.Find(&groups).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, groups)
}

// GetGroupByID - Lấy thông tin chi tiết của Group theo ID
func GetGroupByID(c *gin.Context) {
	id := c.Param("id")
	var group models.Group
	if err := models.DB.Where("id = ?", id).First(&group).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
		return
	}
	c.JSON(http.StatusOK, group)
}

// UpdateGroup - Cập nhật thông tin Group theo ID
func UpdateGroup(c *gin.Context) {
	id := c.Param("id")
	var group models.Group
	if err := models.DB.Where("id = ?", id).First(&group).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Group not found"})
		return
	}

	if err := c.ShouldBindJSON(&group); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := models.DB.Save(&group).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, group)
}

// DeleteGroup - Xóa Group theo ID
func DeleteGroup(c *gin.Context) {
	id := c.Param("id")
	if err := models.DB.Delete(&models.Group{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Group deleted"})
}

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

// type GroupModifierInput struct {
// 	Name        string `json:"name"`
// 	MinQty      int    `json:"min_qty"`
// 	MaxQty      int    `json:"max_qty"`
// 	ModifierIDs []uint `json:"modifier_ids"`
// }

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
		if _, exists := grouped[gm.GroupID]; !exists {
			grouped[gm.GroupID] = map[string]interface{}{
				"ID":       gm.Group.ID,
				"Name":     gm.Group.Name,
				"MinQty":   gm.Group.MinQty,
				"MaxQty":   gm.Group.MaxQty,
				"Modifier": []map[string]interface{}{},
			}
		}

		grouped[gm.GroupID]["Modifier"] = append(grouped[gm.GroupID]["Modifier"].([]map[string]interface{}), map[string]interface{}{
			"ID":       gm.Modifier.ID,
			"Name":     gm.Modifier.Name,
			"Price":    gm.Modifier.Price,
			"Currency": gm.Modifier.Currency,
			"Default":  gm.Default, // Thêm trường Default từ GroupModifier
		})
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
