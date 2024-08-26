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

func initializeSampleData_bk(db *gorm.DB) {
	// Tạo dữ liệu mẫu cho Temperature và SizeOption
	temperatureHot := models.Temperature{Name: "Hot"}
	temperatureIced := models.Temperature{Name: "Iced"}
	sizeSmall := models.SizeOption{Name: "Small"}
	sizeMedium := models.SizeOption{Name: "Medium"}
	sizeLarge := models.SizeOption{Name: "Large"}

	db.Create(&temperatureHot)
	db.Create(&temperatureIced)
	db.Create(&sizeSmall)
	db.Create(&sizeMedium)
	db.Create(&sizeLarge)

	// Tạo TemperatureSize cho Hot và Iced
	hotSmall := models.TemperatureSize{TemperatureID: temperatureHot.ID, SizeOptionID: sizeSmall.ID, Price: 3.0, Currency: "$", Default: true}
	hotMedium := models.TemperatureSize{TemperatureID: temperatureHot.ID, SizeOptionID: sizeMedium.ID, Price: 3.5, Currency: "$", Default: false}
	hotLarge := models.TemperatureSize{TemperatureID: temperatureHot.ID, SizeOptionID: sizeLarge.ID, Price: 4.0, Currency: "$", Default: false}

	icedSmall := models.TemperatureSize{TemperatureID: temperatureIced.ID, SizeOptionID: sizeSmall.ID, Price: 3.5, Currency: "$", Default: false}
	icedMedium := models.TemperatureSize{TemperatureID: temperatureIced.ID, SizeOptionID: sizeMedium.ID, Price: 4.0, Currency: "$", Default: false}
	icedLarge := models.TemperatureSize{TemperatureID: temperatureIced.ID, SizeOptionID: sizeLarge.ID, Price: 4.5, Currency: "$", Default: false}

	db.Create(&hotSmall)
	db.Create(&hotMedium)
	db.Create(&hotLarge)
	db.Create(&icedSmall)
	db.Create(&icedMedium)
	db.Create(&icedLarge)

	// Tạo các modifier cho Americano
	modifierExtraShot := models.Modifier{Name: "Extra Shot", Price: 1.0, Currency: "$"}
	modifierWhippedCream := models.Modifier{Name: "Whipped Cream", Price: 0.5, Currency: "$"}
	modifierNutmeg := models.Modifier{Name: "Nutmeg", Price: 4.29, Currency: "$"}

	db.Create(&modifierExtraShot)
	db.Create(&modifierWhippedCream)
	db.Create(&modifierNutmeg)

	// Tạo sản phẩm Latte với cấu trúc tương tự

	// Tạo các modifier cho Latte
	modifierVanillaSyrup := models.Modifier{Name: "Vanilla Syrup", Price: 0.5, Currency: "$"}
	modifierCaramelSyrup := models.Modifier{Name: "Caramel Syrup", Price: 0.7, Currency: "$"}
	modifierAlmondMilk := models.Modifier{Name: "Almond Milk", Price: 1.0, Currency: "$"}

	db.Create(&modifierVanillaSyrup)
	db.Create(&modifierCaramelSyrup)
	db.Create(&modifierAlmondMilk)

	log.Println("Sample products have been created.")
	// const productTemp =  {
	//     "average_rating": 4.9,
	//     "description": "Latte is a popular coffee drink made with espresso and steamed milk. It's creamy and smooth, perfect for a cozy morning or an afternoon pick-me-up.",
	//     "discount": 0,
	//     "favourite": true,
	//     "id": 2,
	//     "imagelink_portrait": "/path/to/latte_portrait.png",
	//     "imagelink_square": "/path/to/latte_square.png",
	//     "index": 1,
	//     "ingredients": "Espresso, Milk",
	//     "modifiers": {
	//         "choices": [
	//             {
	//                 "currency": "$",
	//                 "default": false,
	//                 "id": 4,
	//                 "name": "Vanilla Syrup",
	//                 "price": 0.5
	//             },
	//             {
	//                 "currency": "$",
	//                 "default": false,
	//                 "id": 5,
	//                 "name": "Caramel Syrup",
	//                 "price": 0.7
	//             },
	//             {
	//                 "currency": "$",
	//                 "default": false,
	//                 "id": 6,
	//                 "name": "Almond Milk",
	//                 "price": 1
	//             }
	//         ],
	//         "maxqty": 3,
	//         "minqty": 0
	//     },
	//     "name": "Latte",
	//     "options": [
	//         {
	//             "choices": [
	//                 {
	//                     "default": true,
	//                     "name": "Hot",
	//                     "TemperatureId": 1,
	//                     "size_options": [
	//                         {
	//                             "SizeOptionId": 1,
	//                             "currency": "$",
	//                             "default": true,
	//                             "name": "Small",
	//                             "price": 3
	//                         },
	//                         {
	//                             "SizeOptionId": 2,
	//                             "currency": "$",
	//                             "default": false,
	//                             "name": "Medium",
	//                             "price": 3.5
	//                         },
	//                         {
	//                             "SizeOptionId": 3,
	//                             "currency": "$",
	//                             "default": false,
	//                             "name": "Large",
	//                             "price": 4
	//                         }
	//                     ]
	//                 },
	//                 {
	//                     "default": false,
	//                     "name": "Iced",
	//                     "TemperatureId": 2,
	//                     "size_options": [
	//                         {
	//                             "SizeOptionId": 1,
	//                             "currency": "$",
	//                             "default": false,
	//                             "name": "Small",
	//                             "price": 3.5
	//                         },
	//                         {
	//                             "SizeOptionId": 2,
	//                             "currency": "$",
	//                             "default": false,
	//                             "name": "Medium",
	//                             "price": 4
	//                         },
	//                         {
	//                             "SizeOptionId": 3,
	//                             "currency": "$",
	//                             "default": false,
	//                             "name": "Large",
	//                             "price": 4.5
	//                         }
	//                     ]
	//                 }
	//             ],
	//             "name": "Temperature"
	//         }
	//     ],
	//     "ratings_count": "8,124",
	//     "roasted": "Light Roasted",
	//     "special_ingredient": "With Foam Milk",
	//     "type": "Coffee"
	// }
}

func init() {
	// var err error
	DB, err := gorm.Open(sqlite.Open("test.db"), &gorm.Config{})
	// DB.LogMode(true)
	if err != nil {
		panic("failed to connect to database")
	}
	DB.AutoMigrate(
		&models.User{},

		&models.Modifier{},
		&models.Categories{},
		&models.Size{},
		&models.Temperature{},
	)

	// Khởi tạo dữ liệu mẫu
	// initializeSampleData(DB)
	// initializeSampleData_bk(DB)
	// Tạo dữ liệu mẫu
	// createIceCreamProduct(DB)

	models.DB = DB
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	r := routes.SetupRouter()

	r.Run(":8080")
}
