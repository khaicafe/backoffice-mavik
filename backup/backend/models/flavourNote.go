package models

import "gorm.io/gorm"

type FlavourNote struct {
	gorm.Model
	Name string `json:"name"`
}
