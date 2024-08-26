package controllers

// GetColumnNames retrieves the column names from a given model struct
// func GetColumnNames(db *gorm.DB, model interface{}) ([]string, error) {
// 	// Get the table name from the model
// 	scope := db.NewScope(model)
// 	tableName := scope.TableName()

// 	// Get the columns info from the table
// 	columns, err := db.DB().Query("PRAGMA table_info(" + tableName + ")")
// 	if err != nil {
// 		return nil, err
// 	}
// 	defer columns.Close()

// 	var columnNames []string
// 	for columns.Next() {
// 		var (
// 			cid        int
// 			name       string
// 			ctype      string
// 			notnull    int
// 			dflt_value interface{}
// 			pk         int
// 		)
// 		if err := columns.Scan(&cid, &name, &ctype, &notnull, &dflt_value, &pk); err != nil {
// 			return nil, err
// 		}
// 		columnNames = append(columnNames, name)
// 	}

// 	return columnNames, nil
// }
