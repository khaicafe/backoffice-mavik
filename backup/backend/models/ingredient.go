package models

import "gorm.io/gorm"

type Ingredient struct {
	gorm.Model
	Name              string         `json:"name"`
	Description       string         `json:"description"`
	SupplierID        uint           `json:"supplier_id"`
	BrandID           uint           `json:"brand_id"`
	SupplierSKUCode   string         `json:"supplier_sku_code"`
	FlavourNotes      []FlavourNote  `json:"flavour_notes" gorm:"many2many:ingredient_flavour_notes;"`
	Organic           bool           `json:"organic"`
	Vegan             bool           `json:"vegan"`
	Price             float64        `json:"price"`
	CurrencyType      string         `json:"currency_type"`
	MeasurementID     uint           `json:"measurement_id"`
	Measurement       Measurement    `json:"measurement" gorm:"foreignKey:MeasurementID;references:ID" `
	MeasurementAmount float64        `json:"measurement_amount"`
	TotalGram         float64        `json:"total_gram"`
	Yield             float64        `json:"yield"`
	Notes             string         `json:"notes"`
	Fat               float64        `json:"fat"`
	Sugar             float64        `json:"sugar"`
	MSNF              float64        `json:"msnf"`
	OtherSolids       float64        `json:"other_solids"`
	TotalSolids       float64        `json:"total_solids"`
	TotalWater        float64        `json:"total_water"`
	Cost              float64        `json:"cost"`
	POD               float64        `json:"pod"`
	PAC               float64        `json:"pac"`
	GI                float64        `json:"gi"`
	ChangedBy         string         `json:"changed_by"`
	PriceHistorys     []PriceHistory `json:"price_historys" gorm:"foreignKey:IngredientID"`
}
