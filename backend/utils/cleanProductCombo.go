package utils

import "mavik-backend/models"

func CleanProducts(products []models.Product) []map[string]interface{} {
	var cleanedProducts []map[string]interface{}

	for _, product := range products {
		productMap := map[string]interface{}{
			"ID":                  product.ID,
			"name":                product.Name,
			"description":         product.Description,
			"price":               product.Price,
			"currency":            product.Currency,
			"roasted":             product.Roasted,
			"image_link_square":   product.ImageLinkSquare,
			"image_link_portrait": product.ImageLinkPortrait,
			"ingredients":         product.Ingredients,
			"discount":            product.Discount,
			"special_ingredient":  product.SpecialIngredient,
			"average_rating":      product.AverageRating,
			"ratings_count":       product.RatingsCount,
			"favourite":           product.Favourite,
			"categories":          CleanProductCategories(product.ProductCategory),
			"modifiers":           CleanGroupModifiers(product.ProductGroups),
			"product_temp_sizes":  CleanProductTempSizes(product.ProductTempsSizes),
		}

		cleanedProducts = append(cleanedProducts, productMap)
	}

	return cleanedProducts
}

func CleanProductCategories(categories []models.ProductCategory) []map[string]interface{} {
	var cleanedCategories []map[string]interface{}
	for _, category := range categories {
		categoryMap := map[string]interface{}{
			"ID":          category.ID,
			"category_id": category.CategoryID,
			"name":        category.Category.Name,
		}
		cleanedCategories = append(cleanedCategories, categoryMap)
	}
	return cleanedCategories
}

func CleanGroupModifiers(groups []models.ProductGroup) []map[string]interface{} {
	var cleanedGroups []map[string]interface{}
	for _, group := range groups {
		modifiers := CleanModifiers(group.Group.GroupModifiers)
		groupMap := map[string]interface{}{
			"group_id": group.GroupID,
			"maxqty":   group.Group.MaxQty,
			"minqty":   group.Group.MinQty,
			"name":     group.Group.Name,
			"type":     group.Type,
			"options":  modifiers,
		}
		cleanedGroups = append(cleanedGroups, groupMap)
	}
	return cleanedGroups
}

func CleanModifiers(modifiers []models.GroupModifier) []map[string]interface{} {
	var cleanedModifiers []map[string]interface{}
	for _, mod := range modifiers {
		modifierMap := map[string]interface{}{
			"modifier_id": mod.ModifierID,
			"name":        mod.Modifier.Name,
			"price":       mod.Modifier.Price,
			"currency":    mod.Modifier.Currency,
			"default":     mod.Default,
		}
		cleanedModifiers = append(cleanedModifiers, modifierMap)
	}
	return cleanedModifiers
}

func CleanProductTempSizes(sizes []models.ProductTempSize) []map[string]interface{} {
	var cleanedSizes []map[string]interface{}
	for _, size := range sizes {
		sizeMap := map[string]interface{}{
			"ID":          size.ID,
			"price":       size.Price,
			"currency":    size.Currency,
			"default":     size.Default,
			"size":        map[string]interface{}{"size_id": size.SizeID, "name": size.Size.Name},
			"temperature": map[string]interface{}{"temperature_id": size.TemperatureID, "name": size.Temperature.Name},
		}
		cleanedSizes = append(cleanedSizes, sizeMap)
	}
	return cleanedSizes
}

func CleanCombos(combos []models.Combo) []map[string]interface{} {
	var cleanedCombos []map[string]interface{}
	modifiers := []string{}
	productTempSizes := []string{}
	for _, combo := range combos {
		comboMap := map[string]interface{}{
			"ID":                  combo.ID,
			"name":                combo.Name,
			"price":               combo.Price,
			"currency":            combo.Currency,
			"discount":            combo.Discount,
			"image_link_square":   combo.ImageLinkSquare,
			"image_link_portrait": combo.ImageLinkPortrait,
			"average_rating":      combo.AverageRating,
			"ratings_count":       combo.RatingsCount,
			"favourite":           combo.Favourite,
			"categories":          CleanComboCategories(combo.Categories),
			"product_combos":      CleanProductCombos(combo.ProductCombos),
			"modifiers":           modifiers,        // Khởi tạo mảng rỗng
			"product_temp_sizes":  productTempSizes, // Khởi tạo mảng rỗng
			"type":                combo.Type,
		}
		// Nếu bạn muốn chắc chắn rằng modifiers là slice rỗng chứ không phải nil

		comboMap["modifiers"] = []string{}
		comboMap["product_temp_sizes"] = []string{}

		cleanedCombos = append(cleanedCombos, comboMap)
	}
	return cleanedCombos
}

func CleanComboCategories(categories []models.ComboCategory) []map[string]interface{} {
	var cleanedCategories []map[string]interface{}
	for _, category := range categories {
		categoryMap := map[string]interface{}{
			"ID":          category.ID,
			"category_id": category.CategoryID,
			"name":        category.Category.Name,
		}
		cleanedCategories = append(cleanedCategories, categoryMap)
	}
	return cleanedCategories
}

func CleanProductCombos(combos []models.ProductCombo) []map[string]interface{} {
	var cleanedCombos []map[string]interface{}
	for _, combo := range combos {
		comboMap := map[string]interface{}{
			"ID":         combo.ID,
			"qty":        combo.Qty,
			"price":      combo.Price,
			"product_id": combo.ProductID,
			"Product":    CleanProducts([]models.Product{combo.Product})[0],
		}
		cleanedCombos = append(cleanedCombos, comboMap)
	}
	return cleanedCombos
}
