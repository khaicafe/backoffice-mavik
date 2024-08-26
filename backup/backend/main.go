package main

import (
	"icecream-manager-backend/models"
	"icecream-manager-backend/routes"
	"log"

	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func init() {
	// var err error
	DB, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	// DB.LogMode(true)
	if err != nil {
		panic("failed to connect to database")
	}
	DB.SetupJoinTable(&models.Recipe{}, "Ingredient", &models.RecipeIngredient{})
	DB.AutoMigrate(
		&models.User{},
		&models.Ingredient{},
		&models.Recipe{},
		&models.FlavourNote{},
		&models.Supplier{},
		&models.Brand{},
		&models.Currency{},
		&models.Measurement{},
		&models.RecipeNutritionRange{},
		&models.RecipeType{},
		&models.PriceHistory{},
		&models.RecipeIngredient{},
	)

	models.DB = DB
	models.SeedingDefaultData(DB)
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// addSampleData()
	//defer models.DB.c

	r := routes.SetupRouter()

	r.Run(":8080")
}

// func addSampleData() {
// 	measurements := []models.Measurement{
// 		{Name: "Kilogram (kg)", Type: "Metric"},
// 		{Name: "Gram (g)", Type: "Metric"},
// 		{Name: "Litre(s) (l)", Type: "Metric"},
// 		{Name: "Milliliter (ml)", Type: "Metric"},
// 		{Name: "Pound (lb)", Type: "Imperial"},
// 		{Name: "Ounce (oz)", Type: "Imperial"},
// 		{Name: "Cup (c)", Type: "Imperial"},
// 		{Name: "Gallon (gal)", Type: "Imperial"},
// 		{Name: "Quart (qt)", Type: "Imperial"},
// 		{Name: "Pint (pt)", Type: "Imperial"},
// 		{Name: "Tablespoon (tbsp)", Type: "Imperial"},
// 		{Name: "Teaspoon (tsp)", Type: "Imperial"},
// 		{Name: "Box", Type: "Imperial"},
// 		{Name: "Pieces", Type: "Imperial"},
// 	}

// 	for _, data := range measurements {
// 		if err := models.DB.Create(&data).Error; err != nil {
// 			log.Printf("Could not insert data: %v\n", err)
// 		}
// 	}
// }
