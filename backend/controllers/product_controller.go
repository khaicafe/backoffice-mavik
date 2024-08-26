package controllers

// // GetProducts - Lấy danh sách sản phẩm cùng các tùy chọn và modifiers
// func GetProducts(c *gin.Context) {
// 	var products []models.Product
// 	if err := models.DB.Preload("ProductOptions.TemperatureSize.Temperature").
// 		Preload("ProductOptions.TemperatureSize.Size").
// 		Preload("ProductModifiers.Modifier").
// 		Find(&products).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	var response []map[string]interface{}
// 	for _, product := range products {
// 		productMap := map[string]interface{}{
// 			"id":                 product.ID,
// 			"name":               product.Name,
// 			"description":        product.Description,
// 			"roasted":            product.Roasted,
// 			"imagelink_square":   product.ImageLinkSquare,
// 			"imagelink_portrait": product.ImageLinkPortrait,
// 			"ingredients":        product.Ingredients,
// 			"special_ingredient": product.SpecialIngredient,
// 			"discount":           product.Discount,
// 			"average_rating":     product.AverageRating,
// 			"ratings_count":      product.RatingsCount,
// 			"favourite":          product.Favourite,
// 			"type":               product.Type,
// 			"index":              product.Index,
// 			"options":            buildProductOptions(product.ProductOptions),
// 			"modifiers":          buildProductModifiers(product.ProductModifiers),
// 		}
// 		response = append(response, productMap)
// 	}

// 	c.JSON(http.StatusOK, response)
// }

// // buildProductOptions - Xây dựng JSON cho ProductOptions
// func buildProductOptions(options []models.ProductOption) []map[string]interface{} {
// 	temperatureMap := make(map[uint]map[string]interface{})

// 	for _, option := range options {
// 		tempID := option.TemperatureSize.Temperature.ID
// 		tempName := option.TemperatureSize.Temperature.Name

// 		// Debugging để kiểm tra tên Temperature
// 		log.Printf("Processing Temperature ID: %d, Name: %s\n", tempID, tempName)

// 		if _, exists := temperatureMap[tempID]; !exists {
// 			temperatureMap[tempID] = map[string]interface{}{
// 				"default": option.Default,
// 				"name":    tempName,
// 				"size_options": []map[string]interface{}{
// 					{
// 						"SizeOptionId": option.TemperatureSize.Size.ID,
// 						"name":         option.TemperatureSize.Size.Name,
// 						"price":        option.TemperatureSize.Price,
// 						"currency":     option.TemperatureSize.Currency,
// 						"default":      option.TemperatureSize.Default,
// 					},
// 				},
// 			}
// 		} else {
// 			sizeOptions := temperatureMap[tempID]["size_options"].([]map[string]interface{})
// 			sizeOptions = append(sizeOptions, map[string]interface{}{
// 				"SizeOptionId": option.TemperatureSize.Size.ID,
// 				"name":         option.TemperatureSize.Size.Name,
// 				"price":        option.TemperatureSize.Price,
// 				"currency":     option.TemperatureSize.Currency,
// 				"default":      option.TemperatureSize.Default,
// 			})
// 			temperatureMap[tempID]["size_options"] = sizeOptions
// 		}
// 	}

// 	var choices []map[string]interface{}
// 	for _, v := range temperatureMap {
// 		choices = append(choices, v)
// 	}

// 	return []map[string]interface{}{
// 		{
// 			"name":    "Temperature",
// 			"choices": choices,
// 		},
// 	}
// }

// // buildProductModifiers - Xây dựng JSON cho ProductModifiers
// func buildProductModifiers(modifiers []models.ProductModifier) map[string]interface{} {
// 	if len(modifiers) == 0 {
// 		return nil
// 	}

// 	choices := []map[string]interface{}{}
// 	for _, modifier := range modifiers {
// 		choice := map[string]interface{}{
// 			"id":       modifier.ID,
// 			"name":     modifier.Modifier.Name,
// 			"price":    modifier.Modifier.Price,
// 			"currency": modifier.Modifier.Currency,
// 			"default":  modifier.Default,
// 		}
// 		choices = append(choices, choice)
// 	}

// 	return map[string]interface{}{
// 		"minqty":  modifiers[0].MinQty,
// 		"maxqty":  modifiers[0].MaxQty,
// 		"choices": choices,
// 	}
// }

