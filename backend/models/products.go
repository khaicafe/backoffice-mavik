package models

import (
	"gorm.io/gorm"
)

// Product model
type Product struct {
	gorm.Model
	Name              string              `json:"name"`
	Description       string              `json:"description"`
	Roasted           string              `json:"roasted"`
	ImageLinkSquare   string              `json:"image_link_square"`
	ImageLinkPortrait string              `json:"image_link_portrait"`
	Ingredients       string              `json:"ingredients"`
	SpecialIngredient string              `json:"special_ingredient"`
	Discount          float64             `json:"discount"`
	AverageRating     float64             `json:"average_rating"`
	RatingsCount      string              `json:"ratings_count"`
	Favourite         bool                `json:"favourite"`
	ProductGroups     []ProductGroup      `json:"product_groups" gorm:"foreignKey:ProductID"`
	ProductTempsSizes []ProductTempSize   `json:"product_temp_sizes" gorm:"foreignKey:ProductID"`
	ProductCategories []ProductCategories `json:"product_categories" gorm:"foreignKey:ProductID"`
}

// ProductGroup model
type ProductGroup struct {
	gorm.Model
	ProductID int     `json:"product_id"`
	GroupID   int     `json:"group_id"`
	Type      bool    `json:"type"`
	Product   Product `gorm:"foreignKey:ProductID"`
	Group     Group   `gorm:"foreignKey:GroupID"`
}

// ProductTemperatureSize model
type ProductTempSize struct {
	gorm.Model
	TemperatureID int         `json:"temperature_id"`
	SizeID        int         `json:"size_id"`
	ProductID     int         `json:"product_id"`
	Price         float64     `json:"price"`
	Currency      string      `json:"currency"`
	Default       bool        `json:"default"`
	Product       Product     `gorm:"foreignKey:ProductID"`
	Temperature   Temperature `gorm:"foreignKey:TemperatureID"`
	Size          Size        `gorm:"foreignKey:SizeID"`
}

// Temperature model
type Temperature struct {
	gorm.Model
	Name              string            `json:"name"`
	ProductTempsSizes []ProductTempSize `json:"product_temp_sizes" gorm:"foreignKey:TemperatureID"`
}

// Size model
type Size struct {
	gorm.Model
	Name              string            `json:"name"`
	ProductTempsSizes []ProductTempSize `json:"product_temp_sizes" gorm:"foreignKey:SizeID"`
}

// Group model
type Group struct {
	gorm.Model
	Name           string          `json:"name"`
	MinQty         int             `json:"min_qty"`
	MaxQty         int             `json:"max_qty"`
	ProductGroups  []ProductGroup  `json:"product_groups" gorm:"foreignKey:GroupID"`
	GroupModifiers []GroupModifier `json:"group_modifiers" gorm:"foreignKey:GroupID"`
}

// GroupModifier model
type GroupModifier struct {
	gorm.Model
	GroupID    int      `json:"group_id"`
	ModifierID int      `json:"modifier_id"`
	Default    bool     `json:"default"`
	Group      Group    `gorm:"foreignKey:GroupID"`
	Modifier   Modifier `gorm:"foreignKey:ModifierID"`
}

// Modifier model
type Modifier struct {
	gorm.Model
	Name           string          `json:"name"`
	Price          float64         `json:"price"`
	Currency       string          `json:"currency"`
	GroupModifiers []GroupModifier `json:"group_modifiers" gorm:"foreignKey:ModifierID"`
}

// ProductCategories model
type ProductCategories struct {
	gorm.Model
	ProductID    int        `json:"product_id"`
	CategoriesID int        `json:"categories_id"`
	Product      Product    `gorm:"foreignKey:ProductID"`
	Categories   Categories `gorm:"foreignKey:CategoriesID"`
}

// Categories model
type Categories struct {
	gorm.Model
	Name              string              `json:"name"`
	ProductCategories []ProductCategories `json:"product_categories" gorm:"foreignKey:CategoriesID"`
}
