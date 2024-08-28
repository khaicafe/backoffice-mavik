package main

import (
	"log"
	"mavik-backend/models"
	"mavik-backend/routes"

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
	DB.AutoMigrate(
		&models.User{},
		&models.Image{},
		&models.Modifier{},
		&models.GroupModifier{},
		&models.Group{},
		&models.Category{},
		&models.Size{},
		&models.Temperature{},
		&models.Product{},
		&models.ProductTempSize{},
		&models.ProductGroup{},
		&models.ProductCategory{},
		//combo
		&models.ProductCombo{},
		&models.Combo{},
		&models.ComboCategory{},
		&models.Menu{},
	)

	models.DB = DB
	// Seed data if necessary
	models.SeedDefaultData(DB)
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	r := routes.SetupRouter()

	r.Run(":8080")
}
