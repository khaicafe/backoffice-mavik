package models

import "gorm.io/gorm"

type Image struct {
	gorm.Model
	FileName string
	FilePath string
	URL      string
}