// // CreateProduct - Tạo mới sản phẩm cùng các tùy chọn và modifiers
// func CreateProduct(c *gin.Context) {
// 	var input struct {
// 		Name              string  `json:"name"`
// 		Description       string  `json:"description"`
// 		Roasted           string  `json:"roasted"`
// 		ImageLinkSquare   string  `json:"imagelink_square"`
// 		ImageLinkPortrait string  `json:"imagelink_portrait"`
// 		Ingredients       string  `json:"ingredients"`
// 		SpecialIngredient string  `json:"special_ingredient"`
// 		Discount          float64 `json:"discount"`
// 		AverageRating     float64 `json:"average_rating"`
// 		RatingsCount      string  `json:"ratings_count"`
// 		Favourite         bool    `json:"favourite"`
// 		Type              string  `json:"type"`
// 		Index             int     `json:"index"`
// 		Options           []struct {
// 			Name    string `json:"name"`
// 			Choices []struct {
// 				Default       bool   `json:"default"`
// 				Name          string `json:"name"`
// 				TemperatureId uint   `json:"TemperatureId"`
// 				SizeOptions   []struct {
// 					Name         string  `json:"name"`
// 					Price        float64 `json:"price"`
// 					Currency     string  `json:"currency"`
// 					Default      bool    `json:"default"`
// 					SizeOptionID uint    `json:"SizeOptionId"`
// 				} `json:"size_options"`
// 			} `json:"choices"`
// 		} `json:"options"`
// 		Modifiers struct {
// 			MinQty  int `json:"minqty"`
// 			MaxQty  int `json:"maxqty"`
// 			Choices []struct {
// 				Name       string  `json:"name"`
// 				Price      float64 `json:"price"`
// 				Currency   string  `json:"currency"`
// 				Default    bool    `json:"default"`
// 				ModifierID uint    `json:"ModifierId"`
// 			} `json:"choices"`
// 		} `json:"modifiers"`
// 	}

// 	// Parse JSON từ yêu cầu
// 	if err := c.ShouldBindJSON(&input); err != nil {
// 		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Tạo sản phẩm mới từ dữ liệu JSON
// 	newProduct := models.Product{
// 		Name:              input.Name,
// 		Description:       input.Description,
// 		Roasted:           input.Roasted,
// 		ImageLinkSquare:   input.ImageLinkSquare,
// 		ImageLinkPortrait: input.ImageLinkPortrait,
// 		Ingredients:       input.Ingredients,
// 		SpecialIngredient: input.SpecialIngredient,
// 		Discount:          input.Discount,
// 		AverageRating:     input.AverageRating,
// 		RatingsCount:      input.RatingsCount,
// 		Favourite:         input.Favourite,
// 		Type:              input.Type,
// 		Index:             input.Index,
// 	}

// 	// Lưu sản phẩm vào cơ sở dữ liệu trước khi thêm các tùy chọn và modifiers
// 	if err := models.DB.Create(&newProduct).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Xử lý ProductOptions
// 	for _, option := range input.Options {
// 		for _, choice := range option.Choices {
// 			for _, sizeOption := range choice.SizeOptions {
// 				temperatureSize := models.TemperatureSize{
// 					Price:         sizeOption.Price,
// 					Currency:      sizeOption.Currency,
// 					Default:       sizeOption.Default,
// 					TemperatureID: choice.TemperatureId,
// 					SizeOptionID:  sizeOption.SizeOptionID,
// 				}
// 				if err := models.DB.Create(&temperatureSize).Error; err != nil {
// 					c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 					return
// 				}

// 				newProductOption := models.ProductOption{
// 					ProductID:         newProduct.ID,
// 					TemperatureSizeID: temperatureSize.ID,
// 					Default:           choice.Default,
// 				}
// 				newProduct.ProductOptions = append(newProduct.ProductOptions, newProductOption)
// 			}
// 		}
// 	}

// 	// Lưu các tùy chọn sản phẩm vào cơ sở dữ liệu
// 	if err := models.DB.Save(&newProduct).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	// Xử lý ProductModifiers
// 	for _, modifierChoice := range input.Modifiers.Choices {
// 		newModifier := models.ProductModifier{
// 			ProductID:  newProduct.ID,
// 			MinQty:     input.Modifiers.MinQty,
// 			MaxQty:     input.Modifiers.MaxQty,
// 			Default:    modifierChoice.Default,
// 			ModifierID: modifierChoice.ModifierID,
// 		}
// 		newProduct.ProductModifiers = append(newProduct.ProductModifiers, newModifier)
// 	}

// 	// Lưu các modifiers sản phẩm vào cơ sở dữ liệu
// 	if err := models.DB.Save(&newProduct).Error; err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
// 		return
// 	}

// 	c.JSON(http.StatusOK, gin.H{"data": newProduct})
// }
