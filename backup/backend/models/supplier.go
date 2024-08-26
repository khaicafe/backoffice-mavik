package models

import "gorm.io/gorm"

type Supplier struct {
	gorm.Model
	Name       string `json:"name"`
	SupplierID uint   `json:"supplier_id"`
}
