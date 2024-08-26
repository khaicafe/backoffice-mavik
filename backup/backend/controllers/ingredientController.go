package controllers

import (
	"icecream-manager-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

// CreateIngredient creates a new ingredient
func CreateIngredient(c *gin.Context) {
	var input struct {
		Name              string  `json:"name"`
		Description       string  `json:"description"`
		SupplierID        uint    `json:"supplier_id"`
		BrandID           uint    `json:"brand_id"`
		SupplierSKUCode   string  `json:"supplier_sku_code"`
		FlavourNoteIDs    []uint  `json:"flavour_note_ids"`
		Organic           bool    `json:"organic"`
		Vegan             bool    `json:"vegan"`
		Price             float64 `json:"price"`
		CurrencyType      string  `json:"currency_type"`
		MeasurementID     uint    `json:"measurement_id"`
		MeasurementAmount float64 `json:"measurement_amount"`
		TotalGram         float64 `json:"total_gram"`
		Yield             float64 `json:"yield"`
		Notes             string  `json:"notes"`
		Fat               float64 `json:"fat"`
		Sugar             float64 `json:"sugar"`
		MSNF              float64 `json:"msnf"`
		OtherSolids       float64 `json:"other_solids"`
		TotalSolids       float64 `json:"total_solids"`
		TotalWater        float64 `json:"total_water"`
		Cost              float64 `json:"cost"`
		POD               float64 `json:"pod"`
		PAC               float64 `json:"pac"`
		GI                float64 `json:"gi"`
		ChangedBy         string  `json:"changed_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var flavourNotes []models.FlavourNote
	if err := models.DB.Where("ID IN (?)", input.FlavourNoteIDs).Find(&flavourNotes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ingredient := models.Ingredient{
		Name:              input.Name,
		Description:       input.Description,
		SupplierID:        input.SupplierID,
		BrandID:           input.BrandID,
		SupplierSKUCode:   input.SupplierSKUCode,
		FlavourNotes:      flavourNotes,
		Organic:           input.Organic,
		Vegan:             input.Vegan,
		Price:             input.Price,
		CurrencyType:      input.CurrencyType,
		MeasurementID:     input.MeasurementID,
		MeasurementAmount: input.MeasurementAmount,
		TotalGram:         input.TotalGram,
		Yield:             input.Yield,
		Notes:             input.Notes,
		Fat:               input.Fat,
		Sugar:             input.Sugar,
		MSNF:              input.MSNF,
		OtherSolids:       input.OtherSolids,
		TotalSolids:       input.TotalSolids,
		TotalWater:        input.TotalWater,
		Cost:              input.Cost,
		POD:               input.POD,
		PAC:               input.PAC,
		GI:                input.GI,
		ChangedBy:         input.ChangedBy,
	}

	if err := models.DB.Create(&ingredient).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ingredient})
}

// GetIngredientByID gets an ingredient by ID
func GetIngredientByID(c *gin.Context) {
	var ingredient models.Ingredient
	if err := models.DB.Preload("FlavourNotes").Preload("PriceHistorys").Where("id = ?", c.Param("id")).First(&ingredient).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ingredient not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ingredient})
}

// GetAllIngredients gets all ingredients
func GetAllIngredients(c *gin.Context) {
	var ingredients []models.Ingredient

	if err := models.DB.Debug().Model(&models.Ingredient{}).Preload("FlavourNotes").Preload("PriceHistorys").Preload("Measurement").Find(&ingredients).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ingredients})
}

// UpdateIngredient updates an ingredient
func UpdateIngredient(c *gin.Context) {
	var input struct {
		Name              string  `json:"name"`
		Description       string  `json:"description"`
		SupplierID        uint    `json:"supplier_id"`
		BrandID           uint    `json:"brand_id"`
		SupplierSKUCode   string  `json:"supplier_sku_code"`
		FlavourNoteIDs    []uint  `json:"flavour_note_ids"`
		Organic           bool    `json:"organic"`
		Vegan             bool    `json:"vegan"`
		Price             float64 `json:"price"`
		CurrencyType      string  `json:"currency_type"`
		MeasurementID     uint    `json:"measurement_id"`
		MeasurementAmount float64 `json:"measurement_amount"`
		TotalGram         float64 `json:"total_gram"`
		Yield             float64 `json:"yield"`
		Notes             string  `json:"notes"`
		Fat               float64 `json:"fat"`
		Sugar             float64 `json:"sugar"`
		MSNF              float64 `json:"msnf"`
		OtherSolids       float64 `json:"other_solids"`
		TotalSolids       float64 `json:"total_solids"`
		TotalWater        float64 `json:"total_water"`
		Cost              float64 `json:"cost"`
		POD               float64 `json:"pod"`
		PAC               float64 `json:"pac"`
		GI                float64 `json:"gi"`
		ChangedBy         string  `json:"changed_by"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var ingredient models.Ingredient
	if err := models.DB.Where("ID = ?", c.Param("id")).First(&ingredient).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ingredient not found"})
		return
	}

	var flavourNotes []models.FlavourNote
	if err := models.DB.Where("ID IN (?)", input.FlavourNoteIDs).Find(&flavourNotes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Record price history if the price has changed
	if ingredient.Price != input.Price {
		if err := models.CreatePriceHistory(models.DB, ingredient.ID, ingredient.Price, input.Price, input.ChangedBy); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	ingredient.Name = input.Name
	ingredient.Description = input.Description
	ingredient.SupplierID = input.SupplierID
	ingredient.BrandID = input.BrandID
	ingredient.SupplierSKUCode = input.SupplierSKUCode
	ingredient.FlavourNotes = flavourNotes
	ingredient.Organic = input.Organic
	ingredient.Vegan = input.Vegan
	ingredient.Price = input.Price
	ingredient.CurrencyType = input.CurrencyType
	ingredient.MeasurementID = input.MeasurementID
	ingredient.MeasurementAmount = input.MeasurementAmount
	ingredient.TotalGram = input.TotalGram
	ingredient.Yield = input.Yield
	ingredient.Notes = input.Notes
	ingredient.Fat = input.Fat
	ingredient.Sugar = input.Sugar
	ingredient.MSNF = input.MSNF
	ingredient.OtherSolids = input.OtherSolids
	ingredient.TotalSolids = input.TotalSolids
	ingredient.TotalWater = input.TotalWater
	ingredient.Cost = input.Cost
	ingredient.POD = input.POD
	ingredient.PAC = input.PAC
	ingredient.GI = input.GI
	ingredient.ChangedBy = input.ChangedBy

	if err := models.DB.Save(&ingredient).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ingredient})
}

// DeleteIngredient deletes an ingredient
func DeleteIngredient(c *gin.Context) {
	var ingredient models.Ingredient
	if err := models.DB.Where("ID = ?", c.Param("id")).First(&ingredient).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Ingredient not found"})
		return
	}

	if err := models.DB.Delete(&ingredient).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": true})
}

// GetIngredients retrieves ingredients with optional filters
func GetIngredients(c *gin.Context) {
	var ingredients []models.Ingredient
	query := models.DB.Preload("FlavourNotes").Preload("PriceHistorys").Preload("Measurement")

	// Apply optional filters
	if c.Query("type") != "" {
		query = query.Where("type = ?", c.Query("type"))
	}
	if c.Query("flavour_notes") != "" {
		flavourNoteIDs := c.QueryArray("flavour_notes")
		query = query.Joins("JOIN ingredient_flavour_notes on ingredients.ID = ingredient_flavour_notes.ingredient_id").
			Where("ingredient_flavour_notes.flavour_note_id IN ?", flavourNoteIDs)
	}

	if err := query.Find(&ingredients).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ingredients})
}

// SearchIngredients searches for ingredients by name or description
func SearchIngredients(c *gin.Context) {
	var ingredients []models.Ingredient
	searchTerm := c.Query("search_term")

	if err := models.DB.Preload("FlavourNotes").Where("name LIKE ? OR description LIKE ?", "%"+searchTerm+"%", "%"+searchTerm+"%").Find(&ingredients).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": ingredients})
}
