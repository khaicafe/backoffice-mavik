// SeedFlavourNotes seeds the database with default flavour notes
package models

import (
	"log"

	"gorm.io/gorm"
)

func SeedFlavourNotes(db *gorm.DB) {
	flavourNotes := []FlavourNote{
		{Name: "Milk - Dairy"},
		{Name: "Vegan"},
		{Name: "Alcohol"},
		{Name: "Berries"},
		{Name: "Bitter"},
		{Name: "Chocolate"},
		{Name: "Floral"},
		{Name: "Fruit"},
		{Name: "Gluten Free"},
		{Name: "Herbs & Spices"},
		{Name: "Juice"},
		{Name: "Milk - Alternative"},
		{Name: "Milk - Nuts"},
		{Name: "Nuts"},
		{Name: "Salt"},
		{Name: "Savory"},
		{Name: "Sour"},
		{Name: "Sugar-Free"},
		{Name: "Sweet"},
		{Name: "Umami"},
		{Name: "Variegates"},
		{Name: "Vegetables"},
	}

	for _, flavourNote := range flavourNotes {
		if err := db.FirstOrCreate(&flavourNote, FlavourNote{Name: flavourNote.Name}).Error; err != nil {
			log.Fatalf("Cannot seed flavour notes: %v", err)
		}
	}
}

// SeedCurrencies seeds the database with default currencies
func SeedCurrencies(db *gorm.DB) {
	currencies := []Currency{
		{Name: "Canadian dollar", Symbol: "$", Code: "CAD"},
		{Name: "Australian dollar", Symbol: "$", Code: "AUD"},
		{Name: "Brazilian real", Symbol: "R$", Code: "BRL"},
		{Name: "British pound", Symbol: "£", Code: "GBP"},
		{Name: "Chinese yuan", Symbol: "¥ or 元", Code: "CNY"},
		{Name: "Euro", Symbol: "€", Code: "EUR"},
		{Name: "Hong Kong dollar", Symbol: "$", Code: "HKD"},
		{Name: "Indian rupee", Symbol: "₹", Code: "INR"},
		{Name: "Japanese yen", Symbol: "¥", Code: "JPY"},
		{Name: "Mexican peso", Symbol: "$", Code: "MXN"},
		{Name: "New Taiwan dollar", Symbol: "$", Code: "TWD"},
		{Name: "New Zealand dollar", Symbol: "$", Code: "NZD"},
		{Name: "Philippine peso", Symbol: "₱", Code: "PHP"},
		{Name: "Singapore dollar", Symbol: "$", Code: "SGD"},
		{Name: "South Korean won", Symbol: "₩", Code: "KRW"},
		{Name: "Thai baht", Symbol: "฿", Code: "THB"},
		{Name: "United Arab Emirates dirham", Symbol: "د.إ", Code: "AED"},
		{Name: "United States dollar", Symbol: "$", Code: "USD"},
	}

	for _, currency := range currencies {
		if err := db.FirstOrCreate(&currency, Currency{Name: currency.Name}).Error; err != nil {
			log.Fatalf("Cannot seed currencies: %v", err)
		}
	}
}

// SeedMeasurements seeds the database with default measurements
func SeedMeasurements(db *gorm.DB) {
	measurements := []Measurement{
		{Name: "Kilogram", Symbol: "kg", ToGram: 1000},
		{Name: "Gram", Symbol: "g", ToGram: 1},
		{Name: "Litre(s)", Symbol: "l", ToGram: 1000}, // Assuming 1 litre of water equals 1000 grams
		{Name: "Milliliter", Symbol: "ml", ToGram: 1}, // Assuming 1 millilitre of water equals 1 gram
		{Name: "Pound", Symbol: "lb", ToGram: 453.592},
		{Name: "Ounce", Symbol: "oz", ToGram: 28.3495},
		{Name: "Cup", Symbol: "c", ToGram: 240},            // Assuming 1 cup of water equals 240 grams
		{Name: "Gallon", Symbol: "gal", ToGram: 3785.41},   // Assuming 1 gallon of water equals 3785.41 grams
		{Name: "Quart", Symbol: "qt", ToGram: 946.353},     // Assuming 1 quart of water equals 946.353 grams
		{Name: "Pint", Symbol: "pt", ToGram: 473.176},      // Assuming 1 pint of water equals 473.176 grams
		{Name: "Tablespoon", Symbol: "tbsp", ToGram: 14.3}, // Assuming 1 tablespoon equals 14.3 grams
		{Name: "Teaspoon", Symbol: "tsp", ToGram: 4.76},    // Assuming 1 teaspoon equals 4.76 grams
		{Name: "Box", Symbol: "box", ToGram: 1},            // No specific conversion, assuming 1 box equals 1 gram for placeholder
		{Name: "Pieces", Symbol: "pieces", ToGram: 1},      // No specific conversion, assuming 1 piece equals 1 gram for placeholder
	}

	for _, measurement := range measurements {
		if err := db.FirstOrCreate(&measurement, Measurement{Name: measurement.Name}).Error; err != nil {
			log.Fatalf("Cannot seed measurements: %v", err)
		}
	}
}

