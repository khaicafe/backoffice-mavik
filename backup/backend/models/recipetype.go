package models

import "gorm.io/gorm"

type RecipeType struct {
	gorm.Model
	Name string `json:"name"`
}
