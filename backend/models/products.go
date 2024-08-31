package models

import (
	"gorm.io/gorm"
)

// Product model
type Product struct {
	gorm.Model
	Name              string            `json:"name"`
	Description       string            `json:"description"`
	Type              string            `json:"type"`
	Currency          string            `json:"currency"`
	Price             float64           `json:"price"`
	Roasted           string            `json:"roasted"`
	ImageLinkSquare   string            `json:"image_link_square"`
	ImageLinkPortrait string            `json:"image_link_portrait"`
	Ingredients       string            `json:"ingredients"`
	SpecialIngredient string            `json:"special_ingredient"`
	Discount          float64           `json:"discount"`
	AverageRating     float64           `json:"average_rating"`
	RatingsCount      string            `json:"ratings_count"`
	Favourite         bool              `json:"favourite"`
	ProductGroups     []ProductGroup    `json:"product_groups" gorm:"foreignKey:ProductID"`
	ProductTempsSizes []ProductTempSize `json:"product_temp_sizes" gorm:"foreignKey:ProductID"`
	ProductCategory   []ProductCategory `json:"product_category" gorm:"foreignKey:ProductID"`
}

// ProductGroup model
type ProductGroup struct {
	gorm.Model
	ProductID int   `json:"product_id"`
	GroupID   int   `json:"group_id"`
	Type      bool  `json:"type"`
	Group     Group `json:"group" gorm:"foreignKey:GroupID"`
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
	Temperature   Temperature `json:"temperature" gorm:"foreignKey:TemperatureID"`
	Size          Size        `json:"size" gorm:"foreignKey:SizeID"`
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

// ProductCategory model
type ProductCategory struct {
	gorm.Model
	ProductID  int      `json:"product_id"`
	CategoryID int      `json:"category_id"`
	Product    Product  `gorm:"foreignKey:ProductID"`
	Category   Category `gorm:"foreignKey:CategoryID"`
}

// Category model
type Category struct {
	gorm.Model
	Name            string            `json:"name"`
	ProductCategory []ProductCategory `json:"product_category" gorm:"foreignKey:CategoryID"`
}

/// menu
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
	Name              string          `json:"name"`
	Price             float64         `json:"price"`
	Currency          string          `json:"currency"`
	Discount          float64         `json:"discount"`
	ImageLinkSquare   string          `json:"image_link_square"`
	ImageLinkPortrait string          `json:"image_link_portrait"`
	Type              string          `json:"type"`
	AverageRating     float64         `json:"average_rating"`
	RatingsCount      string          `json:"ratings_count"`
	Favourite         bool            `json:"favourite"`
	Categories        []ComboCategory `json:"categories" gorm:"foreignKey:ComboID"`
	ProductCombos     []ProductCombo  `json:"product_combos" gorm:"foreignKey:ComboID"`
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
	Name     string    `json:"name"`
	Image    string    `json:"image"`
	Products []Product `json:"products" gorm:"many2many:menu_products;"`
	Combos   []Combo   `json:"combos" gorm:"many2many:menu_combos;"`
}
