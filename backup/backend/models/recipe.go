package models

import "gorm.io/gorm"

type Recipe struct {
	gorm.Model
	Name              string             `json:"name"`
	RecipeTypeID      uint               `json:"recipe_type_id"`
	RecipeType        RecipeType         `gorm:"foreignKey:RecipeTypeID;references:ID" json:"recipe_type"`
	FlavourNotes      []FlavourNote      `gorm:"many2many:recipe_flavour_notes" json:"flavour_notes"`
	LocationMade      string             `json:"location_made"`
	Overrun           float64            `json:"overrun"`
	Flavour           string             `json:"flavour"`
	Description       string             `json:"description"`
	AmountToMake      float64            `json:"amount_to_make"`
	Date              string             `json:"date"`
	Ingredients       []Ingredient       `gorm:"many2many:recipe_ingredients" json:"ingredients"`
	RecipeIngredients []RecipeIngredient `gorm:"foreignKey:RecipeID" json:"recipe_ingredients"`
}

type RecipeIngredient struct {
	RecipeID     uint       `gorm:"primaryKey" json:"recipe_id"`
	IngredientID uint       `gorm:"primaryKey" json:"ingredient_id"`
	Quantity     float64    `json:"quantity"` // Additional field for quantity
	Recipe       Recipe     `gorm:"foreignKey:RecipeID" json:"-"`
	Ingredient   Ingredient `gorm:"foreignKey:IngredientID" json:"ingredient"`
	Variegate    bool       `gorm:"primaryKey" json:"variegate"`
}
