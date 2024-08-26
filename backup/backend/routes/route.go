package routes

import (
	"icecream-manager-backend/controllers"
	"icecream-manager-backend/middlewares"
	"icecream-manager-backend/models"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	// Configure CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://localhost:3000"}, // Allow requests from your frontend URL
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// Check if an admin exists
	var user models.User
	if err := models.DB.Where("role = ?", "admin").First(&user).Error; err != nil {
		// If no admin exists, enable setup endpoint
		r.POST("/api/setup", controllers.InitialSetup)
	}

	r.POST("/api/auth/signup", controllers.Signup)
	r.POST("/api/auth/verify-signup-otp", controllers.VerifySignupOTP)
	r.POST("/api/auth/send-otp", controllers.SendOTP)
	r.POST("/api/auth/resend-otp", controllers.ResendOTP)
	r.POST("/api/auth/login", controllers.Login)
	r.POST("/api/auth/reset-password", controllers.ResetPassword)

	r.GET("/api/users", controllers.GetUsers)
	r.PUT("/api/users/role", controllers.UpdateUserRole)

	// Ingredient routes
	r.POST("/api/ingredients", controllers.CreateIngredient)
	r.GET("/api/ingredients", controllers.GetIngredients)
	r.GET("/api/ingredients/search", controllers.SearchIngredients)
	r.GET("/api/ingredients/:id", controllers.GetIngredientByID)
	r.PUT("/api/ingredients/:id", controllers.UpdateIngredient)
	r.DELETE("/api/ingredients/:id", controllers.DeleteIngredient)

	// Supplier routes
	r.POST("/api/suppliers", controllers.CreateSupplier)
	r.GET("/api/suppliers", controllers.GetSuppliers)
	r.PUT("/api/suppliers/:id", controllers.UpdateSupplier)
	r.DELETE("/api/suppliers/:id", controllers.DeleteSupplier)

	// Brand routes
	r.POST("/api/brands", controllers.CreateBrand)
	r.GET("/api/brands", controllers.GetBrands)
	r.PUT("/api/brands/:id", controllers.UpdateBrand)
	r.DELETE("/api/brands/:id", controllers.DeleteBrand)

	// Flavour Note routes
	r.POST("/api/flavour-notes", controllers.CreateFlavourNote)
	r.GET("/api/flavour-notes", controllers.GetFlavourNotes)
	r.PUT("/api/flavour-notes/:id", controllers.UpdateFlavourNote)
	r.DELETE("/api/flavour-notes/:id", controllers.DeleteFlavourNote)

	// Currency routes
	r.POST("/api/currencies", controllers.CreateCurrency)
	r.GET("/api/currencies", controllers.GetCurrencies)
	r.PUT("/api/currencies/:id", controllers.UpdateCurrency)
	r.DELETE("/api/currencies/:id", controllers.DeleteCurrency)

	// Measurement routes
	r.POST("/api/measurements", controllers.CreateMeasurement)
	r.GET("/api/measurements", controllers.GetMeasurements)
	r.PUT("/api/measurements/:id", controllers.UpdateMeasurement)
	r.DELETE("/api/measurements/:id", controllers.DeleteMeasurement)

	// Recipe routes
	r.POST("/api/recipes", controllers.CreateRecipe)
	r.GET("/api/recipes", controllers.GetAllRecipes)
	r.GET("/api/recipes/:id", controllers.GetRecipeById)
	r.PUT("/api/recipes/:id", controllers.UpdateRecipe)
	r.DELETE("/api/recipes/:id", controllers.DeleteRecipe)
	r.GET("/api/recipes/search", controllers.SearchRecipes)

	// Recipe Nutrition routes
	r.POST("/api/recipeNutrition", controllers.CreateRecipeNutrition)
	r.GET("/api/recipeNutrition", controllers.GetRecipeNutrition)
	r.PUT("/api/recipeNutrition/:id", controllers.UpdateRecipeNutrition)
	r.DELETE("/api/recipeNutrition/:id", controllers.DeleteRecipeNutrition)

	// Recipe Type routes
	r.POST("/api/recipeType", controllers.CreateRecipeType)
	r.GET("/api/recipeType", controllers.GetRecipeTypes)
	r.PUT("/api/recipeType/:id", controllers.UpdateRecipeType)
	r.DELETE("/api/recipeType/:id", controllers.DeleteRecipeType)

	r.POST("/final_products", controllers.CreateFinalProduct)
	r.GET("/final_products", controllers.GetAllFinalProducts)
	r.GET("/final_products/:id", controllers.GetFinalProduct)
	r.PUT("/final_products/:id", controllers.UpdateFinalProduct)
	r.DELETE("/final_products/:id", controllers.DeleteFinalProduct)

	// Protected routes
	auth := r.Group("/")
	auth.Use(middlewares.AuthMiddleware())
	{
		// Add protected routes here
		// auth.GET("/api/brands", controllers.GetBrands)
	}

	return r
}
