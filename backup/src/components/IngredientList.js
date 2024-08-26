import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import brandService from "../services/brandService";
import ingredientService from "../services/ingredientService";
import supplierService from "../services/supplierService";
import IngredientForm from "./IngredientForm";

const IngredientList = () => {
  const [ingredients, setIngredients] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [brands, setBrands] = useState([]);

  const [open, setOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);

  useEffect(() => {
    fetchIngredients();
    fetchSuppliers();
    fetchBrands();
  }, []);

  const fetchIngredients = async () => {
    try {
      const response = await ingredientService.getIngredients();
      setIngredients(response.data.data || []);
    } catch (error) {
      console.error("Failed to fetch ingredients:", error);
      setIngredients([]);
    }
  };
  const fetchSuppliers = async () => {
    const response = await supplierService.getSuppliers();
    setSuppliers(response.data.suppliers);
  };

  const fetchBrands = async () => {
    const response = await brandService.getBrands();
    setBrands(response.data.brands);
  };
  const getSupplierName = (supplierId) => {
    const supplier = suppliers.find((supplier) => supplier.ID === supplierId);
    return supplier ? supplier.name : "";
  };
  const getBrandName = (brandId) => {
    const brand = brands.find((brand) => brand.ID === brandId);
    return brand ? brand.name : "";
  };

  const handleOpen = (ingredient = null) => {
    setSelectedIngredient(ingredient);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedIngredient(null);
  };

  const handleSave = async () => {
    fetchIngredients();
    handleClose();
  };

  const handleDelete = async (id) => {
    try {
      await ingredientService.deleteIngredient(id);
      fetchIngredients();
    } catch (error) {
      console.error("Failed to delete ingredient:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Ingredients
      </Typography>
      <Button variant="contained" color="primary" onClick={() => handleOpen()}>
        Add Ingredient
      </Button>
      <TableContainer component={Paper} style={{ marginTop: "20px" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Supplier SKU/CODE</TableCell>

              <TableCell>Measurement Type</TableCell>
              <TableCell>Measurement Amount</TableCell>
              <TableCell>Grams Yield</TableCell>
              <TableCell>Notes</TableCell>

              <TableCell
                align={"center"}
                sx={{ padding: "5px", minWidth: "165px" }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ingredients.map((ingredient) => (
              <TableRow key={ingredient.ID}>
                <TableCell>{ingredient.ID}</TableCell>
                <TableCell>{ingredient.name}</TableCell>
                <TableCell>{getSupplierName(ingredient.supplier_id)}</TableCell>
                <TableCell>{getBrandName(ingredient.brand_id)}</TableCell>
                <TableCell>{ingredient.supplier_sku_code}</TableCell>
                <TableCell>{ingredient.measurement.name}</TableCell>
                <TableCell>{ingredient.measurement_amount}</TableCell>
                <TableCell>{ingredient.yield}</TableCell>
                <TableCell>{ingredient.notes}</TableCell>

                <TableCell sx={{ padding: "8px", minWidth: "165px" }}>
                  <Button
                    variant="outlined"
                    onClick={() => handleOpen(ingredient)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDelete(ingredient.ID)}
                    style={{ marginLeft: "10px" }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <IngredientForm
        open={open}
        handleClose={handleClose}
        ingredient={selectedIngredient}
        fetchIngredients={fetchIngredients}
      />
    </Box>
  );
};

export default IngredientList;
