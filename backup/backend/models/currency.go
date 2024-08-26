package models

import "gorm.io/gorm"

type Currency struct {
	gorm.Model
	Name   string `json:"name"`
	Symbol string `json:"symbol"`
	Code   string `json:"code"`
}
