package utils

import (
	"encoding/json"
)

func RemoveInvalidEntries(input interface{}) interface{} {
	jsonData, err := json.Marshal(input)
	if err != nil {
		return input
	}

	var result interface{}
	err = json.Unmarshal(jsonData, &result)
	if err != nil {
		return input
	}

	cleanData := cleanInvalidEntries(result)
	return cleanData
}

func cleanInvalidEntries(data interface{}) interface{} {
	switch v := data.(type) {
	case []interface{}:
		var result []interface{}
		for _, item := range v {
			cleanedItem := cleanInvalidEntries(item)
			if !isZeroID(cleanedItem) {
				result = append(result, cleanedItem)
			}
		}
		return result
	case map[string]interface{}:
		for key, value := range v {
			v[key] = cleanInvalidEntries(value)
			if key == "ID" && isZeroID(v[key]) {
				return nil
			}
		}
		return v
	default:
		return data
	}
}

func isZeroID(value interface{}) bool {
	if id, ok := value.(float64); ok && id == 0 {
		return true
	}
	return false
}
