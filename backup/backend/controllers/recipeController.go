package controllers

import (
	"fmt"
	"net/http"
	"strconv"

	"icecream-manager-backend/models"

	"github.com/gin-gonic/gin"
)

// parseNumber attempts to convert an interface{} to a float64.
// It handles various types including float64, string, int, int64, and uint.
func parseNumber(value interface{}) (float64, error) {
	switch v := value.(type) {
	case float64:
		return v, nil
	case string:
		return strconv.ParseFloat(v, 64)
	case int:
		return float64(v), nil
	case int64:
		return float64(v), nil
	case uint:
		return float64(v), nil
	case uint64:
		return float64(v), nil
	default:
		return 0, fmt.Errorf("unable to convert %T to float64", v)
	}
}

// CreateRecipe handles the creation of a new recipe
func CreateRecipe(c *gin.Context) {
	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Initialize an empty Recipe struct
	var recipe models.Recipe

	// Parse and validate the name
	if name, ok := input["name"].(string); ok {
		recipe.Name = name
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid name"})
		return
	}

	// Parse and validate the RecipeTypeID
	if typeID, ok := parseNumber(input["recipe_type_id"]); ok == nil {
		recipe.RecipeTypeID = uint(typeID)
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid recipe_type_id"})
		return
	}

	// Load RecipeType from the database
	var recipeType models.RecipeType
	if err := models.DB.First(&recipeType, recipe.RecipeTypeID).Error; err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid recipe type ID"})
		return
	}
	recipe.RecipeTypeID = recipeType.ID

	// Parse and validate FlavourNotes
	if flavourNoteIDs, ok := input["flavour_notes"].([]interface{}); ok {
		var flavourNotes []models.FlavourNote
		for _, id := range flavourNoteIDs {
			if idFloat, ok := id.(float64); ok {
				var flavourNote models.FlavourNote
				if err := models.DB.First(&flavourNote, uint(idFloat)).Error; err == nil {
					flavourNotes = append(flavourNotes, flavourNote)
				} else {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid flavour note ID"})
					return
				}
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid flavour note ID format"})
				return
			}
		}
		recipe.FlavourNotes = flavourNotes
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid flavour_notes"})
		return
	}

	// Parse and validate LocationMade
	if locationMade, ok := input["location_made"].(string); ok {
		recipe.LocationMade = locationMade
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid location_made"})
		return
	}

	// Parse and validate Overrun
	if overrun, ok := input["overrun"].(interface{}); ok {
		if parsedOverrun, err := parseNumber(overrun); err == nil {
			recipe.Overrun = parsedOverrun
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid overrun value"})
			return
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing overrun"})
		return
	}

	// Parse and validate Flavour
	if flavour, ok := input["flavour"].(string); ok {
		recipe.Flavour = flavour
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid flavour"})
		return
	}

	// Parse and validate Description
	if description, ok := input["description"].(string); ok {
		recipe.Description = description
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid description"})
		return
	}

	// Parse and validate AmountToMake
	if amountToMake, ok := input["amount_to_make"].(interface{}); ok {
		if parsedAmountToMake, err := parseNumber(amountToMake); err == nil {
			recipe.AmountToMake = parsedAmountToMake
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid amount_to_make value"})
			return
		}
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing amount_to_make"})
		return
	}

	// Parse and validate Date
	if date, ok := input["date"].(string); ok {
		recipe.Date = date
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date"})
		return
	}

	// Parse and validate Ingredients
	if ingredientsInput, ok := input["ingredients"].([]interface{}); ok {
		var ingredients []models.RecipeIngredient
		for _, ing := range ingredientsInput {
			// Each ingredient should be a map containing "id" and "quantity"
			if ingMap, ok := ing.(map[string]interface{}); ok {
				id, idOk := ingMap["id"].(float64)
				quantity, quantityOk := ingMap["quantity"].(float64)
				variegate, variegateOk := ingMap["variegate"].(bool)

				if !idOk || !quantityOk || !variegateOk {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ingredient data"})
					return
				}

				var ingredient models.Ingredient
				if err := models.DB.First(&ingredient, uint(id)).Error; err == nil {
					recipeIngredient := models.RecipeIngredient{
						IngredientID: uint(id),
						Quantity:     quantity,
						Variegate:    variegate,
					}
					ingredients = append(ingredients, recipeIngredient)
				} else {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ingredient ID"})
					return
				}
			} else {
				c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ingredient format"})
				return
			}
		}
		recipe.RecipeIngredients = ingredients
	} else {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ingredients input"})
		return
	}
	// Create the recipe in the database
	if err := models.DB.Create(&recipe).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"recipe": recipe})
}