// SeedSuppliersAndBrands seeds the database with default suppliers and brands
func SeedSuppliersAndBrands(db *gorm.DB) {
	suppliers := []struct {
		Name   string
		Brands []string
	}{
		{Name: "Dairy Farmers", Brands: []string{"DairyPure", "TruMoo"}},
		{Name: "Cargill", Brands: []string{"Cargill Dairy", "Cargill Sweeteners"}},
		{Name: "Nestle", Brands: []string{"Nestle Carnation", "Nestle Toll House"}},
		{Name: "ADM", Brands: []string{"ADM Cocoa", "ADM Corn"}},
		{Name: "Unilever", Brands: []string{"Ben & Jerry's", "Magnum"}},
		{Name: "Barry Callebaut", Brands: []string{"Callebaut", "Carma"}},
		{Name: "Kerry Group", Brands: []string{"Kerry Dairy", "Kerry Ingredients"}},
		{Name: "Danone", Brands: []string{"Danone Yogurt", "Oikos"}},
		{Name: "General Mills", Brands: []string{"Yoplait", "Häagen-Dazs"}},
		{Name: "Arla Foods", Brands: []string{"Arla", "Lurpak"}},
		{Name: "Dean Foods", Brands: []string{"Land O'Lakes", "Friendly's"}},
		{Name: "Saputo", Brands: []string{"Stella", "Woolwich Dairy"}},
		{Name: "Lactalis", Brands: []string{"President", "Galbani"}},
		{Name: "FrieslandCampina", Brands: []string{"Dutch Lady", "Frico"}},
		{Name: "Fonterra", Brands: []string{"Anchor", "Mainland"}},
		{Name: "Glanbia", Brands: []string{"Optimum Nutrition", "BSN"}},
		{Name: "Bunge", Brands: []string{"Bunge Loders Croklaan", "Bunge Oils"}},
		{Name: "Olam International", Brands: []string{"Olam Cocoa", "Olam Dairy"}},
		{Name: "Ingredion", Brands: []string{"Ingredion Sweeteners", "Ingredion Starches"}},
		{Name: "Tate & Lyle", Brands: []string{"Tate & Lyle Sugars", "Tate & Lyle Sweeteners"}},
		{Name: "Royal DSM", Brands: []string{"DSM Nutritional Products", "DSM Food Specialties"}},
		{Name: "IFF", Brands: []string{"IFF Flavors", "IFF Fragrances"}},
		{Name: "Corbion", Brands: []string{"Purac", "Caravan Ingredients"}},
		{Name: "Chr. Hansen", Brands: []string{"Hansen Probiotics", "Hansen Cultures"}},
		{Name: "AarhusKarlshamn", Brands: []string{"AAK Oils", "AAK Speciality Fats"}},
		{Name: "Hilmar Cheese Company", Brands: []string{"Hilmar Whey", "Hilmar Cheese"}},
		{Name: "Meadow Foods", Brands: []string{"Meadow Dairy", "Meadow Cream"}},
		{Name: "First Milk", Brands: []string{"Lake District Dairy", "Pembrokeshire Cheese"}},
		{Name: "Müller", Brands: []string{"Müller Yogurt", "Müller Milk"}},
		{Name: "Valio", Brands: []string{"Valio Cheese", "Valio Dairy"}},
	}

	for _, supplier := range suppliers {
		sup := Supplier{Name: supplier.Name}
		if err := db.FirstOrCreate(&sup, Supplier{Name: supplier.Name}).Error; err != nil {
			log.Fatalf("Cannot seed suppliers: %v", err)
		}

		for _, brandName := range supplier.Brands {
			brand := Brand{Name: brandName, SupplierID: sup.ID}
			if err := db.FirstOrCreate(&brand, Brand{Name: brandName, SupplierID: sup.ID}).Error; err != nil {
				log.Fatalf("Cannot seed brands: %v", err)
			}
		}
	}
}
func SeedRecipeTypes(db *gorm.DB) {
	recipeTypes := []RecipeType{
		{Name: "Desserts - Frozen"},
		{Name: "Gelato"},
		{Name: "Ice Cream"},
		{Name: "Other"},
		{Name: "Sauces"},
		{Name: "Sherbet"},
		{Name: "Sorbetto"},
		{Name: "Variegate"},
		{Name: "Vegan"},
	}

	for _, recipeType := range recipeTypes {
		if err := db.FirstOrCreate(&recipeType, RecipeType{Name: recipeType.Name}).Error; err != nil {
			log.Fatalf("Cannot seed recipe types: %v", err)
		}
	}
}
func SeedIngredients(db *gorm.DB) {
	ingredients := []Ingredient{
		{Name: "Whole Milk", Description: "High-quality whole milk", SupplierID: 1, BrandID: 1, SupplierSKUCode: "SKU001", Organic: true, Vegan: false, Price: 3.50, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.98, Fat: 3.5, Sugar: 4.8, MSNF: 8.2, OtherSolids: 0.5, TotalSolids: 12.3, TotalWater: 87.7, Cost: 3.50, POD: 20, PAC: 20, GI: 50, ChangedBy: "Admin"},
		{Name: "Skim Milk", Description: "Low-fat milk", SupplierID: 1, BrandID: 1, SupplierSKUCode: "SKU002", Organic: true, Vegan: false, Price: 3.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.98, Fat: 0.5, Sugar: 5.0, MSNF: 8.5, OtherSolids: 0.5, TotalSolids: 14.0, TotalWater: 86.0, Cost: 3.00, POD: 18, PAC: 22, GI: 50, ChangedBy: "Admin"},
		{Name: "Heavy Cream", Description: "Rich heavy cream", SupplierID: 2, BrandID: 2, SupplierSKUCode: "SKU003", Organic: true, Vegan: false, Price: 4.50, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.95, Fat: 36.0, Sugar: 3.0, MSNF: 5.0, OtherSolids: 1.0, TotalSolids: 45.0, TotalWater: 55.0, Cost: 4.50, POD: 15, PAC: 10, GI: 40, ChangedBy: "Admin"},
		{Name: "Butter", Description: "Unsalted butter", SupplierID: 3, BrandID: 3, SupplierSKUCode: "SKU004", Organic: false, Vegan: false, Price: 5.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 500, TotalGram: 500, Yield: 0.95, Fat: 80.0, Sugar: 0.5, MSNF: 2.5, OtherSolids: 0.5, TotalSolids: 83.5, TotalWater: 16.5, Cost: 5.00, POD: 10, PAC: 5, GI: 30, ChangedBy: "Admin"},
		{Name: "Cane Sugar", Description: "Pure cane sugar", SupplierID: 4, BrandID: 4, SupplierSKUCode: "SKU005", Organic: true, Vegan: true, Price: 2.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 1.00, Fat: 0.0, Sugar: 100.0, MSNF: 0.0, OtherSolids: 0.0, TotalSolids: 100.0, TotalWater: 0.0, Cost: 2.00, POD: 30, PAC: 30, GI: 65, ChangedBy: "Admin"},
		{Name: "Corn Syrup", Description: "High-fructose corn syrup", SupplierID: 5, BrandID: 5, SupplierSKUCode: "SKU006", Organic: false, Vegan: true, Price: 1.50, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.98, Fat: 0.0, Sugar: 75.0, MSNF: 0.0, OtherSolids: 25.0, TotalSolids: 100.0, TotalWater: 0.0, Cost: 1.50, POD: 28, PAC: 28, GI: 85, ChangedBy: "Admin"},
		{Name: "Vanilla Extract", Description: "Pure vanilla extract", SupplierID: 6, BrandID: 6, SupplierSKUCode: "SKU007", Organic: true, Vegan: true, Price: 15.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 100, TotalGram: 100, Yield: 0.95, Fat: 0.0, Sugar: 0.5, MSNF: 0.0, OtherSolids: 1.0, TotalSolids: 1.5, TotalWater: 98.5, Cost: 15.00, POD: 2, PAC: 2, GI: 5, ChangedBy: "Admin"},
		{Name: "Cocoa Powder", Description: "Dutch-processed cocoa powder", SupplierID: 7, BrandID: 7, SupplierSKUCode: "SKU008", Organic: true, Vegan: true, Price: 8.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 500, TotalGram: 500, Yield: 0.98, Fat: 12.0, Sugar: 2.0, MSNF: 0.0, OtherSolids: 86.0, TotalSolids: 100.0, TotalWater: 0.0, Cost: 8.00, POD: 8, PAC: 12, GI: 10, ChangedBy: "Admin"},
		{Name: "Egg Yolks", Description: "Fresh egg yolks", SupplierID: 8, BrandID: 8, SupplierSKUCode: "SKU009", Organic: true, Vegan: false, Price: 6.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 500, TotalGram: 500, Yield: 0.90, Fat: 27.0, Sugar: 1.0, MSNF: 0.0, OtherSolids: 4.0, TotalSolids: 32.0, TotalWater: 68.0, Cost: 6.00, POD: 6, PAC: 6, GI: 45, ChangedBy: "Admin"},
		{Name: "Strawberries", Description: "Fresh strawberries", SupplierID: 9, BrandID: 9, SupplierSKUCode: "SKU010", Organic: true, Vegan: true, Price: 7.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.95, Fat: 0.0, Sugar: 7.7, MSNF: 0.0, OtherSolids: 1.3, TotalSolids: 9.0, TotalWater: 91.0, Cost: 7.00, POD: 9, PAC: 9, GI: 40, ChangedBy: "Admin"},
		{Name: "Blueberries", Description: "Fresh blueberries", SupplierID: 9, BrandID: 9, SupplierSKUCode: "SKU011", Organic: true, Vegan: true, Price: 8.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.95, Fat: 0.0, Sugar: 9.7, MSNF: 0.0, OtherSolids: 0.3, TotalSolids: 10.0, TotalWater: 90.0, Cost: 8.00, POD: 9, PAC: 9, GI: 53, ChangedBy: "Admin"},
		{Name: "Mango Puree", Description: "Smooth mango puree", SupplierID: 10, BrandID: 10, SupplierSKUCode: "SKU012", Organic: true, Vegan: true, Price: 10.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.98, Fat: 0.0, Sugar: 14.0, MSNF: 0.0, OtherSolids: 1.0, TotalSolids: 15.0, TotalWater: 85.0, Cost: 10.00, POD: 10, PAC: 10, GI: 60, ChangedBy: "Admin"},
		{Name: "Peanut Butter", Description: "Creamy peanut butter", SupplierID: 11, BrandID: 11, SupplierSKUCode: "SKU013", Organic: true, Vegan: true, Price: 5.50, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.98, Fat: 50.0, Sugar: 10.0, MSNF: 0.0, OtherSolids: 20.0, TotalSolids: 80.0, TotalWater: 20.0, Cost: 5.50, POD: 10, PAC: 10, GI: 30, ChangedBy: "Admin"},
		{Name: "Caramel Syrup", Description: "Rich caramel syrup", SupplierID: 12, BrandID: 12, SupplierSKUCode: "SKU014", Organic: false, Vegan: true, Price: 4.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.98, Fat: 0.0, Sugar: 60.0, MSNF: 0.0, OtherSolids: 20.0, TotalSolids: 80.0, TotalWater: 20.0, Cost: 4.00, POD: 8, PAC: 12, GI: 70, ChangedBy: "Admin"},
		{Name: "Honey", Description: "Pure natural honey", SupplierID: 13, BrandID: 13, SupplierSKUCode: "SKU015", Organic: true, Vegan: true, Price: 12.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.98, Fat: 0.0, Sugar: 82.0, MSNF: 0.0, OtherSolids: 0.5, TotalSolids: 82.5, TotalWater: 17.5, Cost: 12.00, POD: 5, PAC: 5, GI: 55, ChangedBy: "Admin"},
		{Name: "Almonds", Description: "Roasted almonds", SupplierID: 14, BrandID: 14, SupplierSKUCode: "SKU016", Organic: true, Vegan: true, Price: 15.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 500, TotalGram: 500, Yield: 0.98, Fat: 50.0, Sugar: 5.0, MSNF: 0.0, OtherSolids: 45.0, TotalSolids: 100.0, TotalWater: 0.0, Cost: 15.00, POD: 5, PAC: 10, GI: 25, ChangedBy: "Admin"},
		{Name: "Pistachios", Description: "Shelled pistachios", SupplierID: 14, BrandID: 14, SupplierSKUCode: "SKU017", Organic: true, Vegan: true, Price: 20.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 500, TotalGram: 500, Yield: 0.98, Fat: 60.0, Sugar: 5.0, MSNF: 0.0, OtherSolids: 35.0, TotalSolids: 100.0, TotalWater: 0.0, Cost: 20.00, POD: 5, PAC: 10, GI: 30, ChangedBy: "Admin"},
		{Name: "Coconut Milk", Description: "Creamy coconut milk", SupplierID: 15, BrandID: 15, SupplierSKUCode: "SKU018", Organic: true, Vegan: true, Price: 5.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.98, Fat: 20.0, Sugar: 2.0, MSNF: 0.0, OtherSolids: 5.0, TotalSolids: 27.0, TotalWater: 73.0, Cost: 5.00, POD: 12, PAC: 12, GI: 40, ChangedBy: "Admin"},
		{Name: "Mint Extract", Description: "Pure mint extract", SupplierID: 16, BrandID: 16, SupplierSKUCode: "SKU019", Organic: true, Vegan: true, Price: 12.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 100, TotalGram: 100, Yield: 0.98, Fat: 0.0, Sugar: 0.0, MSNF: 0.0, OtherSolids: 1.0, TotalSolids: 1.0, TotalWater: 99.0, Cost: 12.00, POD: 2, PAC: 2, GI: 10, ChangedBy: "Admin"},
		{Name: "Cinnamon", Description: "Ground cinnamon", SupplierID: 17, BrandID: 17, SupplierSKUCode: "SKU020", Organic: true, Vegan: true, Price: 7.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 100, TotalGram: 100, Yield: 0.98, Fat: 1.0, Sugar: 2.0, MSNF: 0.0, OtherSolids: 97.0, TotalSolids: 100.0, TotalWater: 0.0, Cost: 7.00, POD: 3, PAC: 3, GI: 5, ChangedBy: "Admin"},
		{Name: "Maple Syrup", Description: "Grade A maple syrup", SupplierID: 18, BrandID: 18, SupplierSKUCode: "SKU021", Organic: true, Vegan: true, Price: 10.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.98, Fat: 0.0, Sugar: 67.0, MSNF: 0.0, OtherSolids: 2.0, TotalSolids: 69.0, TotalWater: 31.0, Cost: 10.00, POD: 5, PAC: 5, GI: 54, ChangedBy: "Admin"},
		{Name: "Cocoa Nibs", Description: "Crushed cocoa beans", SupplierID: 19, BrandID: 19, SupplierSKUCode: "SKU022", Organic: true, Vegan: true, Price: 12.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 500, TotalGram: 500, Yield: 0.98, Fat: 53.0, Sugar: 0.5, MSNF: 0.0, OtherSolids: 46.5, TotalSolids: 100.0, TotalWater: 0.0, Cost: 12.00, POD: 7, PAC: 10, GI: 25, ChangedBy: "Admin"},
		{Name: "Hazelnuts", Description: "Roasted hazelnuts", SupplierID: 20, BrandID: 20, SupplierSKUCode: "SKU023", Organic: true, Vegan: true, Price: 18.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 500, TotalGram: 500, Yield: 0.98, Fat: 61.0, Sugar: 5.0, MSNF: 0.0, OtherSolids: 34.0, TotalSolids: 100.0, TotalWater: 0.0, Cost: 18.00, POD: 5, PAC: 10, GI: 30, ChangedBy: "Admin"},
		{Name: "Raspberries", Description: "Fresh raspberries", SupplierID: 9, BrandID: 9, SupplierSKUCode: "SKU024", Organic: true, Vegan: true, Price: 8.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.95, Fat: 0.0, Sugar: 4.5, MSNF: 0.0, OtherSolids: 1.5, TotalSolids: 6.0, TotalWater: 94.0, Cost: 8.00, POD: 9, PAC: 9, GI: 32, ChangedBy: "Admin"},
		{Name: "Passion Fruit Puree", Description: "Tart passion fruit puree", SupplierID: 10, BrandID: 10, SupplierSKUCode: "SKU025", Organic: true, Vegan: true, Price: 12.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.98, Fat: 0.0, Sugar: 11.0, MSNF: 0.0, OtherSolids: 2.0, TotalSolids: 13.0, TotalWater: 87.0, Cost: 12.00, POD: 8, PAC: 10, GI: 45, ChangedBy: "Admin"},
		{Name: "Lemon Juice", Description: "Fresh lemon juice", SupplierID: 21, BrandID: 21, SupplierSKUCode: "SKU026", Organic: true, Vegan: true, Price: 5.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 1000, TotalGram: 1000, Yield: 0.98, Fat: 0.0, Sugar: 2.5, MSNF: 0.0, OtherSolids: 2.0, TotalSolids: 4.5, TotalWater: 95.5, Cost: 5.00, POD: 4, PAC: 5, GI: 30, ChangedBy: "Admin"},
		{Name: "Orange Zest", Description: "Grated orange zest", SupplierID: 22, BrandID: 22, SupplierSKUCode: "SKU027", Organic: true, Vegan: true, Price: 6.00, CurrencyType: "USD", MeasurementID: 1, MeasurementAmount: 100, TotalGram: 100, Yield: 0.98, Fat: 0.5, Sugar: 4.0, MSNF: 0.0, OtherSolids: 95.5, TotalSolids: 100.0, TotalWater: 0.0, Cost: 6.00, POD: 2, PAC: 2, GI: 20, ChangedBy: "Admin"},
	}

	for _, ingredient := range ingredients {
		if err := db.FirstOrCreate(&ingredient, Ingredient{Name: ingredient.Name}).Error; err != nil {
			log.Fatalf("Cannot seed ingredients: %v", err)
		}
	}
}

