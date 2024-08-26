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

	// User routes
	// Route mới cho việc lấy tất cả người dùng
	r.GET("/api/users/all", controllers.GetAllUsers)
	r.GET("/api/user", controllers.FindUsers)
	r.POST("/api/users", controllers.CreateUser)
	r.PUT("/api/users/:id", controllers.UpdateUserPassword)
	r.DELETE("/api/users/:id", controllers.DeleteUser)

	//products
	r.GET("/api/products", controllers.GetProducts)
	r.POST("/api/products", controllers.CreateProduct)
	// r.PUT("/api/products/:id", controllers.UpdateProduct)
	// r.DELETE("/api/products/:id", controllers.DeleteProduct)
	// // modifiers
	r.GET("/api/modifiers", controllers.GetModifiers)
	// r.POST("/api/modifiers", controllers.CreateModifier)
	// r.PUT("/api/modifiers/:id", controllers.UpdateModifier)
	// r.DELETE("/api/modifiers/:id", controllers.DeleteModifier)

	// Protected routes
	auth := r.Group("/")
	auth.Use(middlewares.AuthMiddleware())
	{
		// Add protected routes here
		// auth.GET("/api/brands", controllers.GetBrands)
	}

	return r
}