// UpdateRecipe handles updating an existing recipe
func UpdateRecipe(c *gin.Context) {
	var input map[string]interface{}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var recipe models.Recipe
	if err := models.DB.First(&recipe, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}

	// Update each field similarly to CreateRecipe
	if name, ok := input["name"].(string); ok {
		recipe.Name = name
	}

	if typeID, ok := input["type_id"].(float64); ok {
		recipe.RecipeTypeID = uint(typeID)
		// Update RecipeType association
		var recipeType models.RecipeType
		if err := models.DB.First(&recipeType, recipe.RecipeTypeID).Error; err == nil {
			recipe.RecipeTypeID = recipeType.ID
		}
	}

	if flavourNoteIDs, ok := input["flavour_notes"].([]interface{}); ok {
		var flavourNotes []models.FlavourNote
		for _, id := range flavourNoteIDs {
			if idFloat, ok := id.(float64); ok {
				var flavourNote models.FlavourNote
				if err := models.DB.First(&flavourNote, uint(idFloat)).Error; err == nil {
					flavourNotes = append(flavourNotes, flavourNote)
				}
			}
		}
		recipe.FlavourNotes = flavourNotes
	}

	if locationMade, ok := input["location_made"].(string); ok {
		recipe.LocationMade = locationMade
	}

	if overrun, ok := input["overrun"].(interface{}); ok {
		if parsedOverrun, err := parseNumber(overrun); err == nil {
			recipe.Overrun = parsedOverrun
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid overrun value"})
			return
		}
	}

	if flavour, ok := input["flavour"].(string); ok {
		recipe.Flavour = flavour
	}

	if description, ok := input["description"].(string); ok {
		recipe.Description = description
	}

	if amountToMake, ok := input["amount_to_make"].(interface{}); ok {
		if parsedAmountToMake, err := parseNumber(amountToMake); err == nil {
			recipe.AmountToMake = parsedAmountToMake
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid amount_to_make value"})
			return
		}
	}

	if date, ok := input["date"].(string); ok {
		recipe.Date = date
	}

	// Delete existing ingredients to avoid duplicates
	if err := models.DB.Where("recipe_id = ?", recipe.ID).Delete(&models.RecipeIngredient{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if inputIngredients, ok := input["ingredients"].([]interface{}); ok {
		var ingredients []models.RecipeIngredient
		for _, ing := range inputIngredients {
			if ingMap, ok := ing.(map[string]interface{}); ok {
				id, idOk := ingMap["id"].(float64)
				quantity, quantityOk := ingMap["quantity"].(float64)
				variegate, variegateOk := ingMap["variegate"].(bool)

				if !idOk || !quantityOk || !variegateOk {
					c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ingredient data"})
					return
				}
				var ingredient models.Ingredient
				if err := models.DB.First(&ingredient, uint(id)).Error; err == nil {

					recipeIngredient := models.RecipeIngredient{
						RecipeID:     recipe.ID,
						IngredientID: uint(id),
						Quantity:     quantity,
						Variegate:    variegate,
					}
					ingredients = append(ingredients, recipeIngredient)
				}
				// if err := models.DB.Create(&recipeIngredient).Error; err != nil {
				// 	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
				// 	return
				// }
			}
		}
		recipe.RecipeIngredients = ingredients
	}

	// Save the updated recipe
	if err := models.DB.Save(&recipe).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Add updated ingredients with quantities
	// for _, ingredientInput := range input.Ingredients {
	//     recipeIngredient := models.RecipeIngredient{
	//         RecipeID:     recipe.ID,
	//         IngredientID: ingredientInput.ID,
	//         Quantity:     ingredientInput.Quantity,
	//     }
	//     if err := models.DB.Create(&recipeIngredient).Error; err != nil {
	//         c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
	//         return
	//     }
	// }

	c.JSON(http.StatusOK, gin.H{"recipe": recipe})
}

// GetRecipe handles retrieving a single recipe by ID
func GetRecipe(c *gin.Context) {
	var recipe models.Recipe
	if err := models.DB.Preload("RecipeType").Preload("FlavourNotes").Preload("Ingredients").Preload("RecipeIngredients").Preload("RecipeIngredients.Ingredient").First(&recipe, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"recipe": recipe})
}

// GetRecipes handles retrieving all recipes
func GetRecipes(c *gin.Context) {
	var recipes []models.Recipe
	if err := models.DB.Preload("RecipeType").Preload("FlavourNotes").Preload("Ingredients").Preload("RecipeIngredients").Preload("RecipeIngredients.Ingredient").Find(&recipes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"recipes": recipes})
}

// DeleteRecipe handles deleting a recipe by ID
func DeleteRecipe(c *gin.Context) {
	var recipe models.Recipe
	if err := models.DB.First(&recipe, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}

	if err := models.DB.Delete(&recipe).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"recipe": true})
}

// GetAllRecipes retrieves all recipes with related data
func GetAllRecipes(c *gin.Context) {
	var recipes []models.Recipe
	if err := models.DB.Preload("RecipeType").Preload("FlavourNotes").Preload("Ingredients").Preload("RecipeIngredients").Preload("RecipeIngredients.Ingredient").Find(&recipes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"recipes": recipes})
}

// GetRecipeById retrieves a recipe by its ID with related data
func GetRecipeById(c *gin.Context) {
	var recipe models.Recipe
	if err := models.DB.Preload("RecipeType").Preload("FlavourNotes").Preload("Ingredients").Preload("RecipeIngredients").Preload("RecipeIngredients.Ingredient").Preload("RecipeIngredients.Ingredient.Measurement").First(&recipe, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Recipe not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"recipe": recipe})
}

// Example of a search function with preload
func SearchRecipes(c *gin.Context) {
	var recipes []models.Recipe
	recipeType := c.Query("type")
	flavourNotes := c.QueryArray("flavour_notes")

	query := models.DB.Preload("RecipeType").Preload("FlavourNotes").Preload("RecipeIngredients").Preload("RecipeIngredients.Ingredient")

	if recipeType != "" {
		query = query.Where("recipe_type_id = ?", recipeType)
	}

	if len(flavourNotes) > 0 {
		query = query.Joins("JOIN recipe_flavour_notes ON recipe_flavour_notes.recipe_id = recipes.id").
			Where("recipe_flavour_notes.flavour_note_id IN (?)", flavourNotes).
			Group("recipes.id")
	}

	if err := query.Find(&recipes).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": recipes})
}
