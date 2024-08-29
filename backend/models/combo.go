package models

// // ProductCombo model
// type ProductCombo struct {
// 	gorm.Model
// 	ProductID int     `json:"product_id"`
// 	ComboID   int     `json:"combo_id"`
// 	Qty       int     `json:"qty"`
// 	Price     float64 `json:"price"`
// 	Product   Product `gorm:"foreignKey:ProductID"`
// 	Combo     Combo   `gorm:"foreignKey:ComboID"`
// }

// // Combo model
// type Combo struct {
// 	gorm.Model
// 	Name              string          `json:"name"`
// 	Price             float64         `json:"price"`
// 	Currency          string          `json:"currency"`
// 	ImageLinkSquare   string          `json:"image_link_square"`
// 	ImageLinkPortrait string          `json:"image_link_portrait"`
// 	Type              string          `json:"type"`
// 	AverageRating     float64         `json:"average_rating"`
// 	RatingsCount      string          `json:"ratings_count"`
// 	Favourite         bool            `json:"favourite"`
// 	Categories        []ComboCategory `json:"categories" gorm:"foreignKey:ComboID"`
// 	ProductCombos     []ProductCombo  `json:"product_combos" gorm:"foreignKey:ComboID"`
// }

// // ComboCategory model
// type ComboCategory struct {
// 	gorm.Model
// 	CategoryID int      `json:"category_id"`
// 	ComboID    int      `json:"combo_id"`
// 	Category   Category `gorm:"foreignKey:CategoryID"`
// 	Combo      Combo    `gorm:"foreignKey:ComboID"`
// }

// // Menu model
// type Menu struct {
// 	gorm.Model
// 	Name     string    `json:"name"`
// 	Products []Product `json:"products" gorm:"many2many:menu_products;"`
// 	Combos   []Combo   `json:"combos" gorm:"many2many:menu_combos;"`
// }

// type Product struct {
// 	gorm.Model
// 	Name              string            `json:"name"`
// 	Description       string            `json:"description"`
// 	Type              string            `json:"type"`
// 	Currency          string            `json:"currency"`
// 	Price             float64           `json:"price"`
// 	Roasted           string            `json:"roasted"`
// 	ImageLinkSquare   string            `json:"image_link_square"`
// 	ImageLinkPortrait string            `json:"image_link_portrait"`
// 	Ingredients       string            `json:"ingredients"`
// 	SpecialIngredient string            `json:"special_ingredient"`
// 	Discount          float64           `json:"discount"`
// 	AverageRating     float64           `json:"average_rating"`
// 	RatingsCount      string            `json:"ratings_count"`
// 	Favourite         bool              `json:"favourite"`
// 	ProductGroups     []ProductGroup    `json:"product_groups" gorm:"foreignKey:ProductID"`
// 	ProductTempsSizes []ProductTempSize `json:"product_temp_sizes" gorm:"foreignKey:ProductID"`
// 	ProductCategory   []ProductCategory `json:"product_category" gorm:"foreignKey:ProductID"`
// }
