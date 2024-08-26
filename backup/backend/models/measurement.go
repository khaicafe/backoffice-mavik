package models

import "gorm.io/gorm"

type Measurement struct {
	gorm.Model
	Name   string  `json:"name"`
	Symbol string  `json:"symbol"`
	ToGram float64 `json:"to_gram"`
}
