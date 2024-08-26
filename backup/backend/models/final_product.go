package models

import (
	"gorm.io/gorm"
)

type FinalProduct struct {
	gorm.Model
	RecipeID uint      `json:"recipe_id"`
	Recipe   Recipe    `gorm:"foreignKey:RecipeID" json:"recipe"`
	Quantity float64   `json:"quantity"`
	Unit     string    `json:"unit"` // "metric" or "imperial"
	Steps    []Step    `json:"steps" gorm:"foreignKey:FinalProductID"`
	Notes    string    `json:"notes"`
	Comments []Comment `json:"comments" gorm:"foreignKey:FinalProductID"`
}

type Step struct {
	gorm.Model
	FinalProductID uint   `json:"final_product_id"`
	Description    string `json:"description"`
	Order          int    `json:"order"`
}

type Comment struct {
	gorm.Model
	FinalProductID uint   `json:"final_product_id"`
	Content        string `json:"content"`
	Author         string `json:"author"`
}
