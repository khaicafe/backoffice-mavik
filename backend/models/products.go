package models

import (
	"gorm.io/gorm"
)

type Product struct {
	gorm.Model
	Name              string            `json:"name"`
	Description       string            `json:"description"`
	Roasted           string            `json:"roasted"`
	ImageLinkSquare   string            `json:"imagelink_square"`
	ImageLinkPortrait string            `json:"imagelink_portrait"`
	Ingredients       string            `json:"ingredients"`
	SpecialIngredient string            `json:"special_ingredient"`
	Discount          float64           `json:"discount"`
	AverageRating     float64           `json:"average_rating"`
	RatingsCount      string            `json:"ratings_count"`
	Favourite         bool              `json:"favourite"`
	Type              string            `json:"type"`
	Index             int               `json:"index"`
	ProductOptions    []ProductOption   `json:"product_options" gorm:"foreignKey:ProductID"`
	ProductModifiers  []ProductModifier `json:"product_modifiers" gorm:"foreignKey:ProductID"`
}
type Temperature struct {
	gorm.Model
	Name string `json:"name"`
}

type SizeOption struct {
	gorm.Model
	Name string `json:"name"`
}

type TemperatureSize struct {
	gorm.Model
	TemperatureID uint        `json:"temperature_id"`
	SizeOptionID  uint        `json:"size_option_id"`
	Price         float64     `json:"price"`
	Currency      string      `json:"currency"`
	Default       bool        `json:"default"`
	Temperature   Temperature `json:"temperature" gorm:"foreignKey:TemperatureID"`
	SizeOption    SizeOption  `json:"size_option" gorm:"foreignKey:SizeOptionID"`
}

type ProductOption struct {
	gorm.Model
	ProductID         uint            `json:"product_id"`
	TemperatureSizeID uint            `json:"temperature_size_id"`
	Default           bool            `json:"default"`
	TemperatureSize   TemperatureSize `json:"temperature_size" gorm:"foreignKey:TemperatureSizeID"`
}

type ProductModifier struct {
	gorm.Model
	ProductID  uint     `json:"product_id"` // Foreign key reference to Product
	MinQty     int      `json:"min_qty"`
	MaxQty     int      `json:"max_qty"`
	Default    bool     `json:"default"`
	ModifierID uint     `json:"modifier_id"` // Foreign key reference to Modifier
	Modifier   Modifier `json:"modifier" gorm:"foreignKey:ModifierID"`
}

type Modifier struct {
	gorm.Model
	Name     string  `json:"name"`
	Price    float64 `json:"price"`
	Currency string  `json:"currency"`
}
