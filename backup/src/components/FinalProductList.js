import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";
import finalProductService from "../services/finalProductService";

const FinalProductList = () => {
  const [finalProducts, setFinalProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFinalProducts();
  }, []);

  const fetchFinalProducts = async () => {
    const response = await finalProductService.getFinalProducts();
    setFinalProducts(response.data.data);
  };

  const handleEdit = (id) => {
    navigate(`/final-product-form/${id}`);
  };

  const handleDelete = async (id) => {
    await finalProductService.deleteFinalProduct(id);
    setFinalProducts(finalProducts.filter((product) => product.id !== id));
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Recipe</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Unit</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {finalProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.recipe.name}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.unit}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(product.id)}>Edit</Button>
                <Button
                  color="secondary"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FinalProductList;
