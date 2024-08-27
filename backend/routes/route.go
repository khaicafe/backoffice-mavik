package routes

import (
	"mavik-backend/controllers"
	"mavik-backend/middlewares"
	"mavik-backend/models"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Set("db", models.DB)
		c.Next()
	})

	// Configure CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"}, // Cho phép tất cả các nguồn gốc
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

	// r.GET("/api/users", controllers.GetUsers)
	// r.PUT("/api/users/role", controllers.UpdateUserRole)

	// Serve static files từ thư mục "assets"
	r.Static("/uploadImage", "./uploadImage")

	// Route để upload ảnh
	r.POST("/api/uploads", controllers.UploadImages)

	// CRUD for Image
	// r.POST("/images", controllers.CreateImage)       // Create
	r.GET("/images", controllers.GetAllImages)       // Read all
	r.GET("/images/:id", controllers.GetImageByID)   // Read one
	r.PUT("/images/:id", controllers.UpdateImage)    // Update
	r.DELETE("/images/:id", controllers.DeleteImage) // Delete

	// User routes
	// Route mới cho việc lấy tất cả người dùng
	r.GET("/api/users/all", controllers.GetAllUsers)
	r.GET("/api/user", controllers.FindUsers)
	r.POST("/api/users", controllers.CreateUser)
	r.PUT("/api/users/:id", controllers.UpdateUserPassword)
	r.DELETE("/api/users/:id", controllers.DeleteUser)

	// Product routes
	r.POST("/api/products", controllers.CreateProduct)
	r.GET("/api/products", controllers.GetProducts)
	r.GET("/api/products/:id", controllers.GetProduct)
	r.PUT("/api/products/:id", controllers.UpdateProduct)
	r.DELETE("/api/products/:id", controllers.DeleteProduct)

	// Modifier Routes
	r.POST("/api/modifier", controllers.CreateModifier)
	r.GET("/api/modifier/:id", controllers.GetModifier)
	r.GET("/api/modifiers", controllers.GetModifiers)
	r.PUT("/api/modifier/:id", controllers.UpdateModifier)
	r.DELETE("/api/modifier/:id", controllers.DeleteModifier)

	// Group Modifier routes
	r.POST("/api/modifierGroups", controllers.CreateGroup)
	r.GET("/api/modifierGroups", controllers.GetGroups)
	r.GET("/api/modifierGroups/:id", controllers.GetGroupByID)
	r.PUT("/api/modifierGroups/:id", controllers.UpdateGroup)
	r.DELETE("/api/modifierGroups/:id", controllers.DeleteGroup)

	r.POST("/api/group-modifiers", controllers.CreateGroupModifier)
	r.GET("/api/group-modifiers", controllers.GetAllGroupModifiers)

	// Categories Routes
	r.POST("/api/category", controllers.CreateCategory)
	r.GET("/api/category/:id", controllers.GetCategory)
	r.GET("/api/categories", controllers.GetCategories)
	r.PUT("/api/category/:id", controllers.UpdateCategory)
	r.DELETE("/api/category/:id", controllers.DeleteCategory)

	// Size Routes
	r.POST("/api/size", controllers.CreateSize)
	r.GET("/api/size/:id", controllers.GetSize)
	r.GET("/api/sizes", controllers.GetSizes)
	r.PUT("/api/size/:id", controllers.UpdateSize)
	r.DELETE("/api/size/:id", controllers.DeleteSize)

	// Temperature Routes
	r.POST("/api/temperature", controllers.CreateTemperature)
	r.GET("/api/temperature/:id", controllers.GetTemperature)
	r.GET("/api/temperatures", controllers.GetTemperatures)
	r.PUT("/api/temperature/:id", controllers.UpdateTemperature)
	r.DELETE("/api/temperature/:id", controllers.DeleteTemperature)

	// Protected routes
	auth := r.Group("/")
	auth.Use(middlewares.AuthMiddleware())
	{
		// Add protected routes here
		// auth.GET("/api/brands", controllers.GetBrands)
	}

	return r
}