func SeedRecipeNutritionRanges(db *gorm.DB) {
	// Check if any data exists, to avoid duplicating seed data
	// var count int64
	// db.Model(&RecipeNutritionRange{}).Count(&count)
	// if count > 0 {
	// 	log.Println("RecipeNutritionRange data already exists, skipping seeding.")
	// 	return
	// }

	// Seeding data
	ranges := []RecipeNutritionRange{
		{
			Type:           "Standard",
			SugarsMin:      12.0,
			SugarsMax:      16.0,
			FatMin:         8.0,
			FatMax:         12.0,
			MSNFMin:        6.0,
			MSNFMax:        10.0,
			OtherSolidsMin: 4.0,
			OtherSolidsMax: 8.0,
			TotalSolidsMin: 34.0,
			TotalSolidsMax: 40.0,
			TotalWaterMin:  50.0,
			TotalWaterMax:  60.0,
			PodMin:         90.0,
			PodMax:         110.0,
			PacMin:         60.0,
			PacMax:         80.0,
			GiMin:          10.0,
			GiMax:          30.0,
		},
		{
			Type:           "Premium",
			SugarsMin:      14.0,
			SugarsMax:      18.0,
			FatMin:         10.0,
			FatMax:         14.0,
			MSNFMin:        8.0,
			MSNFMax:        12.0,
			OtherSolidsMin: 5.0,
			OtherSolidsMax: 9.0,
			TotalSolidsMin: 36.0,
			TotalSolidsMax: 42.0,
			TotalWaterMin:  48.0,
			TotalWaterMax:  58.0,
			PodMin:         100.0,
			PodMax:         120.0,
			PacMin:         70.0,
			PacMax:         90.0,
			GiMin:          15.0,
			GiMax:          25.0,
		},
		// Add more types if needed
	}
	// Insert the seed data into the database
	if err := db.Create(&ranges).Error; err != nil {
		log.Fatalf("Failed to seed RecipeNutritionRange data: %v", err)
	} else {
		log.Println("Successfully seeded RecipeNutritionRange data.")
	}
}

func SeedingDefaultData(db *gorm.DB) {
	SeedFlavourNotes(db)
	SeedCurrencies(db)
	SeedMeasurements(db)
	SeedSuppliersAndBrands(db)
	SeedRecipeTypes(db)
	SeedIngredients(db)
	SeedRecipeNutritionRanges(db)
}
