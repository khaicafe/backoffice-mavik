package utils

import (
	"encoding/json"
	"log"
)

// PrintPrettyJSON nhận vào dữ liệu và in ra dưới dạng JSON có thụt lề
func PrintPrettyJSON(data interface{}) {
	jsonData, err := json.MarshalIndent(data, "", "  ")
	if err != nil {
		log.Fatalf("Error marshaling data to JSON: %v", err)
	}

	// In ra JSON đã được định dạng
	log.Println(string(jsonData))
}
