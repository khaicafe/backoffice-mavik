package models

import "gorm.io/gorm"

// ProductCombo model
type ProductCombo struct {
	gorm.Model
	ProductID int     `json:"product_id"`
	ComboID   int     `json:"combo_id"`
	Qty       int     `json:"qty"`
	Price     float64 `json:"price"`
	Product   Product `gorm:"foreignKey:ProductID"`
	Combo     Combo   `gorm:"foreignKey:ComboID"`
}

// Combo model
type Combo struct {
	gorm.Model
	Name          string          `json:"name"`
	Price         float64         `json:"price"`
	Menus         []Menu          `json:"menus" gorm:"foreignKey:ComboID"`
	Categories    []ComboCategory `json:"categories" gorm:"foreignKey:ComboID"`
	ProductCombos []ProductCombo  `json:"product_combos" gorm:"foreignKey:ComboID"`
}

// ComboCategory model
type ComboCategory struct {
	gorm.Model
	CategoryID int      `json:"category_id"`
	ComboID    int      `json:"combo_id"`
	Category   Category `gorm:"foreignKey:CategoryID"`
	Combo      Combo    `gorm:"foreignKey:ComboID"`
}

// Menu model
type Menu struct {
	gorm.Model
	Name      string  `json:"name"`
	ComboID   int     `json:"combo_id"`
	ProductID int     `json:"product_id"`
	Combo     Combo   `gorm:"foreignKey:ComboID"`
	Product   Product `gorm:"foreignKey:ProductID"`
}
