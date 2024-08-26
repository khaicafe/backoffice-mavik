package models

import (
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

// func ConnectDatabase() {
// 	database, err := gorm.Open("sqlite3", "test.db")
// 	if err != nil {
// 		log.Fatal("Failed to connect to database!", err)
// 	}

// 	DB.AutoMigrate(
// 		&User{},
// 		&Ingredient{},
// 		&Recipe{},
// 		&RecipeIngredient{},
// 		&FlavourNote{},
// 		&Supplier{},
// 		&Brand{},
// 		&Currency{},
// 		&Measurement{},
// 	)

// 	DB = database
// }
