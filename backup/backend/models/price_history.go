package models

import (
	"time"

	"gorm.io/gorm"
)

// PriceHistory represents a price change history
type PriceHistory struct {
	ID           uint      `json:"id" gorm:"primary_key"`
	IngredientID uint      `json:"ingredient_id"`
	OldPrice     float64   `json:"old_price"`
	NewPrice     float64   `json:"new_price"`
	ChangedBy    string    `json:"changed_by"`
	CreatedAt    time.Time `json:"created_at"`
}

// CreatePriceHistory creates a new price history record
func CreatePriceHistory(db *gorm.DB, ingredientID uint, oldPrice, newPrice float64, changedBy string) error {
	history := PriceHistory{
		IngredientID: ingredientID,
		OldPrice:     oldPrice,
		NewPrice:     newPrice,
		ChangedBy:    changedBy,
	}
	return db.Create(&history).Error
}
