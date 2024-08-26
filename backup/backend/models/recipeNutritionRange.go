package models

import "gorm.io/gorm"

type RecipeNutritionRange struct {
	gorm.Model
	Type           string  `json:"type"`
	SugarsMin      float64 `json:"sugars_min"`
	SugarsMax      float64 `json:"sugars_max"`
	FatMin         float64 `json:"fat_min"`
	FatMax         float64 `json:"fat_max"`
	MSNFMin        float64 `json:"msnf_min"`
	MSNFMax        float64 `json:"msnf_max"`
	OtherSolidsMin float64 `json:"other_solids_min"`
	OtherSolidsMax float64 `json:"other_solids_max"`
	TotalSolidsMin float64 `json:"total_solids_min"`
	TotalSolidsMax float64 `json:"total_solids_max"`
	TotalWaterMin  float64 `json:"total_water_min"`
	TotalWaterMax  float64 `json:"total_water_max"`
	PodMin         float64 `json:"pod_min"`
	PodMax         float64 `json:"pod_max"`
	PacMin         float64 `json:"pac_min"`
	PacMax         float64 `json:"pac_max"`
	GiMin          float64 `json:"gi_min"`
	GiMax          float64 `json:"gi_max"`
}
