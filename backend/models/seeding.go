package models

import (
	"log"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

// SeedUsers - Seeds the database with default users
func SeedUsers(db *gorm.DB) {
	// Hash password "1" for all users
	passwordHash, err := bcrypt.GenerateFromPassword([]byte("1"), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}

	users := []User{
		{
			Name:         "Admin",
			MobileNumber: "123456",
			Role:         "admin",
			Password:     string(passwordHash),
			OTP:          "",
			OTPExpiresAt: time.Now(),
			ResendCount:  0,
		},
		{
			Name:         "Manager",
			MobileNumber: "112233",
			Role:         "manager",
			Password:     string(passwordHash),
			OTP:          "",
			OTPExpiresAt: time.Now(),
			ResendCount:  0,
		},
		{
			Name:         "Cashier",
			MobileNumber: "121212",
			Role:         "cashier",
			Password:     string(passwordHash),
			OTP:          "",
			OTPExpiresAt: time.Now(),
			ResendCount:  0,
		},
	}

	for _, user := range users {
		if err := db.FirstOrCreate(&user, User{MobileNumber: user.MobileNumber}).Error; err != nil {
			log.Fatalf("Cannot seed user %v: %v", user.Name, err)
		}
	}

	log.Println("Default users seeded successfully.")
}

// SeedModifiers - Seeds the database with default modifiers
func SeedModifiers(db *gorm.DB) {
	var count int64
	db.Model(&Modifier{}).Count(&count)
	if count > 0 {
		log.Println("Modifiers already seeded, skipping.")
		return
	}

	modifiers := []Modifier{
		{Name: "Extra Shot", Price: 1.50, Currency: "USD"},
		{Name: "Whipped Cream", Price: 0.75, Currency: "USD"},
		{Name: "Caramel Drizzle", Price: 0.50, Currency: "USD"},
		{Name: "Soy Milk", Price: 0.50, Currency: "USD"},
	}

	for _, modifier := range modifiers {
		if err := db.FirstOrCreate(&modifier, Modifier{Name: modifier.Name}).Error; err != nil {
			log.Fatalf("Cannot seed modifiers: %v", err)
		}
	}

	log.Println("Modifiers seeded successfully.")
}

// SeedCategories - Seeds the database with default categories
func SeedCategories(db *gorm.DB) {
	var count int64
	db.Model(&Categories{}).Count(&count)
	if count > 0 {
		log.Println("Categories already seeded, skipping.")
		return
	}

	categories := []Categories{
		{Name: "Coffee"},
		{Name: "Cold Beverages"},
		{Name: "Specialty Drinks"},
		{Name: "Seasonal Favorites"},
	}

	for _, category := range categories {
		if err := db.FirstOrCreate(&category, Categories{Name: category.Name}).Error; err != nil {
			log.Fatalf("Cannot seed categories: %v", err)
		}
	}

	log.Println("Categories seeded successfully.")
}

// SeedSizes - Seeds the database with default sizes
func SeedSizes(db *gorm.DB) {
	var count int64
	db.Model(&Size{}).Count(&count)
	if count > 0 {
		log.Println("Sizes already seeded, skipping.")
		return
	}

	sizes := []Size{
		{Name: "Small"},
		{Name: "Medium"},
		{Name: "Large"},
	}

	for _, size := range sizes {
		if err := db.FirstOrCreate(&size, Size{Name: size.Name}).Error; err != nil {
			log.Fatalf("Cannot seed sizes: %v", err)
		}
	}

	log.Println("Sizes seeded successfully.")
}

// SeedTemperatures - Seeds the database with default temperatures
func SeedTemperatures(db *gorm.DB) {
	var count int64
	db.Model(&Temperature{}).Count(&count)
	if count > 0 {
		log.Println("Temperatures already seeded, skipping.")
		return
	}

	temperatures := []Temperature{
		{Name: "Hot"},
		{Name: "Iced"},
	}

	for _, temperature := range temperatures {
		if err := db.FirstOrCreate(&temperature, Temperature{Name: temperature.Name}).Error; err != nil {
			log.Fatalf("Cannot seed temperatures: %v", err)
		}
	}

	log.Println("Temperatures seeded successfully.")
}

// SeedDefaultData - Run all the seeders to populate the database with default data
func SeedDefaultData(db *gorm.DB) {
	SeedUsers(db)
	SeedModifiers(db)
	SeedCategories(db)
	SeedSizes(db)
	SeedTemperatures(db)
}
